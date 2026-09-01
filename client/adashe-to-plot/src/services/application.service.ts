/**
 * Land Application service.
 *
 * ARCHITECTURE: pages/components call only the functions exported here —
 * never `src/data/applications.ts` or `src/lib/storage.ts` directly. Seed
 * demo applications (src/data/applications.ts) are merged with applications
 * created through the live /application flow (persisted via
 * src/lib/storage.ts) so the dashboard and admin views show both.
 *
 * Later, every function body below becomes a `fetch()` call to a real
 * backend/database — the function signatures are designed to stay the same,
 * so no page or component needs to change.
 */
import type { Application, ApplicationStatus, CreateApplicationInput } from "@/types/application";
import { applications as seedApplications } from "@/data/applications";
import { LAND_APPLICATION_FEE } from "@/data/application-fee";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";

function getStoredApplications(): Application[] {
  return readStorage<Application[]>(STORAGE_KEYS.applications, []);
}

function saveStoredApplications(apps: Application[]): void {
  writeStorage(STORAGE_KEYS.applications, apps);
}

function getAllApplications(): Application[] {
  return [...getStoredApplications(), ...seedApplications];
}

/** Generates a mock application number. A real backend/database must
 * generate the official, globally-unique application number — this is only
 * a stand-in so the frontend prototype has something to display. */
function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const countThisYear = getAllApplications().filter((a) => a.applicationNumber?.includes(String(year))).length;
  return `APP-${year}-${String(countThisYear + 1).padStart(4, "0")}`;
}

export async function createApplication(input: CreateApplicationInput): Promise<Application> {
  const application: Application = {
    id: `app-${Date.now()}`,
    applicant: input.applicant,
    property: input.property,
    status: "draft",
    currentStage: "Application Started",
    stagesCompleted: ["Application Started"],
    applicationFee: LAND_APPLICATION_FEE,
    dateStarted: new Date().toISOString(),
  };

  const stored = getStoredApplications();
  saveStoredApplications([...stored, application]);
  return application;
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  return getAllApplications().find((a) => a.id === id);
}

export async function getUserApplications(userEmail?: string): Promise<Application[]> {
  const all = getAllApplications();
  if (!userEmail) return all;
  return all.filter((a) => a.applicant.email.toLowerCase() === userEmail.toLowerCase());
}

export async function getApplicationByCustomerEmail(email: string): Promise<Application | undefined> {
  return getAllApplications().find((a) => a.applicant.email.toLowerCase() === email.toLowerCase());
}

export async function updateApplication(id: string, patch: Partial<Application>): Promise<Application | undefined> {
  const stored = getStoredApplications();
  const index = stored.findIndex((a) => a.id === id);

  if (index === -1) {
    // Seed applications are treated as read-only demo records in this prototype.
    return getAllApplications().find((a) => a.id === id);
  }

  const updated: Application = { ...stored[index], ...patch };
  stored[index] = updated;
  saveStoredApplications(stored);
  return updated;
}

export async function submitApplication(id: string, paymentReference: string): Promise<Application | undefined> {
  return updateApplication(id, {
    status: "submitted",
    currentStage: "Payment Confirmed",
    stagesCompleted: ["Application Started", "Application Submitted", "Payment Confirmed"],
    applicationNumber: generateApplicationNumber(),
    paymentReference,
    paidAt: new Date().toISOString(),
    dateSubmitted: new Date().toISOString(),
  });
}

export async function getApplicationStatus(id: string): Promise<ApplicationStatus | undefined> {
  const application = await getApplicationById(id);
  return application?.status;
}
