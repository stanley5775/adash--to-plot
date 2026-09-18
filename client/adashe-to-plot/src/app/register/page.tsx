import { RegisterForm } from "@/components/register/RegisterForm";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Account | Adashè to Plot",
  description:
    "Create your Adashè to Plot account to explore properties, manage your land applications, and access your dashboard.",
};
export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
    </>
  );
}
