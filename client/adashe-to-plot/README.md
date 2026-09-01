# Adashè-to-Plot — Frontend Prototype

A frontend-only Next.js prototype for **Adashè-to-Plot**, a premium Nigerian real-estate investment platform. Built for a client presentation — there is no real backend; everything runs on local mock data and browser storage through service layers designed to be swapped for real APIs/databases later without touching the UI.

## Getting started

This project could not be `npm install`-ed in the sandbox it was built in (no network access), so dependencies have **not** been installed or build-verified yet. On your machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Demo credentials

- **Admin dashboard** (`/admin/login`): `admin@adashetoplot.com` / `Admin@123`
- **Customer dashboard** (`/dashboard`): pre-seeded, no login required — it always shows demo customer "Emeka Okafor"
- **Land Application flow** (`/application`): requires a customer account — register at `/register` (any email/password meeting the password rules), then you're taken straight into the application wizard

## What's included

### Public site
Home, Estates, Estate Details, Property Details, Payment Plans, ATI Plus, About, Contact — with an ATI Plus 5% payment-plan discount toggle on every payment-plan display.

### Land Application system (`/application`, `/register`, `/login`)
A full multi-step Land Application flow modelled on Adashè-to-Plot's physical Land Application Form for The Thrive Estate (developer: AMIO'S GLOBAL; exclusive marketing partner: Adashè-to-Plot by Achezy Homes Ltd):
- Register/Login (mock, localStorage-backed — see `src/services/auth.service.ts`)
- Applicant Biodata, Next of Kin, optional Corporate Information, Referral Source
- Property/Application Information (estate, property, plot size, payment option, purpose)
- Review → simulated ₦15,000 payment (`src/services/payment.service.ts`) → success screen
- Downloadable, branded PDF of the completed application (`src/lib/pdf.ts`, via jsPDF)
- Everything surfaces in the customer dashboard at `/dashboard/applications`

**Important:** the ₦15,000 Land Application fee is completely separate from property payment plans — it is never added to outright/6/12/18/24-month totals (see `src/lib/payment.ts` and `src/data/application-fee.ts`).

### Customer Dashboard (`/dashboard`)
Overview, My Properties, Payments (live installment schedule + 5-day payment reminder), Applications (list + detail with PDF download), Documents, Inspections, ATI Plus status.

### Admin Dashboard (`/admin`) — now access-controlled
- `/admin/login` — dedicated admin login (separate from the public site and from customer accounts)
- Real Next.js Route Handlers: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`, backed by an HttpOnly session cookie and a temporary mock credential store (`src/lib/server/admin-mock-db.ts`)
- `src/middleware.ts` redirects any unauthenticated request to `/admin/*` back to `/admin/login`
- The dashboard pages themselves (Estates, Properties, Payment Plans, Customers, ATI Plus Members, Inspections, Applications, Sales) are unchanged from before — only moved into an `admin/(dashboard)` route group so the login page has no sidebar chrome
- The public Navbar/Footer never render on `/admin/*`, and there are no admin links anywhere in the public site

## Architecture

```
src/
  app/            Routes (App Router), including src/app/api/admin/* Route Handlers
  components/     UI, layout, estate, property, booking, dashboard, admin, auth, application components
  data/           Mock data — the only thing you'd swap for a real database
  services/       Thin async wrappers over data/ — swap the body for a fetch() call later
  types/          Shared TypeScript types
  lib/            Payment-plan math, plot-grid generation, PDF generation, storage abstraction, validators
  lib/server/     Server-only mock admin store + session token helpers (never imported by client code)
  middleware.ts   Route protection for /admin/*
```

To connect a real backend later:
- Public/customer data: only `src/services/*.ts` need to change (estate, property, application, payment, auth)
- Admin auth: only `src/app/api/admin/*/route.ts` need to change (swap the mock store for a real database + password hashing)
- Browser persistence: only `src/lib/storage.ts` needs to change (swap localStorage calls for API calls)

## Notes

- Built targeting Next.js 16 / React 19 / Tailwind CSS v4.
- All forms (inspection booking, interest, ATI Plus membership, contact, admin add-estate/property) are frontend-only — they simulate a submission and show a success state.
- The plot availability grid is a stylised, deterministic visual representation (not a real GIS map).
- The customer auth system (`/login`, `/register`) and the admin auth system (`/admin/login`) are intentionally separate and unrelated — a customer account cannot log into `/admin`, and vice versa.
