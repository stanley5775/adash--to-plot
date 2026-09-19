import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  numeric,
  unique,
  uuid,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
// ENUMS;

export const userRoleEnum = pgEnum("user_role", [
  "CUSTOMER",
  "ADMIN",
  "SUB_ADMIN",
]);

export const estateStatusEnum = pgEnum("estate_status", ["ACTIVE", "INACTIVE"]);
export const propertyStatusEnum = pgEnum("property_status", [
  "ACTIVE",
  "NON_ACTIVE",
  "SOLD_OUT",
]);

// export const paymentPlanStatusEnum = pgEnum("payment_plan_status", [
//   "ACTIVE",
//   "INACTIVE",
// ]);

export const purchaseStatusEnum = pgEnum("purchase_status", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "DEFAULTED",
]);

export const installmentStatusEnum = pgEnum("installment_status", [
  "PENDING",
  "PAID",
  "OVERDUE",
]);

export const paymentProviderEnum = pgEnum("payment_provider", ["PAYSTACK"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "SUCCESSFUL",
  "FAILED",
]);
export const paymentTypeEnum = pgEnum("payment_type", [
  "LAND_APPLICATION_FEE",
  "PROPERTY_INSTALLMENT",
  "ATI_MEMBERSHIP",
]);
export const applicationStageEnum = pgEnum("application_stage", [
  "APPLICATION_STARTED",
  "DOCUMENTS_SUBMITTED",
  "VERIFICATION",
  "APPROVED",
  "ALLOCATION",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "ID",
  "PASSPORT_PHOTO",
  "PROOF_OF_PAYMENT",
  "CONTRACT",
  "OTHER",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "PENDING",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
]);

export const inspectionStatusEnum = pgEnum("inspection_status", [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export const atiMembershipStatusEnum = pgEnum("ati_membership_status", [
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
]);

export const atiTransactionStatusEnum = pgEnum("ati_transaction_status", [
  "PENDING",
  "SUCCESSFUL",
  "FAILED",
  "REFUNDED",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "PAYMENT_REMINDER",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "APPLICATION_UPDATE",
  "INSPECTION_UPDATE",
  "ATI_MEMBERSHIP",
  "GENERAL",
]);

// USERS
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull().unique(),

    full_name: text("first_name").notNull(),

    email: text("email").notNull().unique(),

    phone_number: text("phone").notNull(),

    ATI_membership: boolean("ATI_membership").notNull().default(false),
    isApplication: boolean("is_application").notNull().default(false),

    Password: text("password_hash").notNull(),

    role: userRoleEnum("role").notNull().default("CUSTOMER"),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),

    index("users_phone_idx").on(table.phone_number),

    index("users_role_idx").on(table.role),

    index("users_active_idx").on(table.isActive),
  ],
);
export const passwordResetOtps = pgTable(
  "password_reset_otps",
  {
    id: uuid("id").defaultRandom().notNull().unique(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    otpHash: text("otp_hash").notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    attempts: integer("attempts").notNull().default(0),

    used: boolean("used").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("password_reset_otps_user_idx").on(table.userId),

    index("password_reset_otps_expires_idx").on(table.expiresAt),
  ],
);
export const estateNames = pgTable("estate_names", {
  id: uuid("id").defaultRandom().notNull().unique(),
  description: text("description"),
  slug: varchar("slug").unique(),
  mainImageUrl: text("main_image_url"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),

  startingPrice: numeric("starting_price", {
    precision: 15,
    scale: 2,
  }),
  mainImagePublicId: text("main_image_public_id"),
  name: text("name").notNull().unique(),
  accountName: text("account_name").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//  ESTATE DETAILS
export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estateNames.id, {
        onDelete: "restrict",
      }),
    status: propertyStatusEnum("status").notNull().default("ACTIVE"),
    location: text("location").notNull(),
    slug: varchar("slug").notNull().unique(),
    city: text("city").notNull(),

    state: text("state").notNull(),

    description: text("description"),

    startingPrice: numeric("starting_price", {
      precision: 15,
      scale: 2,
    }).notNull(),

    totalPlots: integer("total_plots").notNull(),

    features: text("features").array(),

    nearbyLandmarks: text("nearby_landmarks").array(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("estates_city_idx").on(table.city),
    index("estates_state_idx").on(table.state),
    index("estates_estate_id_idx").on(table.estateId),
  ],
);

export const PropertyPaymentPlan = pgTable(
  "property_payment_plan",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "cascade",
      }),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estateNames.id, {
        onDelete: "restrict",
      }),

    name: text("name").notNull(),

    durationMonths: integer("duration_months"),

    totalAmount: numeric("total_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),

    monthlyAmount: numeric("monthly_amount", {
      precision: 12,
      scale: 2,
    }),

    interestRate: numeric("interest_rate", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("0"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("property_payment_plan_property_idx").on(table.propertyId),

    index("property_payment_plan_estate_idx").on(table.estateId),

    // Only ONE Outright plan per property
    uniqueIndex("property_payment_plan_one_outright_idx")
      .on(table.propertyId)
      .where(sql`${table.durationMonths} IS NULL`),
  ],
);

export const propertiesImage = pgTable(
  "properties_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "cascade",
      }),

    // Main image
    mainImgUrl: text("main_img_url"),

    mainImagePublicId: text("main_image_public_id"),

    // Image 1
    image1Url: text("image_1_url"),

    image1PublicId: text("image_1_public_id"),

    // Image 2
    image2Url: text("image_2_url"),

    image2PublicId: text("image_2_public_id"),

    // Image 3
    image3Url: text("image_3_url"),

    image3PublicId: text("image_3_public_id"),

    // Image 4
    image4Url: text("image_4_url"),

    image4PublicId: text("image_4_public_id"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [index("estate_images_estate_id_idx").on(table.estateId)],
);

//    PROPERTIES
export const applicationStatusEnum = pgEnum("application_status", [
  "PENDING_PAYMENT",
  "PAID",
  "CANCELLED",
]);

export const applicationSchema = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // Applicant information
    surname: text("surname").notNull(),
    firstName: text("first_name").notNull(),
    middleName: text("middle_name"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),
    sex: text("sex").notNull(),
    residentialAddress: text("residential_address").notNull(),
    dateOfBirth: text("date_of_birth").notNull(),
    nationality: text("nationality").notNull(),
    stateOfOrigin: text("state_of_origin").notNull(),

    phone1: text("phone1").notNull(),
    phone2: text("phone2"),
    email: text("email").notNull(),

    occupation: text("occupation").notNull(),
    officeAddress: text("office_address"),

    // Next of kin
    nextOfKinName: text("next_of_kin_name").notNull(),
    nextOfKinRelationship: text("next_of_kin_relationship").notNull(),
    nextOfKinPhone: text("next_of_kin_phone").notNull(),
    nextOfKinAddress: text("next_of_kin_address").notNull(),

    // Corporate information
    isCorporate: boolean("is_corporate").notNull().default(false),
    businessName: text("business_name"),
    rcNumber: text("rc_number"),
    companyAddress: text("company_address"),
    natureOfBusiness: text("nature_of_business"),
    companyPhone: text("company_phone"),
    companyEmail: text("company_email"),

    // Referral
    referralSource: text("referral_source"),
    referralOther: text("referral_other"),

    // Property
    estate: text("estate").notNull(),

    plotSize: text("plot_size").notNull(),
    paymentOption: text("payment_option").notNull(),
    acquisitionPurpose: text("acquisition_purpose").notNull(),

    // Application/payment status
    status: applicationStatusEnum("status")
      .notNull()
      .default("PENDING_PAYMENT"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    isApplication: boolean("isApplication").notNull().default(false),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index("applications_email_idx").on(table.email),
    index("applications_status_idx").on(table.status),
    index("applications_estate_idx").on(table.estate),
  ],
);

//ATI MEMBERSHIPS

export const atiMemberships = pgTable(
  "ati_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    status: atiMembershipStatusEnum("status").notNull().default("PENDING"),
    ATI_membership: boolean("ATI_membership").notNull().default(false),
    startDate: timestamp("start_date", {
      withTimezone: true,
    }),

    expiryDate: timestamp("expiry_date", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index("ati_memberships_user_idx").on(table.userId),
    index("ati_memberships_status_idx").on(table.status),
    index("ati_memberships_expiry_idx").on(table.expiryDate),
  ],
);

export const atiMembershipPayments = pgTable(
  "ati_membership_payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    membershipId: uuid("membership_id")
      .notNull()
      .references(() => atiMemberships.id, {
        onDelete: "restrict",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),
    amount: integer("amount").notNull(),

    ATI_membership: boolean("ATI_membership").notNull().default(false),
    currency: text("currency").notNull().default("NGN"),
    provider: paymentProviderEnum("provider").notNull().default("PAYSTACK"),
    status: paymentStatusEnum("status").notNull().default("PENDING"),

    reference: text("reference").notNull().unique(),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index("ati_membership_payments_membership_idx").on(table.membershipId),

    index("ati_membership_payments_user_idx").on(table.userId),

    index("ati_membership_payments_status_idx").on(table.status),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    type: notificationTypeEnum("type").notNull(),

    title: text("title").notNull(),

    message: text("message").notNull(),

    isRead: boolean("is_read").notNull().default(false),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId),

    index("notifications_read_idx").on(table.isRead),

    index("notifications_created_at_idx").on(table.createdAt),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    refreshToken: text("refresh_token").notNull().unique(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const propertyPurchases = pgTable(
  "property_purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "restrict",
      }),

    paymentPlanId: uuid("payment_plan_id")
      .notNull()
      .references(() => PropertyPaymentPlan.id, {
        onDelete: "restrict",
      }),

    propertyPrice: numeric("property_price", {
      precision: 15,
      scale: 2,
    }).notNull(),

    totalPayable: numeric("total_payable", {
      precision: 15,
      scale: 2,
    }).notNull(),

    amountPaid: numeric("amount_paid", {
      precision: 15,
      scale: 2,
    })
      .notNull()
      .default("0"),

    balance: numeric("balance", {
      precision: 15,
      scale: 2,
    }).notNull(),

    durationMonths: integer("duration_months").notNull(),

    paymentAmount: numeric("payment_amount", {
      precision: 15,
      scale: 2,
    }),

    interestPercentage: numeric("interest_percentage", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("0"),

    status: purchaseStatusEnum("status").notNull().default("PENDING"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("property_purchases_user_idx").on(table.userId),
    index("property_purchases_property_idx").on(table.propertyId),
    index("property_purchases_plan_idx").on(table.paymentPlanId),
    index("property_purchases_status_idx").on(table.status),
  ],
);

export const propertyInstallments = pgTable(
  "property_installments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => propertyPurchases.id, {
        onDelete: "cascade",
      }),

    installmentNumber: integer("installment_number").notNull(),

    amount: numeric("amount", {
      precision: 15,
      scale: 2,
    }).notNull(),

    dueDate: timestamp("due_date", {
      withTimezone: true,
    }).notNull(),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

    status: installmentStatusEnum("status").notNull().default("PENDING"),

    paymentReference: text("payment_reference").unique(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("property_installments_purchase_idx").on(table.purchaseId),
    index("property_installments_status_idx").on(table.status),
    index("property_installments_due_date_idx").on(table.dueDate),

    unique("purchase_installment_unique").on(
      table.purchaseId,
      table.installmentNumber,
    ),
  ],
);
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),
    membershipId: uuid("membership_id").references(() => atiMemberships.id, {
      onDelete: "restrict",
    }),
    purchaseId: uuid("purchase_id").references(() => propertyPurchases.id, {
      onDelete: "restrict",
    }),
    applicationId: uuid("application_id").references(
      () => applicationSchema.id,
      {
        onDelete: "restrict",
      },
    ),
    amount: integer("amount").notNull(),

    currency: text("currency").notNull().default("NGN"),

    provider: paymentProviderEnum("provider").notNull().default("PAYSTACK"),

    reference: text("reference").notNull().unique(),

    status: paymentStatusEnum("status").notNull().default("PENDING"),
    type: paymentTypeEnum("type").notNull(),
    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("payments_user_idx").on(table.userId),
    index("payments_purchase_idx").on(table.purchaseId),

    index("payments_status_idx").on(table.status),
  ],
);

export const propertyPaymentVerificationStatusEnum = pgEnum(
  "property_payment_verification_status",
  ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
);

export const propertyPaymentVerifications = pgTable(
  "property_payment_verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => propertyPurchases.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    amount: numeric("amount", {
      precision: 15,
      scale: 2,
    }).notNull(),

    receiptUrl: text("receipt_url").notNull(),

    receiptPublicId: text("receipt_public_id"),

    status: propertyPaymentVerificationStatusEnum("status")
      .notNull()
      .default("PENDING"),

    rejectionReason: text("rejection_reason"),

    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "restrict",
    }),

    reviewedAt: timestamp("reviewed_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("property_payment_verifications_purchase_idx").on(table.purchaseId),

    index("property_payment_verifications_user_idx").on(table.userId),

    index("property_payment_verifications_status_idx").on(table.status),
  ],
);
