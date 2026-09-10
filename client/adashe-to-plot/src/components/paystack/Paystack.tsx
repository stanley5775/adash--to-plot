"use client";

import Script from "next/script";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const config = {
  reference: new Date().getTime().toString(),
  email: "user@example.com",
  amount: 20_000 * 100, // ₦20,000 = 2,000,000 kobo
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
};

const onSuccess = (reference: any) => {
  console.log("Payment successful:", reference);

  // Send reference to your backend here
};

const onClose = () => {
  console.log("Payment closed");
};

export const PaystackHookExample = () => {
  const handlePayment = () => {
    if (!window.PaystackPop) {
      console.error("Paystack has not loaded yet");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.reference,

      callback: (response: any) => {
        onSuccess(response);
      },

      onClose: () => {
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <>
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
      />

      <button onClick={handlePayment}>Pay ₦20,000</button>
    </>
  );
};
