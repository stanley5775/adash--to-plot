"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Copy,
  FileImage,
  Landmark,
  MapPin,
  Upload,
  X,
} from "lucide-react";

import type { PlanRate } from "@/types/payment-plan";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import {
  useCreatePropertyPurchase,
  useSubmitPropertyPaymentReceipt,
} from "../../../hook/property-payment";
import toast from "react-hot-toast";
import { formatNaira } from "@/lib/payment";

type EstatePaymentInfo = {
  id: string;
  name: string;
  accountName: string | null;
  accountNumber: string | null;
  bankName: string | null;
};

export function PaymentPlanCard({
  price,
  existingPurchaseId,
  rate,
  estate,
  isApplication,
  propertyLocation,
  propertyCity,
  propertyState,
  highlight,
  isAtiPlusMember,
  isAuthenticated,
  canPurchase,
}: {
  existingPurchaseId: any;
  price: number;
  isApplication: any;
  rate: PlanRate;
  estate: EstatePaymentInfo;
  propertyLocation?: string;
  propertyCity?: string;
  propertyState?: string;
  highlight?: boolean;
  isAtiPlusMember?: boolean;
  isAuthenticated?: boolean;
  canPurchase?: boolean;
}) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const totalPayable = Number(rate.totalAmount);
  const originalTotal = Number(rate.originalTotalAmount);
  const createPurchase = useCreatePropertyPurchase();
  const submitReceipt = useSubmitPropertyPaymentReceipt();
  const monthlyAmount =
    rate.monthlyAmount !== null ? Number(rate.monthlyAmount) : null;

  const originalMonthlyAmount =
    rate.originalMonthlyAmount !== null
      ? Number(rate.originalMonthlyAmount)
      : null;

  const discountAmount = Number(rate.discountAmount ?? 0);
  const discountPercentage = Number(rate.discountPercentage ?? 0);

  const interestRate = Number(rate.interestRate);

  const isOutright = rate.durationMonths === null;

  const router = useRouter();

  const handlePurchase = () => {
    // Visitor → login
    if (!isAuthenticated) {
      const redirectUrl = `/properties/${rate.propertyId}`;

      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);

      return;
    }
    if (!isApplication) {
      router.push("/application");
      return;
    }
    // Property unavailable
    if (!canPurchase) {
      return;
    }

    // Any authenticated customer can purchase
    setShowPurchaseModal(true);
  };

  const handleCopyAccountNumber = async () => {
    if (!estate.accountNumber) return;

    await navigator.clipboard.writeText(estate.accountNumber);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setReceipt(file);
  };
  const handleSubmitReceipt = async () => {
    if (!receipt) {
      toast.error("Please upload your payment receipt.");
      return;
    }

    try {
      /**
       * IMPORTANT:
       *
       * If the user already has an ACTIVE/PENDING purchase,
       * reuse that purchase.
       *
       * Only create a new purchase when there is no existing purchase.
       */
      let purchaseId = existingPurchaseId ?? null;

      if (!purchaseId) {
        const purchaseResponse = await createPurchase.mutateAsync({
          propertyId: rate.propertyId,
          paymentPlanId: rate.id,
        });

        purchaseId = purchaseResponse.data.purchase.id;
      }

      if (!purchaseId) {
        throw new Error("Unable to determine purchase.");
      }

      await submitReceipt.mutateAsync({
        purchaseId,
        amount: isOutright ? totalPayable : (monthlyAmount ?? 0),
        receipt,
      });

      setReceipt(null);
      setShowPurchaseModal(false);

      toast.success("Payment receipt submitted successfully");
    } catch (error) {
      console.error("PROPERTY PURCHASE ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <>
      {/* PAYMENT PLAN CARD */}
      <div
        className={`flex flex-col gap-4 rounded-2xl border p-6 ${
          highlight
            ? "border-gold-500 bg-gold-50 shadow-[0_16px_32px_-20px_rgba(198,151,26,0.6)]"
            : "border-navy-800/10 bg-white"
        }`}>
        {/* PLAN HEADER */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-base font-bold text-navy-950">{rate.name}</h4>

          {interestRate === 0 ? (
            <Badge tone="success">0% interest</Badge>
          ) : (
            <Badge tone="gold">{interestRate}% interest</Badge>
          )}
        </div>

        {/* ATI PLUS PRIVILEGE */}
        {isAtiPlusMember && discountAmount > 0 && (
          <div className="rounded-xl border border-gold-300 bg-gold-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
              ATI Plus Member Privilege
            </p>

            <p className="mt-1 text-xs leading-5 text-ink-500">
              Your exclusive 5% member discount has been applied to this payment
              plan.
            </p>

            <p className="mt-2 text-sm font-bold text-gold-700">
              You saved {formatNaira(discountAmount)}
            </p>
          </div>
        )}

        {/* PAYMENT DETAILS */}
        {isOutright ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Full Payment
            </p>

            {isAtiPlusMember && discountAmount > 0 && (
              <p className="mt-1 text-sm text-ink-400 line-through">
                {formatNaira(originalTotal)}
              </p>
            )}

            <p className="text-2xl font-bold text-navy-950">
              {formatNaira(totalPayable)}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Monthly Payment
              </p>

              <p className="text-2xl font-bold text-navy-950">
                {formatNaira(monthlyAmount ?? 0)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-navy-800/10 pt-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  Duration
                </p>

                <p className="font-semibold text-navy-950">
                  {rate.durationMonths} months
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  Total Payable
                </p>

                <p className="font-semibold text-navy-950">
                  {formatNaira(totalPayable)}
                </p>
              </div>
            </div>

            {isAtiPlusMember && discountAmount > 0 && (
              <div className="border-t border-navy-800/10 pt-3">
                <p className="text-xs text-ink-400">
                  Original plan:{" "}
                  <span className="line-through">
                    {formatNaira(originalTotal)}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* TOTAL */}
        <div className="flex items-center justify-between border-t border-navy-800/10 pt-3 text-sm">
          <span className="text-ink-500">Total payable</span>

          <span className="font-bold text-navy-950">
            {formatNaira(totalPayable)}
          </span>
        </div>

        {/* PURCHASE BUTTON */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isAuthenticated === true && canPurchase !== true}
            className="w-full rounded-full bg-navy-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-50">
            {!isAuthenticated
              ? "Login to Purchase"
              : canPurchase
                ? "Buy Now"
                : "Currently Unavailable"}
          </button>
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-navy-800/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Property Purchase
                </p>

                <h2 className="mt-1 text-xl font-bold text-navy-950">
                  Complete Your Purchase
                </h2>

                <p className="mt-1 text-sm text-ink-500">
                  Make a bank transfer using the account details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPurchaseModal(false)}
                className="rounded-full p-2 text-ink-400 transition hover:bg-navy-50 hover:text-navy-950">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              {/* PROPERTY */}
              <div className="rounded-2xl border border-navy-800/10 bg-navy-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-white">
                    <Landmark className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Estate
                    </p>

                    <h3 className="mt-1 text-base font-bold text-navy-950">
                      {estate.name}
                    </h3>

                    {(propertyLocation || propertyCity || propertyState) && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                        <MapPin className="h-3.5 w-3.5" />

                        <span className="text-2xl font-bold text-navy-950">
                          {formatNaira(
                            isOutright ? totalPayable : (monthlyAmount ?? 0),
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SELECTED PLAN */}
              <div className="mt-5 rounded-2xl border border-gold-300 bg-gold-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gold-700">
                      Selected Payment Plan
                    </p>

                    <p className="mt-1 text-lg font-bold text-navy-950">
                      {rate.name}
                    </p>
                  </div>

                  {rate.durationMonths !== null && (
                    <Badge tone="gold">{rate.durationMonths} months</Badge>
                  )}
                </div>

                {isAtiPlusMember && discountAmount > 0 && (
                  <div className="mt-4 border-t border-gold-300 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-500">Original plan</span>

                      <span className="text-ink-400 line-through">
                        {formatNaira(originalTotal)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gold-700">ATI Plus discount</span>

                      <span className="font-semibold text-gold-700">
                        -{formatNaira(discountAmount)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-end justify-between border-t border-gold-300 pt-4">
                  <span className="text-sm font-medium text-ink-500">
                    Amount to transfer
                  </span>

                  <span className="text-2xl font-bold text-navy-950">
                    {formatNaira(
                      isOutright ? totalPayable : (monthlyAmount ?? 0),
                    )}
                  </span>
                </div>
              </div>

              {/* BANK DETAILS */}
              <div className="mt-5">
                <div className="mb-3">
                  <h3 className="text-base font-bold text-navy-950">
                    Transfer Payment To
                  </h3>

                  <p className="mt-1 text-xs text-ink-500">
                    Please transfer exactly the amount shown above.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-navy-800/10">
                  {/* BANK */}
                  <div className="flex items-center justify-between border-b border-navy-800/10 px-4 py-4">
                    <span className="text-sm text-ink-500">Bank</span>

                    <span className="text-sm font-semibold text-navy-950">
                      {estate.bankName || "Not provided"}
                    </span>
                  </div>

                  {/* ACCOUNT NAME */}
                  <div className="flex items-center justify-between border-b border-navy-800/10 px-4 py-4">
                    <span className="text-sm text-ink-500">Account Name</span>

                    <span className="max-w-[60%] text-right text-sm font-semibold text-navy-950">
                      {estate.accountName || "Not provided"}
                    </span>
                  </div>

                  {/* ACCOUNT NUMBER */}
                  <div className="flex items-center justify-between gap-3 px-4 py-4">
                    <div>
                      <p className="text-sm text-ink-500">Account Number</p>

                      <p className="mt-1 text-lg font-bold tracking-wide text-navy-950">
                        {estate.accountNumber || "Not provided"}
                      </p>
                    </div>

                    {estate.accountNumber && (
                      <button
                        type="button"
                        onClick={handleCopyAccountNumber}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-navy-800/10 px-3 py-2 text-xs font-semibold text-navy-950 transition hover:bg-navy-50">
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* INSTRUCTION */}
              <div className="mt-5 flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <Clipboard className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    After making the transfer
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    Upload your payment receipt below. Our administration team
                    will verify your payment before confirming your purchase.
                  </p>
                </div>
              </div>

              {/* RECEIPT UPLOAD */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-navy-950">
                  Payment Receipt
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-800/15 bg-navy-50/30 px-6 py-8 text-center transition hover:border-gold-400 hover:bg-gold-50/40">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleReceiptChange}
                  />

                  {receipt ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <FileImage className="h-6 w-6 text-green-600" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-navy-950">
                        {receipt.name}
                      </p>

                      <p className="mt-1 text-xs text-ink-400">
                        Click to replace receipt
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100">
                        <Upload className="h-6 w-6 text-navy-700" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-navy-950">
                        Upload payment receipt
                      </p>

                      <p className="mt-1 text-xs text-ink-400">
                        PNG, JPG or PDF
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="border-t border-navy-800/10 bg-white px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={handleSubmitReceipt}
                disabled={
                  !receipt ||
                  createPurchase.isPending ||
                  submitReceipt.isPending
                }
                className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-40">
                {createPurchase.isPending || submitReceipt.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </>
                ) : (
                  "Submit Receipt for Verification"
                )}
              </button>

              <p className="mt-2 text-center text-[11px] text-ink-400">
                Your purchase will remain pending until an administrator
                verifies your payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
