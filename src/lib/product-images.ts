import "server-only";

import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "./supabase/server";

const BUCKET = "product-images";
const MAX_IMAGES = 3;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadProductImages(files: File[], slug: string) {
  if (!files.length) return [];
  if (!isSupabaseAdminConfigured()) throw new Error("Supabase admin credentials are required to upload product images.");
  if (files.length > MAX_IMAGES) throw new Error(`Upload up to ${MAX_IMAGES} images per product.`);

  const supabase = createSupabaseAdminClient();
  const uploaded: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!file.size) continue;
    if (file.size > MAX_SIZE_BYTES) throw new Error(`${file.name} is larger than 5MB.`);
    if (!ALLOWED_TYPES.has(file.type)) throw new Error(`${file.name} must be a JPG, PNG or WebP image.`);

    const ext = extensionFor(file);
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "product";
    const path = `${safeSlug}/${Date.now()}-${index + 1}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    uploaded.push(data.publicUrl);
  }

  return uploaded;
}

/**
 * Removes a product's uploaded images from storage, translating the stored
 * public URLs back into bucket paths.
 *
 * Never throws: a product delete that succeeded shouldn't be reported as failed
 * because cleanup didn't. Orphaned files cost a little storage; a half-deleted
 * product confuses the admin.
 */
export async function deleteProductImages(urls: string[]) {
  if (!isSupabaseAdminConfigured() || !urls.length) return;

  const marker = `/${BUCKET}/`;
  const paths = urls
    .map((url) => {
      const at = url.indexOf(marker);
      return at === -1 ? null : url.slice(at + marker.length);
    })
    .filter((path): path is string => Boolean(path));

  if (!paths.length) return;

  try {
    const { error } = await createSupabaseAdminClient().storage.from(BUCKET).remove(paths);
    if (error) console.error(`[storage] Could not remove product images: ${error.message}`);
  } catch (err) {
    console.error("[storage] Could not remove product images:", err instanceof Error ? err.message : err);
  }
}

export function getImageFiles(formData: FormData) {
  return ["image1", "image2", "image3"]
    .map((name) => formData.get(name))
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function extensionFor(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}
