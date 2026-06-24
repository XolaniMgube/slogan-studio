import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[50vh] place-items-center py-24 text-center">
      <div>
        <div className="font-display text-7xl font-bold text-volt">404</div>
        <h1 className="mt-3 font-display text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted">That page doesn&apos;t exist — but plenty of graded tech does.</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          <span>Browse the store</span>
          <ArrowIcon className="h-4 w-4 stroke-white" />
        </Link>
      </div>
    </div>
  );
}
