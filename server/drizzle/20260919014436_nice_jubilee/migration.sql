CREATE TYPE "application_stage" AS ENUM('APPLICATION_STARTED', 'DOCUMENTS_SUBMITTED', 'VERIFICATION', 'APPROVED', 'ALLOCATION');--> statement-breakpoint
CREATE TYPE "application_status" AS ENUM('PENDING_PAYMENT', 'PAID', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "ati_membership_status" AS ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "ati_transaction_status" AS ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "document_status" AS ENUM('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "document_type" AS ENUM('ID', 'PASSPORT_PHOTO', 'PROOF_OF_PAYMENT', 'CONTRACT', 'OTHER');--> statement-breakpoint
CREATE TYPE "estate_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "inspection_status" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "installment_status" AS ENUM('PENDING', 'PAID', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('PAYMENT_REMINDER', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'APPLICATION_UPDATE', 'INSPECTION_UPDATE', 'ATI_MEMBERSHIP', 'GENERAL');--> statement-breakpoint
CREATE TYPE "payment_provider" AS ENUM('PAYSTACK');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('PENDING', 'SUCCESSFUL', 'FAILED');--> statement-breakpoint
CREATE TYPE "payment_type" AS ENUM('LAND_APPLICATION_FEE', 'PROPERTY_INSTALLMENT', 'ATI_MEMBERSHIP');--> statement-breakpoint
CREATE TYPE "property_payment_verification_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "property_status" AS ENUM('ACTIVE', 'NON_ACTIVE', 'SOLD_OUT');--> statement-breakpoint
CREATE TYPE "purchase_status" AS ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DEFAULTED');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('CUSTOMER', 'ADMIN', 'SUB_ADMIN');--> statement-breakpoint
CREATE TABLE "property_payment_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"property_id" uuid NOT NULL,
	"estate_id" uuid NOT NULL,
	"name" text NOT NULL,
	"duration_months" integer,
	"total_amount" numeric(12,2) NOT NULL,
	"monthly_amount" numeric(12,2),
	"interest_rate" numeric(5,2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"surname" text NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"user_id" uuid NOT NULL,
	"sex" text NOT NULL,
	"residential_address" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"nationality" text NOT NULL,
	"state_of_origin" text NOT NULL,
	"phone1" text NOT NULL,
	"phone2" text,
	"email" text NOT NULL,
	"occupation" text NOT NULL,
	"office_address" text,
	"next_of_kin_name" text NOT NULL,
	"next_of_kin_relationship" text NOT NULL,
	"next_of_kin_phone" text NOT NULL,
	"next_of_kin_address" text NOT NULL,
	"is_corporate" boolean DEFAULT false NOT NULL,
	"business_name" text,
	"rc_number" text,
	"company_address" text,
	"nature_of_business" text,
	"company_phone" text,
	"company_email" text,
	"referral_source" text,
	"referral_other" text,
	"estate" text NOT NULL,
	"plot_size" text NOT NULL,
	"payment_option" text NOT NULL,
	"acquisition_purpose" text NOT NULL,
	"status" "application_status" DEFAULT 'PENDING_PAYMENT'::"application_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"isApplication" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ati_membership_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"membership_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"ATI_membership" boolean DEFAULT false NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"provider" "payment_provider" DEFAULT 'PAYSTACK'::"payment_provider" NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING'::"payment_status" NOT NULL,
	"reference" text NOT NULL UNIQUE,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ati_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"status" "ati_membership_status" DEFAULT 'PENDING'::"ati_membership_status" NOT NULL,
	"ATI_membership" boolean DEFAULT false NOT NULL,
	"start_date" timestamp with time zone,
	"expiry_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estate_names" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"description" text,
	"slug" varchar UNIQUE,
	"main_image_url" text,
	"city" varchar(100),
	"state" varchar(100),
	"starting_price" numeric(15,2),
	"main_image_public_id" text,
	"name" text NOT NULL UNIQUE,
	"account_name" text NOT NULL,
	"account_number" text NOT NULL,
	"bank_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_otps" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"user_id" uuid NOT NULL,
	"otp_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"membership_id" uuid,
	"purchase_id" uuid,
	"application_id" uuid,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"provider" "payment_provider" DEFAULT 'PAYSTACK'::"payment_provider" NOT NULL,
	"reference" text NOT NULL UNIQUE,
	"status" "payment_status" DEFAULT 'PENDING'::"payment_status" NOT NULL,
	"type" "payment_type" NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"estate_id" uuid NOT NULL,
	"status" "property_status" DEFAULT 'ACTIVE'::"property_status" NOT NULL,
	"location" text NOT NULL,
	"slug" varchar NOT NULL UNIQUE,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"description" text,
	"starting_price" numeric(15,2) NOT NULL,
	"total_plots" integer NOT NULL,
	"features" text[],
	"nearby_landmarks" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"estate_id" uuid NOT NULL,
	"main_img_url" text,
	"main_image_public_id" text,
	"image_1_url" text,
	"image_1_public_id" text,
	"image_2_url" text,
	"image_2_public_id" text,
	"image_3_url" text,
	"image_3_public_id" text,
	"image_4_url" text,
	"image_4_public_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_installments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"purchase_id" uuid NOT NULL,
	"installment_number" integer NOT NULL,
	"amount" numeric(15,2) NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone,
	"status" "installment_status" DEFAULT 'PENDING'::"installment_status" NOT NULL,
	"payment_reference" text UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "purchase_installment_unique" UNIQUE("purchase_id","installment_number")
);
--> statement-breakpoint
CREATE TABLE "property_payment_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"purchase_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(15,2) NOT NULL,
	"receipt_url" text NOT NULL,
	"receipt_public_id" text,
	"status" "property_payment_verification_status" DEFAULT 'PENDING'::"property_payment_verification_status" NOT NULL,
	"rejection_reason" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"payment_plan_id" uuid NOT NULL,
	"property_price" numeric(15,2) NOT NULL,
	"total_payable" numeric(15,2) NOT NULL,
	"amount_paid" numeric(15,2) DEFAULT '0' NOT NULL,
	"balance" numeric(15,2) NOT NULL,
	"duration_months" integer NOT NULL,
	"payment_amount" numeric(15,2),
	"interest_percentage" numeric(5,2) DEFAULT '0' NOT NULL,
	"status" "purchase_status" DEFAULT 'PENDING'::"purchase_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"refresh_token" text NOT NULL UNIQUE,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"first_name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"phone" text NOT NULL,
	"ATI_membership" boolean DEFAULT false NOT NULL,
	"is_application" boolean DEFAULT false NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'CUSTOMER'::"user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "property_payment_plan_property_idx" ON "property_payment_plan" ("property_id");--> statement-breakpoint
CREATE INDEX "property_payment_plan_estate_idx" ON "property_payment_plan" ("estate_id");--> statement-breakpoint
CREATE UNIQUE INDEX "property_payment_plan_one_outright_idx" ON "property_payment_plan" ("property_id") WHERE "duration_months" IS NULL;--> statement-breakpoint
CREATE INDEX "applications_email_idx" ON "applications" ("email");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" ("status");--> statement-breakpoint
CREATE INDEX "applications_estate_idx" ON "applications" ("estate");--> statement-breakpoint
CREATE INDEX "ati_membership_payments_membership_idx" ON "ati_membership_payments" ("membership_id");--> statement-breakpoint
CREATE INDEX "ati_membership_payments_user_idx" ON "ati_membership_payments" ("user_id");--> statement-breakpoint
CREATE INDEX "ati_membership_payments_status_idx" ON "ati_membership_payments" ("status");--> statement-breakpoint
CREATE INDEX "ati_memberships_user_idx" ON "ati_memberships" ("user_id");--> statement-breakpoint
CREATE INDEX "ati_memberships_status_idx" ON "ati_memberships" ("status");--> statement-breakpoint
CREATE INDEX "ati_memberships_expiry_idx" ON "ati_memberships" ("expiry_date");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" ("is_read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" ("created_at");--> statement-breakpoint
CREATE INDEX "password_reset_otps_user_idx" ON "password_reset_otps" ("user_id");--> statement-breakpoint
CREATE INDEX "password_reset_otps_expires_idx" ON "password_reset_otps" ("expires_at");--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" ("user_id");--> statement-breakpoint
CREATE INDEX "payments_purchase_idx" ON "payments" ("purchase_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" ("status");--> statement-breakpoint
CREATE INDEX "estates_city_idx" ON "properties" ("city");--> statement-breakpoint
CREATE INDEX "estates_state_idx" ON "properties" ("state");--> statement-breakpoint
CREATE INDEX "estates_estate_id_idx" ON "properties" ("estate_id");--> statement-breakpoint
CREATE INDEX "estate_images_estate_id_idx" ON "properties_images" ("estate_id");--> statement-breakpoint
CREATE INDEX "property_installments_purchase_idx" ON "property_installments" ("purchase_id");--> statement-breakpoint
CREATE INDEX "property_installments_status_idx" ON "property_installments" ("status");--> statement-breakpoint
CREATE INDEX "property_installments_due_date_idx" ON "property_installments" ("due_date");--> statement-breakpoint
CREATE INDEX "property_payment_verifications_purchase_idx" ON "property_payment_verifications" ("purchase_id");--> statement-breakpoint
CREATE INDEX "property_payment_verifications_user_idx" ON "property_payment_verifications" ("user_id");--> statement-breakpoint
CREATE INDEX "property_payment_verifications_status_idx" ON "property_payment_verifications" ("status");--> statement-breakpoint
CREATE INDEX "property_purchases_user_idx" ON "property_purchases" ("user_id");--> statement-breakpoint
CREATE INDEX "property_purchases_property_idx" ON "property_purchases" ("property_id");--> statement-breakpoint
CREATE INDEX "property_purchases_plan_idx" ON "property_purchases" ("payment_plan_id");--> statement-breakpoint
CREATE INDEX "property_purchases_status_idx" ON "property_purchases" ("status");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" ("expires_at");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" ("phone");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" ("role");--> statement-breakpoint
CREATE INDEX "users_active_idx" ON "users" ("is_active");--> statement-breakpoint
ALTER TABLE "property_payment_plan" ADD CONSTRAINT "property_payment_plan_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "property_payment_plan" ADD CONSTRAINT "property_payment_plan_estate_id_estate_names_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estate_names"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "ati_membership_payments" ADD CONSTRAINT "ati_membership_payments_membership_id_ati_memberships_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "ati_memberships"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "ati_membership_payments" ADD CONSTRAINT "ati_membership_payments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "ati_memberships" ADD CONSTRAINT "ati_memberships_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD CONSTRAINT "password_reset_otps_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_id_ati_memberships_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "ati_memberships"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_purchase_id_property_purchases_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "property_purchases"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_application_id_applications_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_estate_id_estate_names_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estate_names"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "properties_images" ADD CONSTRAINT "properties_images_estate_id_properties_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "properties"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "property_installments" ADD CONSTRAINT "property_installments_purchase_id_property_purchases_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "property_purchases"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "property_payment_verifications" ADD CONSTRAINT "property_payment_verifications_knBmNa9uKqpe_fkey" FOREIGN KEY ("purchase_id") REFERENCES "property_purchases"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "property_payment_verifications" ADD CONSTRAINT "property_payment_verifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "property_payment_verifications" ADD CONSTRAINT "property_payment_verifications_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "property_purchases" ADD CONSTRAINT "property_purchases_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "property_purchases" ADD CONSTRAINT "property_purchases_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "property_purchases" ADD CONSTRAINT "property_purchases_unyn1BBHCmWq_fkey" FOREIGN KEY ("payment_plan_id") REFERENCES "property_payment_plan"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;