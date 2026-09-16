import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-navy text-center text-2xl font-bold">
        Create an account
      </h1>
      <p className="text-muted mt-2 text-center text-sm">
        Register with your email and a password.
      </p>
      <Card className="mt-8">
        <RegisterForm />
      </Card>
    </div>
  );
}
