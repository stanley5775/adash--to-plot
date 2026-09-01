/**
 * Client-side Land Application PDF generator.
 *
 * ARCHITECTURE: this is kept behind a single function so that when a real
 * backend exists, official documents can instead be generated and stored
 * server-side (e.g. rendered once at approval time and served from secure
 * storage) without any calling component needing to change — they'd simply
 * fetch a URL instead of calling generateApplicationPdf().
 */
import { jsPDF } from "jspdf";
import type { Application } from "@/types/application";
import { formatNaira, formatDate } from "@/lib/payment";
import { formatApplicationStatus } from "@/lib/application-status";

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const response = await fetch("/images/logo.png");
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateApplicationPdf(
  application: Application,
  estateName: string,
  propertyTitle: string
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  const logo = await loadLogoDataUrl();
  if (logo) {
    try {
      doc.addImage(logo, "PNG", margin, y - 24, 120, 32);
    } catch {
      // If the image fails to decode, continue without it — the PDF is
      // still complete and readable without the logo.
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(10, 25, 48);
  doc.text("LAND APPLICATION FORM", pageWidth - margin, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 96, 112);
  doc.text("The Thrive Estate, Kuje, Abuja", pageWidth - margin, y + 14, { align: "right" });
  doc.text("Developer: AMIO'S GLOBAL", pageWidth - margin, y + 26, { align: "right" });
  doc.text("Exclusive Marketing Partner: Adashè-to-Plot by Achezy Homes Ltd", pageWidth - margin, y + 38, { align: "right" });

  y += 64;
  doc.setDrawColor(198, 151, 26);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(10, 25, 48);
  doc.text(`Application Number: ${application.applicationNumber ?? "Pending"}`, margin, y);
  y += 28;

  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(10, 25, 48);
    doc.text(title, margin, y);
    y += 6;
    doc.setDrawColor(226, 230, 238);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;
  };

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(98, 106, 125);
    doc.text(label, margin, y);
    doc.setTextColor(13, 18, 32);
    doc.setFont("helvetica", "bold");
    doc.text(value || "—", margin + 190, y);
    y += 18;
  };

  const a = application.applicant;
  const p = application.property;

  section("Section A — Applicant Biodata");
  row("Full Name", `${a.surname} ${a.firstName}${a.middleName ? ` ${a.middleName}` : ""}`);
  row("Residential Address", a.residentialAddress);
  row("Date of Birth", a.dateOfBirth ? formatDate(a.dateOfBirth) : "—");
  row("Sex", a.sex ?? "—");
  row("Nationality", a.nationality);
  row("State of Origin", a.stateOfOrigin);
  row("Phone Number", a.phone1);
  if (a.phone2) row("Phone Number 2", a.phone2);
  row("Email Address", a.email);
  row("Occupation", a.occupation);
  if (a.officeAddress) row("Office Address", a.officeAddress);
  y += 8;

  section("Section B — Next of Kin");
  row("Full Name", a.nextOfKin.fullName);
  row("Relationship", a.nextOfKin.relationship);
  row("Phone Number", a.nextOfKin.phone);
  row("Address", a.nextOfKin.address);
  y += 8;

  if (a.isCorporateApplicant && a.corporateInfo) {
    section("Section C — Corporate Information");
    row("Business Name", a.corporateInfo.businessName);
    row("RC Number", a.corporateInfo.rcNumber);
    row("Company Address", a.corporateInfo.companyAddress);
    row("Nature of Business", a.corporateInfo.natureOfBusiness);
    row("Company Phone", a.corporateInfo.companyPhone);
    row("Company Email", a.corporateInfo.companyEmail);
    y += 8;
  }

  section("Section D — How Did You Hear About Us?");
  row("Source", a.referralSource === "Others" ? `Others — ${a.referralOther ?? ""}` : a.referralSource);
  y += 8;

  if (y > 620) {
    doc.addPage();
    y = 56;
  }

  section("Section E — Property Information");
  row("Estate Name", estateName);
  row("Property", propertyTitle);
  row("Plot Size", `${p.plotSizeSqm} sqm`);
  row("Payment Option", p.paymentOption);
  row("Purpose of Acquisition", p.acquisitionPurpose);
  y += 8;

  section("Payment Information");
  row("Land Application Fee", formatNaira(application.applicationFee));
  row("Payment Reference", application.paymentReference ?? "—");
  row("Payment Status", application.paidAt ? "Paid" : "Pending");
  row("Application Status", formatApplicationStatus(application.status));
  row("Date Started", formatDate(application.dateStarted));
  if (application.dateSubmitted) row("Date Submitted", formatDate(application.dateSubmitted));
  y += 16;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(130, 136, 150);
  const declaration =
    "I/We hereby declare that the information provided above is true and correct. I/We understand that the " +
    "application fee/processing fee is non-refundable. This form does not guarantee allocation — allocation is " +
    "subject to verification, payment, and approval by AMIO'S GLOBAL.";
  const wrapped = doc.splitTextToSize(declaration, pageWidth - margin * 2);
  doc.text(wrapped, margin, y);
  y += wrapped.length * 12 + 24;

  doc.setDrawColor(226, 230, 238);
  doc.line(margin, y, margin + 180, y);
  doc.line(pageWidth - margin - 180, y, pageWidth - margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(98, 106, 125);
  doc.text("Applicant Signature", margin, y);
  doc.text("Date", pageWidth - margin - 90, y);

  doc.setFontSize(8);
  doc.setTextColor(150, 156, 168);
  doc.text(
    "Developed by AMIO'S GLOBAL  |  Marketed by Adashè-to-Plot — Achezy Homes Ltd",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 32,
    { align: "center" }
  );

  doc.save(`${application.applicationNumber ?? "land-application"}.pdf`);
}
