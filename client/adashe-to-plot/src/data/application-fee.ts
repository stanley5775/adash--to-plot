/**
 * The Land Application Fee is a one-time, ₦15,000 fee paid when a customer
 * submits a Land Application for a property (see src/services/application.service.ts
 * and src/services/payment.service.ts).
 *
 * IMPORTANT: This fee is completely separate from property payment plans.
 * It must NEVER be added to outright, 6, 12, 18 or 24-month plan totals —
 * see src/lib/payment.ts for the property payment plan calculation.
 */
export const LAND_APPLICATION_FEE = 15000;
