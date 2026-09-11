import { LoginForm } from "@/components/login/LoginForm";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login Account | Adashè to Plot",
  description:
    "Login your Adashè to Plot account to explore properties, manage your land applications, and access your dashboard.",
};
export default function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
