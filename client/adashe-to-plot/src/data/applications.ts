import type { Application } from "@/types/application";
import { LAND_APPLICATION_FEE } from "./application-fee";

// Seed Land Applications for existing demo customers (see customers.ts).
// Real applications created through the /application flow are stored
// separately in localStorage (see src/services/application.service.ts) and
// merged with these at read time.
export const applications: Application[] = [
  {
    id: "app-001",
    applicationNumber: "APP-2026-0001",
    applicant: {
      surname: "Okafor",
      firstName: "Emeka",
      residentialAddress: "14 Ademola Adetokunbo Crescent, Wuse II, Abuja",
      nationality: "Nigerian",
      stateOfOrigin: "Anambra",
      phone1: "+234 803 214 7765",
      email: "emeka.okafor@example.com",
      occupation: "Civil Servant",
      nextOfKin: { fullName: "Ngozi Okafor", relationship: "Spouse", phone: "+234 803 000 1111", address: "14 Ademola Adetokunbo Crescent, Wuse II, Abuja" },
      isCorporateApplicant: false,
      referralSource: "Marketer",
    },
    property: {
      estateId: "thrive-estate",
      propertyId: "thrive-3bed-penthouse",
      plotSizeSqm: 250,
      paymentOption: "12 Months",
      acquisitionPurpose: "Residential",
    },
    status: "submitted",
    currentStage: "Payment Confirmed",
    stagesCompleted: ["Application Started", "Application Submitted", "Payment Confirmed"],
    applicationFee: LAND_APPLICATION_FEE,
    paymentReference: "APP-PAY-20260105-0001",
    paidAt: "2026-01-05",
    dateStarted: "2026-01-05",
    dateSubmitted: "2026-01-05",
  },
  {
    id: "app-002",
    applicationNumber: "APP-2025-0004",
    applicant: {
      surname: "Nwosu",
      firstName: "Chiamaka",
      residentialAddress: "9 Ibrahim Babangida Way, Kuje, Abuja",
      nationality: "Nigerian",
      stateOfOrigin: "Imo",
      phone1: "+234 810 552 9013",
      email: "chiamaka.nwosu@example.com",
      occupation: "Entrepreneur",
      nextOfKin: { fullName: "Obinna Nwosu", relationship: "Brother", phone: "+234 810 000 2222", address: "9 Ibrahim Babangida Way, Kuje, Abuja" },
      isCorporateApplicant: false,
      referralSource: "Social Media",
    },
    property: {
      estateId: "amio-vista-homes",
      propertyId: "amio-2bed-bungalow",
      plotSizeSqm: 300,
      paymentOption: "Outright",
      acquisitionPurpose: "Investment",
    },
    status: "approved",
    currentStage: "Allocation",
    stagesCompleted: ["Application Started", "Application Submitted", "Payment Confirmed", "Under Review", "Approved"],
    applicationFee: LAND_APPLICATION_FEE,
    paymentReference: "APP-PAY-20251120-0001",
    paidAt: "2025-11-20",
    dateStarted: "2025-11-20",
    dateSubmitted: "2025-11-20",
  },
  {
    id: "app-003",
    applicationNumber: "APP-2026-0002",
    applicant: {
      surname: "Sule",
      firstName: "Ibrahim",
      residentialAddress: "22 Yakubu Gowon Crescent, Asokoro, Abuja",
      nationality: "Nigerian",
      stateOfOrigin: "Kaduna",
      phone1: "+234 706 481 2230",
      email: "ibrahim.sule@example.com",
      occupation: "Engineer",
      nextOfKin: { fullName: "Aisha Sule", relationship: "Spouse", phone: "+234 706 000 3333", address: "22 Yakubu Gowon Crescent, Asokoro, Abuja" },
      isCorporateApplicant: false,
      referralSource: "Referral",
    },
    property: {
      estateId: "thrive-estate",
      propertyId: "thrive-fully-detached",
      plotSizeSqm: 500,
      paymentOption: "24 Months",
      acquisitionPurpose: "Residential",
    },
    status: "under_review",
    currentStage: "Under Review",
    stagesCompleted: ["Application Started", "Application Submitted", "Payment Confirmed"],
    applicationFee: LAND_APPLICATION_FEE,
    paymentReference: "APP-PAY-20260402-0001",
    paidAt: "2026-04-02",
    dateStarted: "2026-04-02",
    dateSubmitted: "2026-04-02",
  },
  {
    id: "app-004",
    applicationNumber: "APP-2026-0003",
    applicant: {
      surname: "Adeyemi",
      firstName: "Grace",
      residentialAddress: "5 Aminu Kano Crescent, Wuse II, Abuja",
      nationality: "Nigerian",
      stateOfOrigin: "Ogun",
      phone1: "+234 802 990 4471",
      email: "grace.adeyemi@example.com",
      occupation: "Teacher",
      nextOfKin: { fullName: "Femi Adeyemi", relationship: "Spouse", phone: "+234 802 000 4444", address: "5 Aminu Kano Crescent, Wuse II, Abuja" },
      isCorporateApplicant: false,
      referralSource: "Website",
    },
    property: {
      estateId: "thrive-estate",
      propertyId: "thrive-4bed-semi-detached",
      plotSizeSqm: 300,
      paymentOption: "6 Months",
      acquisitionPurpose: "Residential",
    },
    status: "paid",
    currentStage: "Payment Confirmed",
    stagesCompleted: ["Application Started", "Application Submitted", "Payment Confirmed"],
    applicationFee: LAND_APPLICATION_FEE,
    paymentReference: "APP-PAY-20260510-0001",
    paidAt: "2026-05-10",
    dateStarted: "2026-05-10",
    dateSubmitted: "2026-05-10",
  },
];

export async function getApplications(): Promise<Application[]> {
  return applications;
}

export async function getApplicationByApplicantEmail(email: string): Promise<Application | undefined> {
  return applications.find((a) => a.applicant.email.toLowerCase() === email.toLowerCase());
}
