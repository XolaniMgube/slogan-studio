import Link from "next/link";
import { logoutAdmin } from "./actions";

export function AdminNav() {
  return (
    <div className="border-b border-hairline bg-white">
      <div className="wrap flex min-h-[64px] flex-wrap items-center gap-3 py-3">
        <Link href="/admin" className="font-display text-lg font-bold">
          Back Office
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <Link href="/admin/products" className="rounded-md px-3 py-2 font-display text-sm font-semibold text-muted hover:bg-paper-2 hover:text-ink">
            Products
          </Link>
          <Link href="/admin/orders" className="rounded-md px-3 py-2 font-display text-sm font-semibold text-muted hover:bg-paper-2 hover:text-ink">
            Orders
          </Link>
          <form action={logoutAdmin}>
            <button className="rounded-md px-3 py-2 font-display text-sm font-semibold text-muted hover:bg-paper-2 hover:text-ink">
              Logout
            </button>
          </form>
        </nav>
      </div>
    </div>
  );
}
