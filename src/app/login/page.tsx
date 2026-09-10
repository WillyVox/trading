import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-center font-display text-2xl font-bold text-navy">Sign in</h1>
      <p className="mt-2 text-center text-sm text-muted">Sign in with your email and password.</p>
      <Card className="mt-8">
        <LoginForm />
      </Card>
    </div>
  );
}
