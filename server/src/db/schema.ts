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
} from "drizzle-orm/pg-core";

// ENUMS;

export const userRoleEnum = pgEnum("user_role", [
  "CUSTOMER",
  "ADMIN",
  "SUB_ADMIN",
]);

export const estateStatusEnum = pgEnum("estate_status", ["ACTIVE", "INACTIVE"]);

export const propertyStatusEnum = pgEnum("property_status", [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
]);

export const paymentPlanStatusEnum = pgEnum("payment_plan_status", [
  "ACTIVE",
  "INACTIVE",
]);

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

export const paymentTypeEnum = pgEnum("payment_type", [
  "PROPERTY_PAYMENT",
  "LAND_APPLICATION_FEE",
]);

export const paymentProviderEnum = pgEnum("payment_provider", ["FLUTTERWAVE"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "SUCCESSFUL",
  "FAILED",
  "REFUNDED",
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

//    USERS

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull().unique(),

    full_name: text("first_name").notNull(),

    email: text("email").notNull().unique(),

    phone_number: text("phone").notNull(),

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

  name: text("name").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
//    ESTATE DETAILS
export const estates = pgTable(
  "estates",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estateNames.id, {
        onDelete: "restrict",
      }),

    location: text("location").notNull(),

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

    status: estateStatusEnum("status").notNull().default("ACTIVE"),

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
    index("estates_status_idx").on(table.status),
    index("estates_city_idx").on(table.city),
    index("estates_state_idx").on(table.state),
    index("estates_estate_id_idx").on(table.estateId),
  ],
);
export const estateImages = pgTable(
  "estate_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estates.id, {
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
export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estateNames.id, {
        onDelete: "restrict",
      }),

    name: text("name").notNull(),

    description: text("description"),

    sizeSqm: integer("size_sqm").notNull(),

    price: integer("price").notNull(),

    status: propertyStatusEnum("status").notNull().default("AVAILABLE"),

    image: text("image"),

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
    index("properties_estate_id_idx").on(table.estateId),
    index("properties_status_idx").on(table.status),
    index("properties_price_idx").on(table.price),
  ],
);

//    PAYMENT PLANS

export const paymentPlans = pgTable(
  "payment_plans",
  {
    id: uuid("id").defaultRandom().notNull().unique(),

    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "cascade",
      }),

    durationMonths: integer("duration_months").notNull(),

    /**
     * Stored as whole percentage.
     *
     * 0  = 0%
     * 9  = 9%
     * 11 = 11%
     */
    interestRate: integer("interest_rate").notNull(),

    basePrice: integer("base_price").notNull(),

    interestAmount: integer("interest_amount").notNull(),

    totalAmount: integer("total_amount").notNull(),

    depositAmount: integer("deposit_amount").notNull(),

    monthlyAmount: integer("monthly_amount").notNull(),

    status: paymentPlanStatusEnum("status").notNull().default("ACTIVE"),

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
    index("payment_plans_property_idx").on(table.propertyId),

    index("payment_plans_duration_idx").on(table.durationMonths),

    index("payment_plans_status_idx").on(table.status),

    unique("payment_plans_property_duration_unique").on(
      table.propertyId,
      table.durationMonths,
    ),
  ],
);

//    PURCHASES

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "restrict",
      }),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estateNames.id, {
        onDelete: "restrict",
      }),

    paymentPlanId: uuid("payment_plan_id")
      .notNull()
      .references(() => paymentPlans.id, {
        onDelete: "restrict",
      }),

    propertyPrice: integer("property_price").notNull(),

    interestAmount: integer("interest_amount").notNull(),

    totalAmount: integer("total_amount").notNull(),

    amountPaid: integer("amount_paid").notNull().default(0),

    outstandingAmount: integer("outstanding_amount").notNull(),

    status: purchaseStatusEnum("status").notNull().default("PENDING"),

    startDate: date("start_date"),

    nextPaymentDate: date("next_payment_date"),

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
    index("purchases_customer_idx").on(table.customerId),

    index("purchases_property_idx").on(table.propertyId),

    index("purchases_estate_idx").on(table.estateId),

    index("purchases_payment_plan_idx").on(table.paymentPlanId),

    index("purchases_status_idx").on(table.status),

    index("purchases_next_payment_idx").on(table.nextPaymentDate),
  ],
);

//    PAYMENTS

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    purchaseId: uuid("purchase_id").references(() => purchases.id, {
      onDelete: "restrict",
    }),

    type: paymentTypeEnum("type").notNull(),

    provider: paymentProviderEnum("provider").notNull().default("FLUTTERWAVE"),

    providerTransactionId: text("provider_transaction_id"),

    reference: text("reference").notNull().unique(),

    amount: integer("amount").notNull(),

    currency: text("currency").notNull().default("NGN"),

    status: paymentStatusEnum("status").notNull().default("PENDING"),

    metadata: jsonb("metadata"),

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
    index("payments_customer_idx").on(table.customerId),

    index("payments_purchase_idx").on(table.purchaseId),

    index("payments_status_idx").on(table.status),

    index("payments_provider_transaction_idx").on(table.providerTransactionId),
  ],
);

//    PAYMENT SCHEDULES

export const paymentSchedules = pgTable(
  "payment_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => purchases.id, {
        onDelete: "cascade",
      }),

    installmentNumber: integer("installment_number").notNull(),

    amount: integer("amount").notNull(),

    dueDate: date("due_date").notNull(),

    status: installmentStatusEnum("status").notNull().default("PENDING"),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

    paymentId: uuid("payment_id").references(() => payments.id, {
      onDelete: "set null",
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
    index("payment_schedules_purchase_idx").on(table.purchaseId),

    index("payment_schedules_due_date_idx").on(table.dueDate),

    index("payment_schedules_status_idx").on(table.status),

    unique("payment_schedules_installment_unique").on(
      table.purchaseId,
      table.installmentNumber,
    ),
  ],
);

//    APPLICATIONS

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "restrict",
      }),

    purchaseId: uuid("purchase_id").references(() => purchases.id, {
      onDelete: "set null",
    }),

    fullName: text("full_name").notNull(),

    email: text("email").notNull(),

    phone: text("phone").notNull(),

    dateOfBirth: date("date_of_birth").notNull(),

    address: text("address").notNull(),

    occupation: text("occupation").notNull(),

    nationality: text("nationality").notNull(),

    nextOfKin: text("next_of_kin").notNull(),

    nextOfKinPhone: text("next_of_kin_phone").notNull(),

    identificationType: text("identification_type").notNull(),

    identificationNumber: text("identification_number").notNull(),

    stage: applicationStageEnum("stage")
      .notNull()
      .default("APPLICATION_STARTED"),

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
    index("applications_customer_idx").on(table.customerId),

    index("applications_property_idx").on(table.propertyId),

    index("applications_purchase_idx").on(table.purchaseId),

    index("applications_stage_idx").on(table.stage),
  ],
);

//    DOCUMENTS

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    applicationId: uuid("application_id").references(() => applications.id, {
      onDelete: "cascade",
    }),

    purchaseId: uuid("purchase_id").references(() => purchases.id, {
      onDelete: "set null",
    }),

    type: documentTypeEnum("type").notNull(),

    fileName: text("file_name").notNull(),

    storageKey: text("storage_key").notNull(),

    fileUrl: text("file_url"),

    mimeType: text("mime_type"),

    status: documentStatusEnum("status").notNull().default("PENDING"),

    rejectionReason: text("rejection_reason"),

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
    index("documents_customer_idx").on(table.customerId),

    index("documents_application_idx").on(table.applicationId),

    index("documents_purchase_idx").on(table.purchaseId),

    index("documents_status_idx").on(table.status),
  ],
);

//    INSPECTIONS

export const inspections = pgTable(
  "inspections",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    estateId: uuid("estate_id")
      .notNull()
      .references(() => estateNames.id, {
        onDelete: "restrict",
      }),

    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "restrict",
      }),

    name: text("name").notNull(),

    phone: text("phone").notNull(),

    email: text("email").notNull(),

    preferredDate: date("preferred_date").notNull(),

    preferredTime: text("preferred_time").notNull(),

    status: inspectionStatusEnum("status").notNull().default("PENDING"),

    notes: text("notes"),

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
    index("inspections_customer_idx").on(table.customerId),

    index("inspections_estate_idx").on(table.estateId),

    index("inspections_property_idx").on(table.propertyId),

    index("inspections_status_idx").on(table.status),

    index("inspections_date_idx").on(table.preferredDate),
  ],
);

//    ATI MEMBERSHIPS

export const atiMemberships = pgTable(
  "ati_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    membershipNumber: text("membership_number").notNull().unique(),

    status: atiMembershipStatusEnum("status").notNull().default("PENDING"),

    provider: text("provider").notNull().default("SELAR"),

    providerCustomerId: text("provider_customer_id"),

    providerProductId: text("provider_product_id"),

    providerTransactionId: text("provider_transaction_id"),

    email: text("email").notNull(),

    phone: text("phone").notNull(),

    amount: integer("amount").notNull(),

    currency: text("currency").notNull().default("NGN"),

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

    index("ati_memberships_email_idx").on(table.email),

    index("ati_memberships_phone_idx").on(table.phone),

    index("ati_memberships_provider_customer_idx").on(table.providerCustomerId),

    index("ati_memberships_expiry_idx").on(table.expiryDate),
  ],
);

//    ATI TRANSACTIONS

export const atiTransactions = pgTable(
  "ati_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    membershipId: uuid("membership_id").references(() => atiMemberships.id, {
      onDelete: "set null",
    }),

    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    provider: text("provider").notNull().default("SELAR"),

    providerTransactionId: text("provider_transaction_id"),

    providerCustomerId: text("provider_customer_id"),

    providerProductId: text("provider_product_id"),

    externalReference: text("external_reference").unique(),

    amount: integer("amount").notNull(),

    currency: text("currency").notNull().default("NGN"),

    status: atiTransactionStatusEnum("status").notNull().default("PENDING"),

    rawMetadata: jsonb("raw_metadata"),

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
    index("ati_transactions_membership_idx").on(table.membershipId),

    index("ati_transactions_user_idx").on(table.userId),

    index("ati_transactions_provider_transaction_idx").on(
      table.providerTransactionId,
    ),

    index("ati_transactions_provider_customer_idx").on(
      table.providerCustomerId,
    ),

    index("ati_transactions_status_idx").on(table.status),
  ],
);

//    NOTIFICATIONS

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

//    AUDIT LOGS

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),

    action: text("action").notNull(),

    entityType: text("entity_type").notNull(),

    entityId: uuid("entity_id"),

    description: text("description"),

    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actorId),

    index("audit_logs_entity_idx").on(table.entityType, table.entityId),

    index("audit_logs_created_at_idx").on(table.createdAt),
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
