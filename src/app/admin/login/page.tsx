import { isAdminAuthConfigured } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="wrap grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-[420px] rounded-lg border border-hairline bg-white p-8 shadow-[0_18px_50px_-34px_rgba(8,8,16,.55)]">
        <p className="font-display text-sm font-semibold uppercase tracking-[1.5px] text-volt">Slogan Studio</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.5px]">Admin login</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Manage products, stock and customer orders.</p>
        <LoginForm configured={isAdminAuthConfigured()} />
      </div>
    </div>
  );
}
