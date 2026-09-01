/**
 * Land Application types, modelled on Adashè-to-Plot's physical Land
 * Application Form for The Thrive Estate (developer: AMIO'S GLOBAL;
 * exclusive marketing partner: Adashè-to-Plot by Achezy Homes Ltd).
 */

export type ApplicationStatus =
  | "draft"
  | "payment_pending"
  | "paid"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export type ApplicationStage =
  | "Application Started"
  | "Application Submitted"
  | "Payment Confirmed"
  | "Under Review"
  | "Approved"
  | "Allocation";

export type Sex = "Male" | "Female";

export type ReferralSource =
  | "Marketer"
  | "Social Media"
  | "Referral"
  | "Advertisement"
  | "Website"
  | "Staff"
  | "Others";

export type ApplicationPaymentOption = "Outright" | "6 Months" | "12 Months" | "18 Months" | "24 Months";

export type AcquisitionPurpose = "Investment" | "Residential" | "Commercial";

export interface NextOfKin {
  fullName: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface CorporateInfo {
  businessName: string;
  rcNumber: string;
  companyAddress: string;
  natureOfBusiness: string;
  companyPhone: string;
  companyEmail: string;
}

/** Section A + B + C + D of the physical Land Application Form. */
export interface ApplicantInfo {
  surname: string;
  firstName: string;
  middleName?: string;
  residentialAddress: string;
  dateOfBirth?: string;
  sex?: Sex;
  nationality: string;
  stateOfOrigin: string;
  phone1: string;
  phone2?: string;
  email: string;
  occupation: string;
  officeAddress?: string;
  nextOfKin: NextOfKin;
  isCorporateApplicant: boolean;
  corporateInfo?: CorporateInfo;
  referralSource: ReferralSource;
  referralOther?: string;
}

/** Section E of the physical Land Application Form. */
export interface ApplicationPropertyInfo {
  estateId: string;
  propertyId: string;
  plotSizeSqm: number;
  paymentOption: ApplicationPaymentOption;
  acquisitionPurpose: AcquisitionPurpose;
}

export interface Application {
  id: string;
  applicationNumber?: string;
  applicantUserId?: string;
  applicant: ApplicantInfo;
  property: ApplicationPropertyInfo;
  status: ApplicationStatus;
  currentStage: ApplicationStage;
  stagesCompleted: ApplicationStage[];
  applicationFee: number;
  paymentReference?: string;
  paidAt?: string;
  dateStarted: string;
  dateSubmitted?: string;
}

export interface CreateApplicationInput {
  applicant: ApplicantInfo;
  property: ApplicationPropertyInfo;
}
