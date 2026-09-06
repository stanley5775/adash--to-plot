CREATE TYPE "application_stage" AS ENUM('APPLICATION_STARTED', 'DOCUMENTS_SUBMITTED', 'VERIFICATION', 'APPROVED', 'ALLOCATION');--> statement-breakpoint
CREATE TYPE "ati_membership_status" AS ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "ati_transaction_status" AS ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "document_status" AS ENUM('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "document_type" AS ENUM('ID', 'PASSPORT_PHOTO', 'PROOF_OF_PAYMENT', 'CONTRACT', 'OTHER');--> statement-breakpoint
CREATE TYPE "estate_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "inspection_status" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "installment_status" AS ENUM('PENDING', 'PAID', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('PAYMENT_REMINDER', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'APPLICATION_UPDATE', 'INSPECTION_UPDATE', 'ATI_MEMBERSHIP', 'GENERAL');--> statement-breakpoint
CREATE TYPE "payment_plan_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "payment_provider" AS ENUM('FLUTTERWAVE');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "payment_type" AS ENUM('PROPERTY_PAYMENT', 'LAND_APPLICATION_FEE');--> statement-breakpoint
CREATE TYPE "property_status" AS ENUM('AVAILABLE', 'RESERVED', 'SOLD');--> statement-breakpoint
CREATE TYPE "purchase_status" AS ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DEFAULTED');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('CUSTOMER', 'ADMIN', 'SUB_ADMIN');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"purchase_id" uuid,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"address" text NOT NULL,
	"occupation" text NOT NULL,
	"nationality" text NOT NULL,
	"next_of_kin" text NOT NULL,
	"next_of_kin_phone" text NOT NULL,
	"identification_type" text NOT NULL,
	"identification_number" text NOT NULL,
	"stage" "application_stage" DEFAULT 'APPLICATION_STARTED'::"application_stage" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ati_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"membership_number" text NOT NULL UNIQUE,
	"status" "ati_membership_status" DEFAULT 'PENDING'::"ati_membership_status" NOT NULL,
	"provider" text DEFAULT 'SELAR' NOT NULL,
	"provider_customer_id" text,
	"provider_product_id" text,
	"provider_transaction_id" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"start_date" timestamp with time zone,
	"expiry_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ati_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"membership_id" uuid,
	"user_id" uuid,
	"provider" text DEFAULT 'SELAR' NOT NULL,
	"provider_transaction_id" text,
	"provider_customer_id" text,
	"provider_product_id" text,
	"external_reference" text UNIQUE,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"status" "ati_transaction_status" DEFAULT 'PENDING'::"ati_transaction_status" NOT NULL,
	"raw_metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"application_id" uuid,
	"purchase_id" uuid,
	"type" "document_type" NOT NULL,
	"file_name" text NOT NULL,
	"storage_key" text NOT NULL,
	"file_url" text,
	"mime_type" text,
	"status" "document_status" DEFAULT 'PENDING'::"document_status" NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estate_images" (
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
CREATE TABLE "estate_names" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"name" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estates" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"estate_id" uuid PRIMARY KEY,
	"location" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"description" text,
	"starting_price" numeric(15,2) NOT NULL,
	"total_plots" integer NOT NULL,
	"features" text[],
	"nearby_landmarks" text[],
	"status" "estate_status" DEFAULT 'ACTIVE'::"estate_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"estate_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"preferred_date" date NOT NULL,
	"preferred_time" text NOT NULL,
	"status" "inspection_status" DEFAULT 'PENDING'::"inspection_status" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
CREATE TABLE "payment_plans" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"property_id" uuid NOT NULL,
	"duration_months" integer NOT NULL,
	"interest_rate" integer NOT NULL,
	"base_price" integer NOT NULL,
	"interest_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"deposit_amount" integer NOT NULL,
	"monthly_amount" integer NOT NULL,
	"status" "payment_plan_status" DEFAULT 'ACTIVE'::"payment_plan_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_plans_property_duration_unique" UNIQUE("property_id","duration_months")
);
--> statement-breakpoint
CREATE TABLE "payment_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"purchase_id" uuid NOT NULL,
	"installment_number" integer NOT NULL,
	"amount" integer NOT NULL,
	"due_date" date NOT NULL,
	"status" "installment_status" DEFAULT 'PENDING'::"installment_status" NOT NULL,
	"paid_at" timestamp with time zone,
	"payment_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_schedules_installment_unique" UNIQUE("purchase_id","installment_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"purchase_id" uuid,
	"type" "payment_type" NOT NULL,
	"provider" "payment_provider" DEFAULT 'FLUTTERWAVE'::"payment_provider" NOT NULL,
	"provider_transaction_id" text,
	"reference" text NOT NULL UNIQUE,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING'::"payment_status" NOT NULL,
	"metadata" jsonb,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"estate_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"size_sqm" integer NOT NULL,
	"price" integer NOT NULL,
	"status" "property_status" DEFAULT 'AVAILABLE'::"property_status" NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"estate_id" uuid NOT NULL,
	"payment_plan_id" uuid NOT NULL,
	"property_price" integer NOT NULL,
	"interest_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"outstanding_amount" integer NOT NULL,
	"status" "purchase_status" DEFAULT 'PENDING'::"purchase_status" NOT NULL,
	"start_date" date,
	"next_payment_date" date,
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
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'CUSTOMER'::"user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "applications_customer_idx" ON "applications" ("customer_id");--> statement-breakpoint
CREATE INDEX "applications_property_idx" ON "applications" ("property_id");--> statement-breakpoint
CREATE INDEX "applications_purchase_idx" ON "applications" ("purchase_id");--> statement-breakpoint
CREATE INDEX "applications_stage_idx" ON "applications" ("stage");--> statement-breakpoint
CREATE INDEX "ati_memberships_user_idx" ON "ati_memberships" ("user_id");--> statement-breakpoint
CREATE INDEX "ati_memberships_status_idx" ON "ati_memberships" ("status");--> statement-breakpoint
CREATE INDEX "ati_memberships_email_idx" ON "ati_memberships" ("email");--> statement-breakpoint
CREATE INDEX "ati_memberships_phone_idx" ON "ati_memberships" ("phone");--> statement-breakpoint
CREATE INDEX "ati_memberships_provider_customer_idx" ON "ati_memberships" ("provider_customer_id");--> statement-breakpoint
CREATE INDEX "ati_memberships_expiry_idx" ON "ati_memberships" ("expiry_date");--> statement-breakpoint
CREATE INDEX "ati_transactions_membership_idx" ON "ati_transactions" ("membership_id");--> statement-breakpoint
CREATE INDEX "ati_transactions_user_idx" ON "ati_transactions" ("user_id");--> statement-breakpoint
CREATE INDEX "ati_transactions_provider_transaction_idx" ON "ati_transactions" ("provider_transaction_id");--> statement-breakpoint
CREATE INDEX "ati_transactions_provider_customer_idx" ON "ati_transactions" ("provider_customer_id");--> statement-breakpoint
CREATE INDEX "ati_transactions_status_idx" ON "ati_transactions" ("status");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" ("created_at");--> statement-breakpoint
CREATE INDEX "documents_customer_idx" ON "documents" ("customer_id");--> statement-breakpoint
CREATE INDEX "documents_application_idx" ON "documents" ("application_id");--> statement-breakpoint
CREATE INDEX "documents_purchase_idx" ON "documents" ("purchase_id");--> statement-breakpoint
CREATE INDEX "documents_status_idx" ON "documents" ("status");--> statement-breakpoint
CREATE INDEX "estate_images_estate_id_idx" ON "estate_images" ("estate_id");--> statement-breakpoint
CREATE INDEX "estates_status_idx" ON "estates" ("status");--> statement-breakpoint
CREATE INDEX "estates_city_idx" ON "estates" ("city");--> statement-breakpoint
CREATE INDEX "estates_state_idx" ON "estates" ("state");--> statement-breakpoint
CREATE INDEX "inspections_customer_idx" ON "inspections" ("customer_id");--> statement-breakpoint
CREATE INDEX "inspections_estate_idx" ON "inspections" ("estate_id");--> statement-breakpoint
CREATE INDEX "inspections_property_idx" ON "inspections" ("property_id");--> statement-breakpoint
CREATE INDEX "inspections_status_idx" ON "inspections" ("status");--> statement-breakpoint
CREATE INDEX "inspections_date_idx" ON "inspections" ("preferred_date");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" ("is_read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" ("created_at");--> statement-breakpoint
CREATE INDEX "password_reset_otps_user_idx" ON "password_reset_otps" ("user_id");--> statement-breakpoint
CREATE INDEX "password_reset_otps_expires_idx" ON "password_reset_otps" ("expires_at");--> statement-breakpoint
CREATE INDEX "payment_plans_property_idx" ON "payment_plans" ("property_id");--> statement-breakpoint
CREATE INDEX "payment_plans_duration_idx" ON "payment_plans" ("duration_months");--> statement-breakpoint
CREATE INDEX "payment_plans_status_idx" ON "payment_plans" ("status");--> statement-breakpoint
CREATE INDEX "payment_schedules_purchase_idx" ON "payment_schedules" ("purchase_id");--> statement-breakpoint
CREATE INDEX "payment_schedules_due_date_idx" ON "payment_schedules" ("due_date");--> statement-breakpoint
CREATE INDEX "payment_schedules_status_idx" ON "payment_schedules" ("status");--> statement-breakpoint
CREATE INDEX "payments_customer_idx" ON "payments" ("customer_id");--> statement-breakpoint
CREATE INDEX "payments_purchase_idx" ON "payments" ("purchase_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" ("status");--> statement-breakpoint
CREATE INDEX "payments_provider_transaction_idx" ON "payments" ("provider_transaction_id");--> statement-breakpoint
CREATE INDEX "properties_estate_id_idx" ON "properties" ("estate_id");--> statement-breakpoint
CREATE INDEX "properties_status_idx" ON "properties" ("status");--> statement-breakpoint
CREATE INDEX "properties_price_idx" ON "properties" ("price");--> statement-breakpoint
CREATE INDEX "purchases_customer_idx" ON "purchases" ("customer_id");--> statement-breakpoint
CREATE INDEX "purchases_property_idx" ON "purchases" ("property_id");--> statement-breakpoint
CREATE INDEX "purchases_estate_idx" ON "purchases" ("estate_id");--> statement-breakpoint
CREATE INDEX "purchases_payment_plan_idx" ON "purchases" ("payment_plan_id");--> statement-breakpoint
CREATE INDEX "purchases_status_idx" ON "purchases" ("status");--> statement-breakpoint
CREATE INDEX "purchases_next_payment_idx" ON "purchases" ("next_payment_date");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" ("expires_at");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" ("phone");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" ("role");--> statement-breakpoint
CREATE INDEX "users_active_idx" ON "users" ("is_active");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_purchase_id_purchases_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ati_memberships" ADD CONSTRAINT "ati_memberships_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "ati_transactions" ADD CONSTRAINT "ati_transactions_membership_id_ati_memberships_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "ati_memberships"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ati_transactions" ADD CONSTRAINT "ati_transactions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_applications_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_purchase_id_purchases_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "estate_images" ADD CONSTRAINT "estate_images_estate_id_estates_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estates"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "estates" ADD CONSTRAINT "estates_estate_id_estate_names_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estate_names"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_estate_id_estate_names_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estate_names"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD CONSTRAINT "password_reset_otps_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_purchase_id_purchases_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_payment_id_payments_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_purchase_id_purchases_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_estate_id_estate_names_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estate_names"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_estate_id_estate_names_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estate_names"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_payment_plan_id_payment_plans_id_fkey" FOREIGN KEY ("payment_plan_id") REFERENCES "payment_plans"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;