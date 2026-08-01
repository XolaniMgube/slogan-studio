"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Places address autocomplete for the checkout street-address field.
 *
 * Uses `PlaceAutocompleteElement` (the current API — the older
 * `google.maps.places.Autocomplete` widget is deprecated). That element ships
 * its own input, keyboard handling, screen-reader support and session-token
 * management, which is why we mount it rather than building a custom dropdown.
 *
 * Renders nothing when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is unset — the checkout
 * page falls back to plain manual entry, so the absence of a key never blocks a sale.
 */

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = "google-maps-js";
/** If the widget hasn't mounted by now, fall back to manual entry rather than show a dead field. */
const MOUNT_TIMEOUT_MS = 8000;

export interface ResolvedAddress {
  line1: string;
  city: string;
  province: string;
  postal: string;
}

/* Minimal typings for the slice of the Maps JS API we touch, so we don't need @types/google.maps. */
interface AddressComponent {
  types: string[];
  longText: string | null;
  shortText: string | null;
}

interface PlaceLike {
  addressComponents?: AddressComponent[] | null;
  formattedAddress?: string | null;
  fetchFields(options: { fields: string[] }): Promise<unknown>;
}

interface PlacePredictionLike {
  toPlace(): PlaceLike;
}

interface AutocompleteElementLike extends HTMLElement {
  includedRegionCodes?: string[];
}

type AutocompleteCtor = new (options?: Record<string, unknown>) => AutocompleteElementLike;

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary?: (library: string) => Promise<Record<string, unknown>>;
        places?: { PlaceAutocompleteElement?: AutocompleteCtor };
      };
    };
  }
}

const CALLBACK_NAME = "__sloganStudioInitGoogleMaps";
/** Module-level so concurrent mounts share one load instead of injecting duplicate scripts. */
let mapsPromise: Promise<void> | null = null;

function loadMapsScript(): Promise<void> {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise<void>((resolve, reject) => {
    // With `loading=async` the API finishes initialising AFTER the script's load
    // event, so `script.onload` fires while google.maps.importLibrary is still
    // undefined. The `callback` param is the documented signal that it's ready.
    (window as unknown as Record<string, unknown>)[CALLBACK_NAME] = () => resolve();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}` +
      `&v=weekly&libraries=places&loading=async&callback=${CALLBACK_NAME}`;
    script.async = true;
    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("Google Maps failed to load."));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}

function pick(components: AddressComponent[], ...types: string[]): string {
  for (const type of types) {
    const match = components.find((component) => component.types.includes(type));
    if (match?.longText) return match.longText;
  }
  return "";
}

export function AddressAutocomplete({
  onResolved,
  onError,
}: {
  onResolved: (address: ResolvedAddress) => void;
  onError: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!MAPS_API_KEY) return;

    // NOTE: deliberately no "already mounted" ref guard here. React StrictMode
    // double-invokes effects in dev; a guard like that causes the second run to
    // bail while the first has already been cancelled, leaving an empty field.
    let element: AutocompleteElementLike | null = null;
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled && !element) {
        console.error("[Maps] Autocomplete did not mount in time — falling back to manual entry.");
        setFailed(true);
        onError();
      }
    }, MOUNT_TIMEOUT_MS);

    (async () => {
      try {
        await loadMapsScript();

        // importLibrary returns the constructors; fall back to the namespace for older loads.
        const placesLib = (await window.google?.maps?.importLibrary?.("places")) as
          | { PlaceAutocompleteElement?: AutocompleteCtor }
          | undefined;
        const Ctor = placesLib?.PlaceAutocompleteElement ?? window.google?.maps?.places?.PlaceAutocompleteElement;

        if (!Ctor) throw new Error("PlaceAutocompleteElement unavailable — is Places API (New) enabled?");
        if (cancelled || !containerRef.current) return;

        const el = new Ctor();
        el.includedRegionCodes = ["za"];

        el.addEventListener("gmp-select", (async (event: Event & { placePrediction?: PlacePredictionLike }) => {
          const prediction = event.placePrediction;
          if (!prediction) return;

          try {
            const place = prediction.toPlace();
            await place.fetchFields({ fields: ["addressComponents", "formattedAddress"] });

            const components = place.addressComponents ?? [];
            const streetNumber = pick(components, "street_number");
            const route = pick(components, "route");
            const line1 = [streetNumber, route].filter(Boolean).join(" ") || place.formattedAddress || "";

            onResolved({
              line1,
              // SA addresses put the suburb/town in locality; fall back through the
              // other levels Google may use before giving up.
              city: pick(components, "locality", "postal_town", "sublocality", "administrative_area_level_2"),
              province: pick(components, "administrative_area_level_1"),
              postal: pick(components, "postal_code"),
            });
          } catch (err) {
            console.error("[Maps] Failed to read the selected place:", err);
          }
        }) as EventListener);

        containerRef.current.appendChild(el);
        element = el;
        clearTimeout(timeout);
      } catch (err) {
        console.error("[Maps] Autocomplete unavailable:", err);
        if (!cancelled) {
          clearTimeout(timeout);
          setFailed(true);
          onError();
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      element?.remove();
      element = null;
    };
  }, [onResolved, onError]);

  if (!MAPS_API_KEY || failed) return null;

  return <div ref={containerRef} className="gmp-address-field" />;
}

export const isAddressAutocompleteEnabled = Boolean(MAPS_API_KEY);
