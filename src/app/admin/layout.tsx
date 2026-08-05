import { AdminShell } from "./admin-shell";
import { logoutAdmin } from "./actions";

export const metadata = {
  title: "Back Office — Slogan Studio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  /* The logout Server Action is passed down as rendered markup so the shell can
     stay a client component without importing server actions directly. */
  const logout = (
    <form action={logoutAdmin}>
      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 font-display text-sm font-semibold text-[#a5aebc] transition hover:bg-white/[0.06] hover:text-white">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth={1.8}>
          <path d="M15 17l5-5-5-5M20 12H9M12 3H6a1 1 0 00-1 1v16a1 1 0 001 1h6" />
        </svg>
        Log out
      </button>
    </form>
  );

  return <AdminShell logout={logout}>{children}</AdminShell>;
}
