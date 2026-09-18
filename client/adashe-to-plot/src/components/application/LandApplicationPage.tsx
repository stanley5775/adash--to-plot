"use client";

import { useState } from "react";

import ApplicationForm from "@/components/application/ApplicationForm";
import ApplicationSuccess from "@/components/application/ApplicationSuccess";

export default function LandApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  if (submitted) {
    return (
      <ApplicationSuccess
        applicationId={applicationId}
        paymentReference={paymentReference}
        onBack={() => setSubmitted(false)}
      />
    );
  }

  return (
    <ApplicationForm
      onSuccess={({ applicationId, paymentReference }) => {
        setApplicationId(applicationId);
        setPaymentReference(paymentReference);
        setSubmitted(true);
      }}
    />
  );
}
