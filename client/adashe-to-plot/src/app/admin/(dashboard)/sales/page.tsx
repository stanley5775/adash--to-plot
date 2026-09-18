"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Check, X, Loader2 } from "lucide-react";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatNaira, formatDate } from "@/lib/payment";

import {
  useGetAllPayment,
  useApprovePayment,
  useRejectPayment,
} from "../../../../../hook/admin";
import toast from "react-hot-toast";

type PaymentVerification = {
  verification: {
    id: string;
    purchaseId: string;
    userId: string;
    amount: string | number;
    receiptUrl: string;
    receiptPublicId?: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  };

  customer: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };

  purchase: {
    id: string;
    propertyId: string;
    paymentPlanId: string;
    propertyPrice: string | number;
    totalPayable: string | number;
    amountPaid: string | number;
    balance: string | number;
    durationMonths: number | null;
    paymentAmount: string | number;
    interestPercentage: string | number;
    status: string;
  };

  property: {
    id: string;
    estateId: string;
    status: string;
    location: string | null;
    city: string | null;
    state: string | null;
    description?: string | null;
    startingPrice?: string | number;
    totalPlots?: number;
  };

  estate: {
    id: string;
    name: string;
    accountName: string | null;
    accountNumber: string | null;
    bankName: string | null;
  };

  paymentPlan: {
    id: string;
    propertyId: string;
    estateId: string;
    name: string;
    durationMonths: number | null;
    totalAmount: string | number;
    monthlyAmount: string | number | null;
    interestRate: string | number;
  };
};

export default function AdminSalesPage() {
  const { data: payments = [], isLoading, isError, error } = useGetAllPayment();

  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();

  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentVerification | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async (payment: PaymentVerification) => {
    try {
      await approvePayment.mutateAsync(payment.verification.id);
      toast.success(
        `Payment from ${payment.customer.fullName} approved successfully.`,
      );
    } catch (error) {
      console.error("APPROVE PAYMENT ERROR:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to approve payment. Please try again.",
      );
    }
  };

  const openRejectModal = (payment: PaymentVerification) => {
    setSelectedPayment(payment);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    if (rejectPayment.isPending) return;

    setIsRejectModalOpen(false);
    setSelectedPayment(null);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!selectedPayment) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      toast.error("Please provide a reason for rejecting the payment.");
      return;
    }

    try {
      await rejectPayment.mutateAsync({
        verificationId: selectedPayment.verification.id,
        rejectionReason: reason,
      });
      toast.success(
        `Payment from ${selectedPayment.customer.fullName} rejected successfully.`,
      );
      setIsRejectModalOpen(false);
      setSelectedPayment(null);
      setRejectionReason("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reject payment. Please try again.",
      );
      console.error("REJECT PAYMENT ERROR:", error);
    }
  };

  const columns: Column<PaymentVerification>[] = [
    {
      header: "Customer",
      render: (payment) => (
        <div>
          <p className="font-semibold text-navy-950">
            {payment.customer.fullName}
          </p>

          <p className="text-xs text-ink-500">{payment.customer.email}</p>
        </div>
      ),
    },

    {
      header: "Property",
      render: (payment) => (
        <div>
          <p className="font-medium text-navy-950">
            {payment.property.location || "—"}
          </p>

          <p className="text-xs text-ink-500">
            {payment.property.city || "—"}, {payment.property.state || "—"}
          </p>
        </div>
      ),
    },

    {
      header: "Estate",
      render: (payment) => (
        <span className="font-medium text-navy-950">{payment.estate.name}</span>
      ),
    },

    {
      header: "Plan",
      render: (payment) => (
        <span className="font-medium">{payment.paymentPlan.name}</span>
      ),
    },

    {
      header: "Amount Paid",
      render: (payment) =>
        formatNaira(Number(payment.verification.amount || 0)),
    },

    {
      header: "Payment Status",
      render: (payment) => (
        <Badge tone={statusToTone(payment.verification.status)}>
          {payment.verification.status}
        </Badge>
      ),
    },

    {
      header: "Date",
      render: (payment) => formatDate(payment.verification.createdAt),
    },

    {
      header: "Receipt",
      render: (payment) => (
        <button
          type="button"
          onClick={() => setSelectedReceipt(payment.verification.receiptUrl)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-navy-950 transition hover:bg-ink-50">
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      ),
    },

    {
      header: "Action",
      render: (payment) => {
        const isPending = payment.verification.status === "PENDING";

        if (!isPending) {
          return (
            <Badge tone={statusToTone(payment.verification.status)}>
              {payment.verification.status}
            </Badge>
          );
        }

        const isApproving =
          approvePayment.isPending &&
          approvePayment.variables === payment.verification.id;

        const isRejecting =
          rejectPayment.isPending &&
          rejectPayment.variables?.verificationId === payment.verification.id;

        const isProcessing =
          approvePayment.isPending || rejectPayment.isPending;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleApprove(payment)}
              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isApproving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}

              {isApproving ? "Approving..." : "Approve"}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => openRejectModal(payment)}
              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isRejecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              Reject
            </button>
          </div>
        );
      },
    },

    {
      header: "Sales Status",
      render: (payment) => (
        <Badge tone={statusToTone(payment.purchase.status)}>
          {payment.purchase.status}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Sales</h1>

          <p className="mt-1 text-sm text-ink-500">
            Revenue and sales status across every customer.
          </p>
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-xl border border-ink-200 bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-navy-950" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-navy-950">Sales</h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load payment verifications."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Sales</h1>

          <p className="mt-1 text-sm text-ink-500">
            Revenue and sales status across every customer.
          </p>
        </div>

        <DataTable columns={columns} rows={payments} />
      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedReceipt(null)}>
          <div
            className="relative max-h-[95vh] max-w-5xl overflow-hidden rounded-xl "
            onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black">
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-[90vh] w-[90vw] max-w-5xl">
              <Image
                src={selectedReceipt}
                alt="Payment receipt"
                fill
                sizes="90vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {isRejectModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-navy-950">
                Reject Payment
              </h2>

              <p className="mt-1 text-sm text-ink-500">
                Give a reason for rejecting this payment receipt.
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-ink-50 p-3">
              <p className="text-xs text-ink-500">Customer</p>

              <p className="font-semibold text-navy-950">
                {selectedPayment.customer.fullName}
              </p>

              <p className="mt-1 text-xs text-ink-500">
                {formatNaira(Number(selectedPayment.verification.amount || 0))}
              </p>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="e.g. Receipt amount does not match the expected payment..."
              rows={4}
              disabled={rejectPayment.isPending}
              className="w-full rounded-xl border border-ink-200 p-3 text-sm outline-none focus:border-navy-500 disabled:cursor-not-allowed disabled:bg-ink-50"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={rejectPayment.isPending}
                onClick={closeRejectModal}
                className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-navy-950 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50">
                Cancel
              </button>

              <button
                type="button"
                disabled={!rejectionReason.trim() || rejectPayment.isPending}
                onClick={handleReject}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                {rejectPayment.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {rejectPayment.isPending ? "Rejecting..." : "Reject Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
