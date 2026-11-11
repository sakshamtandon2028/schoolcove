import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  const u = await getUser();
  if (u) redirect(u.role === "admin" ? "/admin" : "/dashboard");
  return (
    <div className="container-x max-w-md py-14">
      <div className="card p-6 sm:p-8">
        <p className="eyebrow">For schools</p>
        <h1 className="mt-1 text-3xl">Log in</h1>
        <p className="mb-5 mt-1 text-sm text-muted">See your enquiries and update your school page.</p>
        <LoginForm />
        <p className="mt-5 text-center text-sm text-muted">New here? <Link href="/for-schools#signup" className="font-semibold text-coral hover:underline">Claim your school</Link></p>
      </div>
    </div>
  );
}
