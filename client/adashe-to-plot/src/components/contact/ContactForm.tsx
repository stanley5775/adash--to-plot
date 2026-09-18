"use client";

import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useSubmitContactForm } from "../../../hook/contactus";
import { useState } from "react";

type ContactFormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const { mutate: submitContact, isPending } = useSubmitContactForm();

  const onSubmit = (data: ContactFormData) => {
    submitContact(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        setSubmitted(true);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send your message");
      },
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-navy-800/10 bg-white p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-status-available" />

        <h4 className="text-lg font-bold text-navy-950">Message received</h4>

        <p className="max-w-sm text-sm text-ink-500">
          Thank you for reaching out — our team will respond within one business
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            label="Full name"
            id="c-name"
            placeholder="e.g. Amaka Johnson"
            {...register("fullName", {
              required: "Full name is required",
            })}
          />

          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Phone number"
            id="c-phone"
            type="tel"
            placeholder="e.g. 0803 123 4567"
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
          />

          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          label="Email address"
          id="c-email"
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="c-message" className="text-sm font-medium text-ink-700">
          Message
        </label>

        <textarea
          id="c-message"
          rows={5}
          placeholder="Tell us what you're looking for..."
          className="mt-1.5 w-full rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters",
            },
          })}
        />

        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
