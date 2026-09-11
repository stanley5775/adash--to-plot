"use client";

import { useState } from "react";

import AlreadyRegistered from "@/components/application/AlreadyRegistered";
import ApplicationForm from "@/components/application/ApplicationForm";
import ApplicationSuccess from "@/components/application/ApplicationSuccess";
import { useCheckApplication } from "../../../hook/users";

export default function ApplicationCheck() {
  const { data, isLoading, isError, error } = useCheckApplication();

  console.log("data applicatin", data);
  const [successData, setSuccessData] = useState<{
    applicationId: string;
    paymentReference: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-ink-500">Checking application...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-navy-950">
            Unable to check application
          </h1>

          <p className="mt-2 text-sm text-ink-500">
            {error?.message || "Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Application was successfully submitted
  if (successData) {
    return (
      <ApplicationSuccess
        applicationId={successData.applicationId}
        paymentReference={successData.paymentReference}
        onBack={() => setSuccessData(null)}
      />
    );
  }

  // User already has an application
  if (data?.data?.isApplication) {
    return <AlreadyRegistered />;
  }

  // User has no application yet
  return (
    <ApplicationForm
      onSuccess={(result) => {
        setSuccessData({
          applicationId: result.applicationId,
          paymentReference: result.paymentReference,
        });
      }}
    />
  );
}
