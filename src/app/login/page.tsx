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
      <h1 className="font-display text-navy text-center text-2xl font-bold">
        Sign in
      </h1>
      <p className="text-muted mt-2 text-center text-sm">
        Sign in with your email and password.
      </p>
      <Card className="mt-8">
        <LoginForm />
      </Card>
    </div>
  );
}
