"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  ShieldCheck,
  Download,
  LayoutDashboard,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { getCurrentUser } from "@/services/auth.service";
import { getEstates } from "@/services/estate.service";
import { getPropertiesByEstateId } from "@/services/property.service";
import {
  createApplication,
  submitApplication,
} from "@/services/application.service";
import { processApplicationPayment } from "@/services/payment.service";
import { generateApplicationPdf } from "@/lib/pdf";
import { formatNaira } from "@/lib/payment";
import { LAND_APPLICATION_FEE } from "@/data/application-fee";
import type { AuthUser } from "@/types/auth";
import type { Estate } from "@/types/estate";
import type { Property } from "@/types/property";
import type {
  ApplicantInfo,
  ApplicationPaymentOption,
  AcquisitionPurpose,
  ReferralSource,
  Application,
} from "@/types/application";

const REFERRAL_SOURCES: ReferralSource[] = [
  "Marketer",
  "Social Media",
  "Referral",
  "Advertisement",
  "Website",
  "Staff",
  "Others",
];
const ACQUISITION_PURPOSES: AcquisitionPurpose[] = [
  "Investment",
  "Residential",
  "Commercial",
];

function monthsToPaymentOption(months: number): ApplicationPaymentOption {
  if (months === 0) return "Outright";
  return `${months} Months` as ApplicationPaymentOption;
}

type Step = 1 | 2 | 3 | 4 | 5;

function emptyApplicant(user: AuthUser | null): ApplicantInfo {
  const parts = user?.fullName.trim().split(" ") ?? [];
  return {
    surname: parts.length > 1 ? parts[parts.length - 1] : "",
    firstName:
      parts.length > 1 ? parts.slice(0, -1).join(" ") : (parts[0] ?? ""),
    middleName: "",
    residentialAddress: "",
    dateOfBirth: "",
    sex: undefined,
    nationality: "Nigerian",
    stateOfOrigin: "",
    phone1: user?.phone ?? "",
    phone2: "",
    email: user?.email ?? "",
    occupation: "",
    officeAddress: "",
    nextOfKin: { fullName: "", relationship: "", phone: "", address: "" },
    isCorporateApplicant: false,
    corporateInfo: undefined,
    referralSource: "Website",
    referralOther: "",
  };
}

export default function LandApplicationPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [applicant, setApplicant] = useState<ApplicantInfo>(
    emptyApplicant(null),
  );
  const [estateId, setEstateId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [paymentOption, setPaymentOption] =
    useState<ApplicationPaymentOption>("Outright");
  const [acquisitionPurpose, setAcquisitionPurpose] =
    useState<AcquisitionPurpose>("Residential");

  const [estates, setEstates] = useState<Estate[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [stepError, setStepError] = useState<string | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "failed"
  >("idle");
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const current = await getCurrentUser();

      if (!active) return;



      setUser(current);
      setApplicant(emptyApplicant(current));
      setAuthChecked(true);

      const list = await getEstates();

      if (active) {
        setEstates(list);
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!estateId) {
      setProperties([]);
      setPropertyId("");
      return;
    }
    getPropertiesByEstateId(estateId).then((list) => {
      setProperties(list);
      setPropertyId(list[0]?.id ?? "");
    });
  }, [estateId]);

  const selectedEstate = estates.find((e) => e.id === estateId);
  const selectedProperty = properties.find((p) => p.id === propertyId);

  const paymentOptions = useMemo(() => {
    if (!selectedProperty) return [];
    return selectedProperty.paymentPlanMonths.map(monthsToPaymentOption);
  }, [selectedProperty]);

  useEffect(() => {
    if (paymentOptions.length > 0 && !paymentOptions.includes(paymentOption)) {
      setPaymentOption(paymentOptions[0]);
    }
  }, [paymentOptions, paymentOption]);

  function updateApplicant<K extends keyof ApplicantInfo>(
    key: K,
    value: ApplicantInfo[K],
  ) {
    setApplicant((prev) => ({ ...prev, [key]: value }));
  }

  function updateNextOfKin<K extends keyof ApplicantInfo["nextOfKin"]>(
    key: K,
    value: string,
  ) {
    setApplicant((prev) => ({
      ...prev,
      nextOfKin: { ...prev.nextOfKin, [key]: value },
    }));
  }

  function validateStep1(): string | null {
    if (!applicant.surname.trim() || !applicant.firstName.trim())
      return "Surname and first name are required.";
    if (!applicant.residentialAddress.trim())
      return "Residential address is required.";
    if (!applicant.nationality.trim() || !applicant.stateOfOrigin.trim())
      return "Nationality and state of origin are required.";
    if (!applicant.phone1.trim()) return "A phone number is required.";
    if (!applicant.email.trim()) return "Email address is required.";
    if (!applicant.occupation.trim()) return "Occupation is required.";
    if (
      !applicant.nextOfKin.fullName.trim() ||
      !applicant.nextOfKin.phone.trim()
    ) {
      return "Next of kin full name and phone number are required.";
    }
    if (
      applicant.isCorporateApplicant &&
      !applicant.corporateInfo?.businessName?.trim()
    ) {
      return "Business name is required for a corporate application.";
    }
    return null;
  }

  function validateStep2(): string | null {
    if (!estateId) return "Select an estate.";
    if (!propertyId) return "Select a property.";
    if (!paymentOption) return "Select a payment option.";
    return null;
  }

  function goNext() {
    const error =
      step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }

  function goBack() {
    setStepError(null);
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  async function handlePay() {
    if (!selectedEstate || !selectedProperty) return;
    setPaymentStatus("processing");

    let currentApplication = application;
    if (!currentApplication) {
      currentApplication = await createApplication({
        applicant,
        property: {
          estateId: selectedEstate.id,
          propertyId: selectedProperty.id,
          plotSizeSqm: selectedProperty.sizeSqm,
          paymentOption,
          acquisitionPurpose,
        },
      });
      setApplication(currentApplication);
    }

    const result = await processApplicationPayment({
      amount: LAND_APPLICATION_FEE,
      email: applicant.email,
      applicationId: currentApplication.id,
    });

    if (!result.success || !result.reference) {
      setPaymentStatus("failed");
      return;
    }

    const submitted = await submitApplication(
      currentApplication.id,
      result.reference,
    );
    setApplication(submitted ?? currentApplication);
    setPaymentReference(result.reference);
    setPaymentStatus("idle");
    setStep(5);
  }

  async function handleDownload() {
    if (!application || !selectedEstate || !selectedProperty) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      await generateApplicationPdf(
        application,
        selectedEstate.name,
        selectedProperty.title,
      );
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  if (!authChecked) {
    return <LoadingState label="Checking your session" />;
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {step < 5 && (
          <>
            <div className="max-w-2xl">
              <span className="gold-rule mb-4 block" />
              <h1 className="text-3xl font-bold tracking-tight text-navy-950">
                Land Application
              </h1>
              <p className="mt-2 text-ink-500">
                Complete The Thrive Estate / AMIO Vista Homes Land Application
                Form. A one-time ₦{LAND_APPLICATION_FEE.toLocaleString("en-NG")}{" "}
                application fee applies, separate from your property payment
                plan.
              </p>
            </div>
            <StepIndicator step={step} />
          </>
        )}

        {stepError && (
          <p className="mt-6 flex items-center gap-2 rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-4 py-3 text-sm text-status-sold">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {stepError}
          </p>
        )}

        {step === 1 && (
          <div className="mt-8 space-y-8">
            <Section title="Section A — Applicant Biodata">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Surname"
                  value={applicant.surname}
                  onChange={(e) => updateApplicant("surname", e.target.value)}
                  required
                />
                <Input
                  label="First name"
                  value={applicant.firstName}
                  onChange={(e) => updateApplicant("firstName", e.target.value)}
                  required
                />
                <Input
                  label="Middle name"
                  value={applicant.middleName ?? ""}
                  onChange={(e) =>
                    updateApplicant("middleName", e.target.value)
                  }
                />
                <Select
                  label="Sex"
                  value={applicant.sex ?? ""}
                  onChange={(e) =>
                    updateApplicant(
                      "sex",
                      e.target.value as ApplicantInfo["sex"],
                    )
                  }
                  options={[
                    { label: "Select", value: "" },
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Residential address"
                    value={applicant.residentialAddress}
                    onChange={(e) =>
                      updateApplicant("residentialAddress", e.target.value)
                    }
                    required
                  />
                </div>
                <Input
                  label="Date of birth"
                  type="date"
                  value={applicant.dateOfBirth ?? ""}
                  onChange={(e) =>
                    updateApplicant("dateOfBirth", e.target.value)
                  }
                />
                <Input
                  label="Nationality"
                  value={applicant.nationality}
                  onChange={(e) =>
                    updateApplicant("nationality", e.target.value)
                  }
                  required
                />
                <Input
                  label="State of origin"
                  value={applicant.stateOfOrigin}
                  onChange={(e) =>
                    updateApplicant("stateOfOrigin", e.target.value)
                  }
                  required
                />
                <Input
                  label="Phone number 1"
                  type="tel"
                  value={applicant.phone1}
                  onChange={(e) => updateApplicant("phone1", e.target.value)}
                  required
                />
                <Input
                  label="Phone number 2"
                  type="tel"
                  value={applicant.phone2 ?? ""}
                  onChange={(e) => updateApplicant("phone2", e.target.value)}
                />
                <Input
                  label="Email address"
                  type="email"
                  value={applicant.email}
                  onChange={(e) => updateApplicant("email", e.target.value)}
                  required
                />
                <Input
                  label="Occupation"
                  value={applicant.occupation}
                  onChange={(e) =>
                    updateApplicant("occupation", e.target.value)
                  }
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Office address"
                    value={applicant.officeAddress ?? ""}
                    onChange={(e) =>
                      updateApplicant("officeAddress", e.target.value)
                    }
                  />
                </div>
              </div>
            </Section>

            <Section title="Section B — Next of Kin">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={applicant.nextOfKin.fullName}
                  onChange={(e) => updateNextOfKin("fullName", e.target.value)}
                  required
                />
                <Input
                  label="Relationship"
                  value={applicant.nextOfKin.relationship}
                  onChange={(e) =>
                    updateNextOfKin("relationship", e.target.value)
                  }
                />
                <Input
                  label="Phone number"
                  type="tel"
                  value={applicant.nextOfKin.phone}
                  onChange={(e) => updateNextOfKin("phone", e.target.value)}
                  required
                />
                <Input
                  label="Address"
                  value={applicant.nextOfKin.address}
                  onChange={(e) => updateNextOfKin("address", e.target.value)}
                />
              </div>
            </Section>

            <Section title="Section C — Corporate Information (optional)">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={applicant.isCorporateApplicant}
                  onChange={(e) =>
                    setApplicant((prev) => ({
                      ...prev,
                      isCorporateApplicant: e.target.checked,
                      corporateInfo: e.target.checked
                        ? (prev.corporateInfo ?? {
                            businessName: "",
                            rcNumber: "",
                            companyAddress: "",
                            natureOfBusiness: "",
                            companyPhone: "",
                            companyEmail: "",
                          })
                        : undefined,
                    }))
                  }
                  className="h-4 w-4 rounded border-navy-800/20 text-navy-800 focus:ring-navy-600"
                />
                I am applying as a company
              </label>
              {applicant.isCorporateApplicant && applicant.corporateInfo && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Business name"
                    value={applicant.corporateInfo.businessName}
                    onChange={(e) =>
                      setApplicant((p) => ({
                        ...p,
                        corporateInfo: {
                          ...p.corporateInfo!,
                          businessName: e.target.value,
                        },
                      }))
                    }
                    required
                  />
                  <Input
                    label="RC number"
                    value={applicant.corporateInfo.rcNumber}
                    onChange={(e) =>
                      setApplicant((p) => ({
                        ...p,
                        corporateInfo: {
                          ...p.corporateInfo!,
                          rcNumber: e.target.value,
                        },
                      }))
                    }
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Company address"
                      value={applicant.corporateInfo.companyAddress}
                      onChange={(e) =>
                        setApplicant((p) => ({
                          ...p,
                          corporateInfo: {
                            ...p.corporateInfo!,
                            companyAddress: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <Input
                    label="Nature of business"
                    value={applicant.corporateInfo.natureOfBusiness}
                    onChange={(e) =>
                      setApplicant((p) => ({
                        ...p,
                        corporateInfo: {
                          ...p.corporateInfo!,
                          natureOfBusiness: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Company phone"
                    type="tel"
                    value={applicant.corporateInfo.companyPhone}
                    onChange={(e) =>
                      setApplicant((p) => ({
                        ...p,
                        corporateInfo: {
                          ...p.corporateInfo!,
                          companyPhone: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Company email"
                    type="email"
                    value={applicant.corporateInfo.companyEmail}
                    onChange={(e) =>
                      setApplicant((p) => ({
                        ...p,
                        corporateInfo: {
                          ...p.corporateInfo!,
                          companyEmail: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              )}
            </Section>

            <Section title="Section D — How did you hear about us?">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Source"
                  value={applicant.referralSource}
                  onChange={(e) =>
                    updateApplicant(
                      "referralSource",
                      e.target.value as ReferralSource,
                    )
                  }
                  options={REFERRAL_SOURCES.map((s) => ({
                    label: s,
                    value: s,
                  }))}
                />
                {applicant.referralSource === "Others" && (
                  <Input
                    label="Please specify"
                    value={applicant.referralOther ?? ""}
                    onChange={(e) =>
                      updateApplicant("referralOther", e.target.value)
                    }
                  />
                )}
              </div>
            </Section>

            <div className="flex justify-end">
              <Button onClick={goNext}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-8">
            <Section title="Section E — Property Information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Estate"
                  value={estateId}
                  onChange={(e) => setEstateId(e.target.value)}
                  options={[
                    { label: "Select an estate", value: "" },
                    ...estates.map((e) => ({
                      label: `${e.name} — ${e.location}`,
                      value: e.id,
                    })),
                  ]}
                />
                <Select
                  label="Property / plot"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  options={
                    properties.length > 0
                      ? properties.map((p) => ({
                          label: `${p.title} (Plot ${p.plotNumber})`,
                          value: p.id,
                        }))
                      : [{ label: "Select an estate first", value: "" }]
                  }
                />
                <Input
                  label="Plot size"
                  value={
                    selectedProperty ? `${selectedProperty.sizeSqm} sqm` : "—"
                  }
                  disabled
                />
                <Select
                  label="Payment option"
                  value={paymentOption}
                  onChange={(e) =>
                    setPaymentOption(e.target.value as ApplicationPaymentOption)
                  }
                  options={paymentOptions.map((o) => ({ label: o, value: o }))}
                />
                <Select
                  label="Purpose of acquisition"
                  value={acquisitionPurpose}
                  onChange={(e) =>
                    setAcquisitionPurpose(e.target.value as AcquisitionPurpose)
                  }
                  options={ACQUISITION_PURPOSES.map((p) => ({
                    label: p,
                    value: p,
                  }))}
                />
              </div>
            </Section>

            <div className="flex justify-between">
              <Button variant="outline" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={goNext}>
                Review Application <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && selectedEstate && selectedProperty && (
          <div className="mt-8 space-y-6">
            <Section title="Review Your Application">
              <dl className="space-y-3 text-sm">
                <ReviewRow
                  label="Applicant"
                  value={`${applicant.surname} ${applicant.firstName}${applicant.middleName ? ` ${applicant.middleName}` : ""}`}
                />
                <ReviewRow label="Email" value={applicant.email} />
                <ReviewRow label="Phone" value={applicant.phone1} />
                <ReviewRow
                  label="Address"
                  value={applicant.residentialAddress}
                />
                <ReviewRow label="Occupation" value={applicant.occupation} />
                <ReviewRow
                  label="Next of kin"
                  value={`${applicant.nextOfKin.fullName} (${applicant.nextOfKin.relationship || "—"})`}
                />
                <ReviewRow label="Estate" value={selectedEstate.name} />
                <ReviewRow
                  label="Property"
                  value={`${selectedProperty.title} — Plot ${selectedProperty.plotNumber}`}
                />
                <ReviewRow
                  label="Plot size"
                  value={`${selectedProperty.sizeSqm} sqm`}
                />
                <ReviewRow label="Payment option" value={paymentOption} />
                <ReviewRow label="Purpose" value={acquisitionPurpose} />
              </dl>
            </Section>

            <div className="rounded-2xl border border-gold-400 bg-gold-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
                One-Time Application Fee
              </p>
              <p className="mt-1 text-2xl font-bold text-navy-950">
                {formatNaira(LAND_APPLICATION_FEE)}
              </p>
              <p className="mt-1 text-xs text-ink-500">
                This fee is separate from your property payment plan and is not
                added to your outright or installment payments.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4" /> Edit Application
              </Button>
              <Button onClick={() => setStep(4)}>
                Continue to Payment <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && selectedEstate && selectedProperty && (
          <div className="mt-8">
            <Section title="Land Application Payment">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-navy-800/10 pb-4">
                  <span className="text-sm text-ink-500">Application Fee</span>
                  <span className="text-2xl font-bold text-navy-950">
                    {formatNaira(LAND_APPLICATION_FEE)}
                  </span>
                </div>
                <ReviewRow
                  label="Applicant"
                  value={`${applicant.surname} ${applicant.firstName}`}
                />
                <ReviewRow label="Email" value={applicant.email} />
                <ReviewRow
                  label="Property"
                  value={`${selectedProperty.title} — ${selectedEstate.name}`}
                />

                {paymentStatus === "failed" && (
                  <p className="flex items-center gap-2 rounded-lg border border-status-sold/20 bg-[#f8e9e9] px-4 py-3 text-sm text-status-sold">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> Your payment
                    could not be completed. Please try again.
                  </p>
                )}

                <Button
                  onClick={handlePay}
                  disabled={paymentStatus === "processing"}
                  size="lg"
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />{" "}
                      Processing payment…
                    </>
                  ) : (
                    `Pay ${formatNaira(LAND_APPLICATION_FEE)}`
                  )}
                </Button>
                <p className="text-center text-xs text-ink-400">
                  This is a simulated payment for demonstration — no real money
                  moves. A live payment gateway (e.g. Paystack) will replace
                  this step once the backend is connected.
                </p>
              </div>
            </Section>

            {paymentStatus !== "processing" && (
              <div className="mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ChevronLeft className="h-4 w-4" /> Back to Review
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 5 && application && selectedEstate && selectedProperty && (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-navy-800/10 bg-white p-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-status-available" />
            <h2 className="text-2xl font-bold text-navy-950">
              🎉 Application Submitted Successfully
            </h2>
            <p className="max-w-md text-sm text-ink-500">
              Your Land Application for {selectedProperty.title} at{" "}
              {selectedEstate.name} has been submitted.
            </p>

            <div className="mt-2 grid w-full max-w-sm grid-cols-2 gap-4 rounded-2xl bg-navy-50 p-5 text-left">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  Application Number
                </p>
                <p className="font-bold text-navy-950">
                  {application.applicationNumber}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  Payment
                </p>
                <p className="font-bold text-navy-950">
                  {formatNaira(LAND_APPLICATION_FEE)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  Status
                </p>
                <p className="font-bold text-status-available">Paid</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  Reference
                </p>
                <p className="truncate font-bold text-navy-950">
                  {paymentReference}
                </p>
              </div>
            </div>

            {downloadError && (
              <p className="text-xs text-status-sold">
                Couldn&apos;t generate the PDF — please try again.
              </p>
            )}

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button onClick={() => router.push("/dashboard/applications")}>
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloading ? "Preparing…" : "Download Application"}
              </Button>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Allocation is subject to
              verification, payment and approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = ["Applicant Info", "Property Info", "Review", "Payment"];
  return (
    <div className="mt-8 flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-gold-500 text-navy-950"
                  : active
                    ? "border-2 border-gold-500 text-gold-600"
                    : "border border-navy-800/20 text-ink-300"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <span
              className={`hidden text-xs font-medium sm:block ${active || done ? "text-navy-950" : "text-ink-300"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
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
      <h2 className="text-base font-bold text-navy-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-800/5 pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-navy-950">{value}</dd>
    </div>
  );
}
