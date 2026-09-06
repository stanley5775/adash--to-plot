
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const LAND_APPLICATION_FEE = 20000;

type FormValues = {
  surname: string;
  firstName: string;
  middleName: string;
  sex: string;
  residentialAddress: string;
  dateOfBirth: string;
  nationality: string;
  stateOfOrigin: string;
  phone1: string;
  phone2: string;
  email: string;
  occupation: string;
  officeAddress: string;

  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  nextOfKinAddress: string;

  isCorporate: boolean;
  businessName: string;
  rcNumber: string;
  companyAddress: string;
  natureOfBusiness: string;
  companyPhone: string;
  companyEmail: string;

  referralSource: string;
  referralOther: string;

  estate: string;
  property: string;
  plotSize: string;
  paymentOption: string;
  acquisitionPurpose: string;
};

const estates = [
  { label: "Adashè Estate — Abuja", value: "adashe" },
  { label: "Thrive Estate — Lagos", value: "thrive" },
  { label: "AMIO Vista Homes — Enugu", value: "amio-vista" },
];

const properties = [
  { label: "Premium Residential Plot — Plot 24", value: "plot-24" },
  { label: "Residential Plot — Plot 18", value: "plot-18" },
  { label: "Commercial Plot — Plot 12", value: "plot-12" },
];

const paymentOptions = [
  { label: "Outright", value: "Outright" },
  { label: "6 Months", value: "6 Months" },
  { label: "12 Months", value: "12 Months" },
  { label: "24 Months", value: "24 Months" },
];

const purposes = [
  { label: "Residential", value: "Residential" },
  { label: "Investment", value: "Investment" },
  { label: "Commercial", value: "Commercial" },
];

const referralSources = [
  { label: "Website", value: "Website" },
  { label: "Marketer", value: "Marketer" },
  { label: "Social Media", value: "Social Media" },
  { label: "Referral", value: "Referral" },
  { label: "Advertisement", value: "Advertisement" },
  { label: "Staff", value: "Staff" },
  { label: "Others", value: "Others" },
];

type Step = 1 | 2 | 3 | 4 | 5;

export default function LandApplicationPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    trigger,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",

    defaultValues: {
      surname: "",
      firstName: "",
      middleName: "",
      sex: "",
      residentialAddress: "",
      dateOfBirth: "",
      nationality: "Nigerian",
      stateOfOrigin: "",
      phone1: "",
      phone2: "",
      email: "",
      occupation: "",
      officeAddress: "",

      nextOfKinName: "",
      nextOfKinRelationship: "",
      nextOfKinPhone: "",
      nextOfKinAddress: "",

      isCorporate: false,
      businessName: "",
      rcNumber: "",
      companyAddress: "",
      natureOfBusiness: "",
      companyPhone: "",
      companyEmail: "",

      referralSource: "Website",
      referralOther: "",

      estate: "",
      property: "",
      plotSize: "500 sqm",
      paymentOption: "Outright",
      acquisitionPurpose: "Residential",
    },
  });

  const isCorporate = watch("isCorporate");
  const referralSource = watch("referralSource");

  async function nextStep() {
    let fields: (keyof FormValues)[] = [];

    if (step === 1) {
      fields = [
        "surname",
        "firstName",
        "sex",
        "residentialAddress",
        "dateOfBirth",
        "nationality",
        "stateOfOrigin",
        "phone1",
        "email",
        "occupation",
        "officeAddress",
        "nextOfKinName",
        "nextOfKinRelationship",
        "nextOfKinPhone",
        "nextOfKinAddress",
        "referralSource",
      ];

      if (isCorporate) {
        fields.push(
          "businessName",
          "rcNumber",
          "companyAddress",
          "natureOfBusiness",
          "companyPhone",
          "companyEmail",
        );
      }

      if (referralSource === "Others") {
        fields.push("referralOther");
      }
    }

    if (step === 2) {
      fields = [
        "estate",
        "property",
        "plotSize",
        "paymentOption",
        "acquisitionPurpose",
      ];
    }

    const valid = await trigger(fields);

    if (!valid) return;

    setStep((current) =>
      current < 4 ? ((current + 1) as Step) : current,
    );
  }

  function previousStep() {
    setStep((current) =>
      current > 1 ? ((current - 1) as Step) : current,
    );
  }

  async function handlePayment() {
    const valid = await trigger();

    if (!valid) {
      setStep(1);
      return;
    }

    setSubmitted(true);
    setStep(5);
  }

  function onSubmit(data: FormValues) {
    console.log("Frontend form data:", data);
  }

  if (submitted) {
    return (
      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-navy-800/10 bg-white p-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-status-available" />

          <h2 className="text-2xl font-bold text-navy-950">
            🎉 Application Submitted Successfully
          </h2>

          <p className="max-w-md text-sm text-ink-500">
            Your land application has been submitted successfully.
            This is a frontend-only demonstration.
          </p>

          <div className="grid w-full max-w-sm grid-cols-2 gap-4 rounded-2xl bg-navy-50 p-5 text-left">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Application Number
              </p>
              <p className="font-bold text-navy-950">
                APP-001234
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Payment
              </p>
              <p className="font-bold text-navy-950">
                ₦{LAND_APPLICATION_FEE.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Status
              </p>
              <p className="font-bold text-status-available">
                Paid
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Reference
              </p>
              <p className="truncate font-bold text-navy-950">
                PAY-APP-001234
              </p>
            </div>
          </div>

          <Button onClick={() => setSubmitted(false)}>
            Back to Application
          </Button>

          <p className="flex items-center gap-1.5 text-xs text-ink-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            This is a frontend-only prototype.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container-page py-12 sm:py-16"
    >
      <div className="mx-auto max-w-3xl">
        <div className="max-w-2xl">
          <span className="gold-rule mb-4 block" />

          <h1 className="text-3xl font-bold tracking-tight text-navy-950">
            Land Application
          </h1>

          <p className="mt-2 text-ink-500">
            Complete the Land Application Form. A one-time ₦
            {LAND_APPLICATION_FEE.toLocaleString()} application fee
            applies.
          </p>
        </div>

        <StepIndicator step={step} />

        {step === 1 && (
          <div className="mt-8 space-y-8">
            <Section title="Section A — Applicant Biodata">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Surname"
                  error={errors.surname?.message}
                >
                  <Input
                    label=""
                    {...register("surname", {
                      required: "Surname is required",
                      minLength: {
                        value: 2,
                        message:
                          "Surname must be at least 2 characters",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="First name"
                  error={errors.firstName?.message}
                >
                  <Input
                    label=""
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message:
                          "First name must be at least 2 characters",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Middle name"
                  error={errors.middleName?.message}
                >
                  <Input
                    label=""
                    {...register("middleName")}
                  />
                </Field>

                <Field
                  label="Sex"
                  error={errors.sex?.message}
                >
                  <Select
                    label=""
                    {...register("sex", {
                      required: "Please select your sex",
                    })}
                    options={[
                      { label: "Select", value: "" },
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ]}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Residential address"
                    error={errors.residentialAddress?.message}
                  >
                    <Input
                      label=""
                      {...register("residentialAddress", {
                        required:
                          "Residential address is required",
                        minLength: {
                          value: 5,
                          message:
                            "Please enter a valid address",
                        },
                      })}
                    />
                  </Field>
                </div>

                <Field
                  label="Date of birth"
                  error={errors.dateOfBirth?.message}
                >
                  <Input
                    label=""
                    type="date"
                    {...register("dateOfBirth", {
                      required: "Date of birth is required",
                    })}
                  />
                </Field>

                <Field
                  label="Nationality"
                  error={errors.nationality?.message}
                >
                  <Input
                    label=""
                    {...register("nationality", {
                      required: "Nationality is required",
                      minLength: {
                        value: 2,
                        message:
                          "Nationality must be at least 2 characters",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="State of origin"
                  error={errors.stateOfOrigin?.message}
                >
                  <Input
                    label=""
                    {...register("stateOfOrigin", {
                      required: "State of origin is required",
                      minLength: {
                        value: 2,
                        message:
                          "State of origin must be at least 2 characters",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Phone number 1"
                  error={errors.phone1?.message}
                >
                  <Input
                    label=""
                    type="tel"
                    {...register("phone1", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[0-9]{10,15}$/,
                        message:
                          "Enter a valid phone number",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Phone number 2"
                  error={errors.phone2?.message}
                >
                  <Input
                    label=""
                    type="tel"
                    {...register("phone2", {
                      pattern: {
                        value: /^\+?[0-9]{10,15}$/,
                        message:
                          "Enter a valid phone number",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Email address"
                  error={errors.email?.message}
                >
                  <Input
                    label=""
                    type="email"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message:
                          "Enter a valid email address",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Occupation"
                  error={errors.occupation?.message}
                >
                  <Input
                    label=""
                    {...register("occupation", {
                      required: "Occupation is required",
                      minLength: {
                        value: 2,
                        message:
                          "Occupation must be at least 2 characters",
                      },
                    })}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Office address"
                    error={errors.officeAddress?.message}
                  >
                    <Input
                      label=""
                      {...register("officeAddress", {
                        required:
                          "Office address is required",
                        minLength: {
                          value: 5,
                          message:
                            "Please enter a valid office address",
                        },
                      })}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            <Section title="Section B — Next of Kin">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  error={errors.nextOfKinName?.message}
                >
                  <Input
                    label=""
                    {...register("nextOfKinName", {
                      required:
                        "Next of kin name is required",
                      minLength: {
                        value: 2,
                        message:
                          "Name must be at least 2 characters",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Relationship"
                  error={errors.nextOfKinRelationship?.message}
                >
                  <Input
                    label=""
                    {...register("nextOfKinRelationship", {
                      required: "Relationship is required",
                    })}
                  />
                </Field>

                <Field
                  label="Phone number"
                  error={errors.nextOfKinPhone?.message}
                >
                  <Input
                    label=""
                    type="tel"
                    {...register("nextOfKinPhone", {
                      required:
                        "Next of kin phone is required",
                      pattern: {
                        value: /^\+?[0-9]{10,15}$/,
                        message:
                          "Enter a valid phone number",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Address"
                  error={errors.nextOfKinAddress?.message}
                >
                  <Input
                    label=""
                    {...register("nextOfKinAddress", {
                      required:
                        "Next of kin address is required",
                      minLength: {
                        value: 5,
                        message:
                          "Please enter a valid address",
                      },
                    })}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Section C — Corporate Information">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  {...register("isCorporate")}
                  className="h-4 w-4 rounded border-navy-800/20"
                />

                I am applying as a company
              </label>

              {isCorporate && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Business name"
                    error={errors.businessName?.message}
                  >
                    <Input
                      label=""
                      {...register("businessName", {
                        required: isCorporate
                          ? "Business name is required"
                          : false,
                      })}
                    />
                  </Field>

                  <Field
                    label="RC number"
                    error={errors.rcNumber?.message}
                  >
                    <Input
                      label=""
                      {...register("rcNumber", {
                        required: isCorporate
                          ? "RC number is required"
                          : false,
                      })}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field
                      label="Company address"
                      error={errors.companyAddress?.message}
                    >
                      <Input
                        label=""
                        {...register("companyAddress", {
                          required: isCorporate
                            ? "Company address is required"
                            : false,
                        })}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Nature of business"
                    error={errors.natureOfBusiness?.message}
                  >
                    <Input
                      label=""
                      {...register("natureOfBusiness", {
                        required: isCorporate
                          ? "Nature of business is required"
                          : false,
                      })}
                    />
                  </Field>

                  <Field
                    label="Company phone"
                    error={errors.companyPhone?.message}
                  >
                    <Input
                      label=""
                      type="tel"
                      {...register("companyPhone", {
                        required: isCorporate
                          ? "Company phone is required"
                          : false,
                        pattern: {
                          value: /^\+?[0-9]{10,15}$/,
                          message:
                            "Enter a valid phone number",
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Company email"
                    error={errors.companyEmail?.message}
                  >
                    <Input
                      label=""
                      type="email"
                      {...register("companyEmail", {
                        required: isCorporate
                          ? "Company email is required"
                          : false,
                        pattern: {
                          value:
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message:
                            "Enter a valid email address",
                        },
                      })}
                    />
                  </Field>
                </div>
              )}
            </Section>

            <Section title="Section D — How did you hear about us?">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Source"
                  error={errors.referralSource?.message}
                >
                  <Select
                    label=""
                    {...register("referralSource", {
                      required:
                        "Please select a referral source",
                    })}
                    options={[
                      {
                        label: "Select source",
                        value: "",
                      },
                      ...referralSources,
                    ]}
                  />
                </Field>

                {referralSource === "Others" && (
                  <Field
                    label="Please specify"
                    error={errors.referralOther?.message}
                  >
                    <Input
                      label=""
                      {...register("referralOther", {
                        required:
                          "Please specify how you heard about us",
                      })}
                    />
                  </Field>
                )}
              </div>
            </Section>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={nextStep}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-8">
            <Section title="Section E — Property Information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Estate"
                  error={errors.estate?.message}
                >
                  <Select
                    label=""
                    {...register("estate", {
                      required: "Please select an estate",
                    })}
                    options={[
                      {
                        label: "Select an estate",
                        value: "",
                      },
                      ...estates,
                    ]}
                  />
                </Field>

                <Field
                  label="Property / plot"
                  error={errors.property?.message}
                >
                  <Select
                    label=""
                    {...register("property", {
                      required:
                        "Please select a property",
                    })}
                    options={[
                      {
                        label: "Select a property",
                        value: "",
                      },
                      ...properties,
                    ]}
                  />
                </Field>

                <Field
                  label="Plot size"
                  error={errors.plotSize?.message}
                >
                  <Input
                    label=""
                    {...register("plotSize", {
                      required: "Plot size is required",
                    })}
                  />
                </Field>

                <Field
                  label="Payment option"
                  error={errors.paymentOption?.message}
                >
                  <Select
                    label=""
                    {...register("paymentOption", {
                      required:
                        "Please select a payment option",
                    })}
                    options={paymentOptions}
                  />
                </Field>

                <Field
                  label="Purpose of acquisition"
                  error={errors.acquisitionPurpose?.message}
                >
                  <Select
                    label=""
                    {...register("acquisitionPurpose", {
                      required:
                        "Please select a purpose",
                    })}
                    options={purposes}
                  />
                </Field>
              </div>
            </Section>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                type="button"
                onClick={nextStep}
              >
                Review Application
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <Section title="Review Your Application">
              <dl className="space-y-3 text-sm">
                <ReviewRow
                  label="Applicant"
                  value={`${getValues("surname")} ${getValues(
                    "firstName",
                  )}`}
                />

                <ReviewRow
                  label="Email"
                  value={getValues("email")}
                />

                <ReviewRow
                  label="Phone"
                  value={getValues("phone1")}
                />

                <ReviewRow
                  label="Address"
                  value={getValues(
                    "residentialAddress",
                  )}
                />

                <ReviewRow
                  label="Occupation"
                  value={getValues("occupation")}
                />

                <ReviewRow
                  label="Next of kin"
                  value={`${getValues(
                    "nextOfKinName",
                  )} (${getValues(
                    "nextOfKinRelationship",
                  )})`}
                />

                <ReviewRow
                  label="Estate"
                  value={
                    estates.find(
                      (e) =>
                        e.value ===
                        getValues("estate"),
                    )?.label ?? ""
                  }
                />

                <ReviewRow
                  label="Property"
                  value={
                    properties.find(
                      (p) =>
                        p.value ===
                        getValues("property"),
                    )?.label ?? ""
                  }
                />

                <ReviewRow
                  label="Plot size"
                  value={getValues("plotSize")}
                />

                <ReviewRow
                  label="Payment option"
                  value={getValues(
                    "paymentOption",
                  )}
                />

                <ReviewRow
                  label="Purpose"
                  value={getValues(
                    "acquisitionPurpose",
                  )}
                />
              </dl>
            </Section>

            <div className="rounded-2xl border border-gold-400 bg-gold-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
                One-Time Application Fee
              </p>

              <p className="mt-1 text-2xl font-bold text-navy-950">
                ₦{LAND_APPLICATION_FEE.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-ink-500">
                This fee is separate from your property
                payment plan.
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Edit Application
              </Button>

              <Button
                type="button"
                onClick={() => setStep(4)}
              >
                Continue to Payment
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8">
            <Section title="Land Application Payment">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-navy-800/10 pb-4">
                  <span className="text-sm text-ink-500">
                    Application Fee
                  </span>

                  <span className="text-2xl font-bold text-navy-950">
                    ₦{LAND_APPLICATION_FEE.toLocaleString()}
                  </span>
                </div>

                <ReviewRow
                  label="Applicant"
                  value={`${getValues(
                    "surname",
                  )} ${getValues("firstName")}`}
                />

                <ReviewRow
                  label="Email"
                  value={getValues("email")}
                />

                <ReviewRow
                  label="Property"
                  value={
                    properties.find(
                      (p) =>
                        p.value ===
                        getValues("property"),
                    )?.label ?? ""
                  }
                />

                <div className="rounded-xl border border-gold-400/40 bg-gold-50 p-4">
                  <p className="text-sm text-ink-600">
                    You are about to pay{" "}
                    <strong className="text-navy-950">
                      ₦
                      {LAND_APPLICATION_FEE.toLocaleString()}
                    </strong>{" "}
                    as your one-time land application
                    fee.
                  </p>
                </div>

                <Button
                  type="button"
                  size="lg"
                  onClick={handlePayment}
                >
                  Pay ₦
                  {LAND_APPLICATION_FEE.toLocaleString()}
                </Button>

                <p className="text-center text-xs text-ink-400">
                  This is a frontend-only payment
                  interface. No real payment will be
                  processed.
                </p>
              </div>
            </Section>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(3)}
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-navy-950">
          {label}
        </label>
      )}

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-status-sold">
          {error}
        </p>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    "Applicant Info",
    "Property Info",
    "Review",
    "Payment",
  ];

  return (
    <div className="mt-8 flex items-center gap-2">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = number === step;
        const done = number < step;

        return (
          <div
            key={label}
            className="flex flex-1 items-center gap-2"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-gold-500 text-navy-950"
                  : active
                    ? "border-2 border-gold-500 text-gold-600"
                    : "border border-navy-800/20 text-ink-300"
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                number
              )}
            </div>

            <span
              className={`hidden text-xs font-medium sm:block ${
                active || done
                  ? "text-navy-950"
                  : "text-ink-300"
              }`}
            >
              {label}
            </span>

            {index < steps.length - 1 && (
              <span className="h-px flex-1 bg-navy-800/10" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
      <h2 className="text-base font-bold text-navy-950">
        {title}
      </h2>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-800/5 pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-500">{label}</dt>

      <dd className="text-right font-medium text-navy-950">
        {value || "—"}
      </dd>
    </div>
  );
}

