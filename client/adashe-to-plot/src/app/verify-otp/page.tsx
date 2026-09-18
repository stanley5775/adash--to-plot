import VerifyOtp from "@/components/auth/VerifyOTp";
import Loading from "@/components/ui/Loading";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOtp />
    </Suspense>
  );
}
