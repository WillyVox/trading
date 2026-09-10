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
      <h1 className="text-center font-display text-2xl font-bold text-navy">Create an account</h1>
      <p className="mt-2 text-center text-sm text-muted">Register with your email and a password.</p>
      <Card className="mt-8">
        <RegisterForm />
      </Card>
    </div>
  );
}
