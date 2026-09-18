"use client";

import Script from "next/script";
import { Wallet, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
// import { useUser } from "@/context/UserContext";
useCreateAtiMembership;

import { useUser } from "../../../context/UserContext";
import {
  useCreateAtiMembership,
  useVerifyAtiMembership,
  useCheckAtiMembership,
} from "../../../hook/ati";

const ANNUAL_FEE = 20000;

export function JoinAtiPlusForm() {
  const { user } = useUser();

  const { data: membershipResult, isLoading: checkingMembership } =
    useCheckAtiMembership();

  const createAtiMembership = useCreateAtiMembership();
  const verifyAtiMembership = useVerifyAtiMembership();

  const membership = membershipResult?.data;

  const isMember = membership?.isMember === true;
  const isPending = membership?.status === "PENDING";
  const isExpired = membership?.status === "EXPIRED";

  function getMonthsRemaining(expiryDate: string) {
    const now = new Date();
    const expiry = new Date(expiryDate);

    const months =
      (expiry.getFullYear() - now.getFullYear()) * 12 +
      (expiry.getMonth() - now.getMonth());

    return Math.max(months, 0);
  }

  async function handlePayment() {
    if (!window.PaystackPop) {
      toast.error("Payment system is still loading. Please try again.");
      return;
    }

    if (!user?.email) {
      toast.error("Your email address is required.");
      return;
    }

    try {
      const result = await createAtiMembership.mutateAsync();

      console.log("ATI MEMBERSHIP CREATED:", result);

      const membershipId = result?.data?.membershipId;
      const amount = result?.data?.amount;
      const reference = result?.data?.reference;

      if (!membershipId || !amount || !reference) {
        console.error("Invalid ATI membership response:", result);
        toast.error("Invalid membership payment response.");
        return;
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: user.email,
        amount: amount * 100,
        ref: reference,

        callback: async (response: any) => {
          console.log("ATI PAYSTACK SUCCESS:", response);

          const paystackReference = response?.reference;

          if (!paystackReference) {
            toast.error("Payment reference is missing.");
            return;
          }

          try {
            const verified =
              await verifyAtiMembership.mutateAsync(paystackReference);

            console.log("ATI PAYMENT VERIFIED:", verified);

            if (verified?.success === true) {
              toast.success("ATI Plus membership activated successfully!");
            }
          } catch (error) {
            console.error("ATI PAYMENT VERIFICATION ERROR:", error);

            toast.error(
              error instanceof Error
                ? error.message
                : "ATI payment verification failed",
            );
          }
        },

        onClose: () => {
          console.log("ATI payment closed");
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("CREATE ATI MEMBERSHIP ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start ATI membership payment",
      );
    }
  }

  const isProcessing =
    createAtiMembership.isPending || verifyAtiMembership.isPending;

  if (checkingMembership) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-5 text-center">
        <p className="text-sm text-ink-500">
          Checking your ATI Plus membership...
        </p>
      </div>
    );
  }

  // ACTIVE MEMBER
  if (isMember && membership?.expiryDate) {
    const monthsRemaining = getMonthsRemaining(membership.expiryDate);

    return (
      <div className="rounded-2xl border border-green-300 bg-green-50 p-5">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />

          <span className="text-sm font-bold uppercase tracking-wide">
            ATI Plus Member
          </span>
        </div>

        <p className="mt-3 text-sm text-ink-700">
          You already have an active ATI Plus membership.
        </p>

        <div className="mt-4 rounded-xl border border-green-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Membership expires</span>

            <span className="font-semibold text-navy-950">
              {new Date(membership.expiryDate).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
            <span className="text-sm text-ink-500">Time remaining</span>

            <span className="font-bold text-green-700">
              {monthsRemaining} {monthsRemaining === 1 ? "month" : "months"}
            </span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-ink-400">
          You can renew after your current membership expires.
        </p>
      </div>
    );
  }

  // PAYMENT/MEMBERSHIP PENDING
  if (isPending) {
    return (
      <div className="rounded-2xl border border-gold-300 bg-gold-50 p-5">
        <div className="flex items-center gap-2 text-gold-700">
          <Clock className="h-5 w-5" />

          <span className="text-sm font-bold uppercase tracking-wide">
            Membership Pending
          </span>
        </div>

        <p className="mt-3 text-sm text-ink-700">
          You already have an ATI Plus membership payment waiting for
          verification.
        </p>

        <p className="mt-2 text-xs text-ink-500">
          Please complete or verify the existing payment before starting another
          membership payment.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
      />

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-gold-400 bg-gold-50 p-5">
          <div className="flex items-center gap-2 text-gold-700">
            <Wallet className="h-4 w-4" />

            <span className="text-sm font-bold uppercase tracking-wide">
              {isExpired
                ? "Membership Expired"
                : "Annual Subscription Required"}
            </span>
          </div>

          <p className="mt-2 text-sm text-ink-700">
            {isExpired
              ? "Your ATI Plus membership has expired. Renew for another 12 months."
              : "ATI Plus membership requires a flat ₦20,000 annual subscription, renewed every 12 months."}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-gold-400/40 pt-4 text-sm">
            <span className="text-ink-500">Amount due today</span>

            <span className="text-lg font-bold text-navy-950">
              ₦{ANNUAL_FEE.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handlePayment}
          disabled={isProcessing}>
          {createAtiMembership.isPending
            ? "Creating membership..."
            : verifyAtiMembership.isPending
              ? "Verifying payment..."
              : `Pay ₦${ANNUAL_FEE.toLocaleString()} & ${
                  isExpired ? "Renew" : "Join"
                }`}
        </Button>

        <p className="text-center text-xs text-ink-400">
          Payments are securely processed by Paystack. ATI Plus membership is
          renewed annually.
        </p>
      </div>
    </>
  );
}
