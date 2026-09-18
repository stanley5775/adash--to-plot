import { z } from "zod";

export const createLandApplicationSchema = z.object({
  surname: z.string().min(2),
  firstName: z.string().min(2),
  middleName: z.string().optional(),

  sex: z.enum(["Male", "Female"]),

  residentialAddress: z.string().min(5),
  dateOfBirth: z.string().min(1),
  nationality: z.string().min(2),
  stateOfOrigin: z.string().min(2),

  phone1: z.string().regex(/^\+?[0-9]{10,15}$/),
  phone2: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/)
    .optional()
    .or(z.literal("")),

  email: z.string().email(),

  occupation: z.string().min(2),
  officeAddress: z.string().min(5),

  nextOfKinName: z.string().min(2),
  nextOfKinRelationship: z.string().min(2),
  nextOfKinPhone: z.string().regex(/^\+?[0-9]{10,15}$/),
  nextOfKinAddress: z.string().min(5),

  isCorporate: z.boolean(),

  businessName: z.string().optional(),
  rcNumber: z.string().optional(),
  companyAddress: z.string().optional(),
  natureOfBusiness: z.string().optional(),
  companyPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/)
    .optional()
    .or(z.literal("")),
  companyEmail: z.string().email().optional().or(z.literal("")),

  referralSource: z.string().min(1),
  referralOther: z.string().optional(),

  estate: z.string().min(1, "Estate is required"),

  plotSize: z.string().min(1),

  paymentOption: z.enum([
    "Outright",
    "6 Months",
    "12 Months",
    "18 Months",
    "24 Months",
  ]),

  acquisitionPurpose: z.enum(["Residential", "Investment", "Commercial"]),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().min(1),
});
