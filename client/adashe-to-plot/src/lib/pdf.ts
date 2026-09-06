/**
 * Client-side Land Application PDF generator.
 *
 * Designed to visually follow the official
 * Adashè-to-Plot / AMIO GLOBAL PROJECTS application form.
 *
 * When a real backend exists, this can be replaced by a
 * server-generated official document without changing
 * the calling component.
 */

import { jsPDF } from "jspdf";
import type { Application } from "@/types/application";
import { formatNaira, formatDate } from "@/lib/payment";

async function loadImageDataUrl(path: string): Promise<string | null> {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

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
  propertyTitle: string,
): Promise<void> {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 24;

  /*
   * Reference form colours
   */
  const GOLD: [number, number, number] = [133, 108, 0];
  const BLUE: [number, number, number] = [83, 119, 226];
  const RED: [number, number, number] = [235, 65, 65];
  const BLACK: [number, number, number] = [20, 20, 20];
  const WHITE: [number, number, number] = [255, 255, 255];

  /*
   * Load both logos.
   *
   * Adashè logo:
   * /images/logo.png
   *
   * AMIO logo:
   * /images/amio-logo.png
   *
   * If the AMIO logo does not exist, the PDF still works.
   */
  const adasheLogo = await loadImageDataUrl("/images/logo.png");
  const amioLogo = await loadImageDataUrl("/images/amio-logo.png");

  const applicant = application.applicant;
  const property = application.property;

  const fullName = `${applicant.surname} ${applicant.firstName}${
    applicant.middleName ? ` ${applicant.middleName}` : ""
  }`.trim();

  /*
   * ---------------------------------------------------------
   * BASIC DRAWING HELPERS
   * ---------------------------------------------------------
   */

  function drawPageBorder() {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(2);

    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  }

  function drawHeader() {
    drawPageBorder();

    /*
     * Application number
     */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...RED);

    doc.text(application.applicationNumber ?? "0001", pageWidth - 38, 34, {
      align: "right",
    });

    /*
     * AMIO logo / branding
     */
    if (amioLogo) {
      try {
        doc.addImage(amioLogo, "PNG", 25, 28, 90, 70);
      } catch {
        // Continue without logo.
      }
    }

    /*
     * AMIO GLOBAL PROJECTS text
     */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(25);
    doc.setTextColor(...BLUE);

    doc.text("AMIO", 195, 54, {
      align: "center",
    });

    doc.setFontSize(20);

    doc.text("GLOBAL PROJECTS", 195, 80, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor(...RED);

    doc.text("RC: 043136", 195, 101, {
      align: "center",
    });

    /*
     * Vertical separator
     */
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(2);

    doc.line(300, 26, 300, 106);

    /*
     * Adashè logo
     */
    if (adasheLogo) {
      try {
        doc.addImage(adasheLogo, "PNG", 325, 35, 135, 65);
      } catch {
        // Continue without logo.
      }
    }
  }

  function drawFooter() {
    /*
     * Footer background
     */
    doc.setFillColor(...GOLD);

    doc.rect(9, pageHeight - 38, pageWidth - 18, 29, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...BLACK);

    doc.text("www.adashetoplot.org", 42, pageHeight - 19);

    doc.text("achezyhomes@gmail.com", 225, pageHeight - 19);

    doc.text("0708 403 8831", 465, pageHeight - 19);
  }

  function sectionTitle(title: string, y: number, subtitle?: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...BLUE);

    doc.text(title, pageWidth / 2, y, { align: "center" });

    if (subtitle) {
      doc.setFontSize(11);

      doc.text(subtitle, pageWidth / 2, y + 20, { align: "center" });
    }
  }

  function fieldLine(
    label: string,
    value: string,
    x: number,
    y: number,
    lineStart: number,
    lineEnd: number,
  ) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);

    doc.text(label, x, y);

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.4);

    doc.line(lineStart, y + 3, lineEnd, y + 3);

    if (value) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);

      doc.text(value, lineStart + 4, y - 2);
    }
  }

  function checkbox(x: number, y: number, label: string, checked = false) {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.5);

    doc.rect(x, y - 13, 25, 25);

    if (checked) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...GOLD);

      doc.text("✓", x + 4, y + 6);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);

    doc.text(label, x + 32, y + 4);
  }

  /*
   * ---------------------------------------------------------
   * PAGE 1
   * APPLICANT BIO DATA
   * ---------------------------------------------------------
   */

  drawHeader();

  /*
   * ₦15,000 block
   */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...RED);

  doc.text(formatNaira(application.applicationFee || 15000), 18, 137);

  doc.setFontSize(13);

  doc.text("NON-REFUNDABLE", 18, 157);

  doc.setFontSize(12);
  doc.setTextColor(...BLUE);

  doc.text("Sites and Services", 18, 177);

  /*
   * Passport box
   */
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.5);

  doc.roundedRect(385, 125, 165, 145, 8, 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...BLUE);

  doc.text("Affix 2 copies", 467, 183, { align: "center" });

  doc.text("of", 467, 205, { align: "center" });

  doc.text("your", 467, 227, { align: "center" });

  doc.text("passport", 467, 249, { align: "center" });

  /*
   * Application Form banner
   */
  doc.setFillColor(...GOLD);

  doc.roundedRect(90, 280, 415, 35, 8, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);

  doc.text("APPLICATION FORM", pageWidth / 2, 305, { align: "center" });

  sectionTitle(
    "APPLICANT BIO DATA",
    338,
    "Please fill in BLOCK LETTERS and TICK appropriately",
  );

  /*
   * Applicant fields
   */
  fieldLine("NAME OF APPLICANT IN FULL:", fullName, 18, 385, 235, 565);

  fieldLine(
    "DATE OF BIRTH:",
    applicant.dateOfBirth ? formatDate(applicant.dateOfBirth) : "",
    18,
    430,
    115,
    275,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);

  doc.text("GENDER:", 305, 430);

  checkbox(355, 425, "MALE", applicant.sex?.toLowerCase() === "male");

  checkbox(455, 425, "FEMALE", applicant.sex?.toLowerCase() === "female");

  fieldLine("MARITAL STATUS:", "", 18, 475, 130, 470);

  fieldLine("STATE OF ORIGIN:", applicant.stateOfOrigin, 18, 520, 125, 275);

  fieldLine("NATIONALITY:", applicant.nationality, 300, 520, 370, 565);

  fieldLine(
    "RESIDENTIAL ADDRESS: (House No./Street/Town/State):",
    applicant.residentialAddress,
    18,
    565,
    300,
    565,
  );

  doc.setDrawColor(...GOLD);
  doc.line(18, 600, 565, 600);

  fieldLine("PHONE:", applicant.phone1, 18, 640, 65, 275);

  fieldLine("EMAIL:", applicant.email, 285, 640, 325, 565);

  fieldLine("OCCUPATION:", applicant.occupation, 18, 685, 105, 300);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);

  doc.text("SELF EMPLOYED?", 315, 685);

  checkbox(400, 680, "YES");
  checkbox(485, 680, "NO");

  drawFooter();

  /*
   * ---------------------------------------------------------
   * PAGE 2
   * NEXT OF KIN + IDENTIFICATION
   * ---------------------------------------------------------
   */

  doc.addPage();

  drawHeader();

  sectionTitle("NEXT OF KIN DETAILS", 145);

  const kin = applicant.nextOfKin;

  fieldLine("NAME IN FULL:", kin.fullName, 18, 195, 105, 565);

  fieldLine("STATE OF ORIGIN:", "", 18, 240, 120, 285);

  fieldLine("NATIONALITY:", "", 300, 240, 370, 565);

  fieldLine(
    "RESIDENTIAL ADDRESS: (House No./Street/Town/State):",
    kin.address,
    18,
    285,
    300,
    565,
  );

  doc.line(18, 320, 565, 320);

  fieldLine("PHONE:", kin.phone, 18, 365, 65, 275);

  fieldLine("EMAIL:", "", 285, 365, 325, 565);

  fieldLine("RELATIONSHIP:", kin.relationship, 18, 410, 115, 470);

  sectionTitle("MEANS OF IDENTIFICATION", 475);

  checkbox(40, 520, "Driver’s License");

  checkbox(230, 520, "INT’L Passport");

  checkbox(420, 520, "Voters Card");

  checkbox(220, 580, "National I.D Card");

  /*
   * ID number box
   */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);

  doc.text("ID Number:", 30, 655);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.5);

  doc.rect(115, 625, 380, 55);

  drawFooter();

  /*
   * ---------------------------------------------------------
   * PAGE 3
   * CORPORATE INFORMATION
   * ---------------------------------------------------------
   */

  doc.addPage();

  drawHeader();

  sectionTitle(
    "CORPORATE INFORMATION",
    145,
    "Fill only if applying as a Company",
  );

  const corporate = applicant.corporateInfo;

  fieldLine("BUSINESS NAME:", corporate?.businessName ?? "", 18, 205, 125, 565);

  fieldLine("RC NUMBER:", corporate?.rcNumber ?? "", 18, 255, 105, 565);

  fieldLine(
    "COMPANY ADDRESS:",
    corporate?.companyAddress ?? "",
    18,
    305,
    130,
    565,
  );

  doc.line(18, 350, 565, 350);

  fieldLine(
    "NATURE OF BUSINESS:",
    corporate?.natureOfBusiness ?? "",
    18,
    395,
    150,
    565,
  );

  fieldLine(
    "COMPANY PHONE NUMBER:",
    corporate?.companyPhone ?? "",
    18,
    445,
    160,
    565,
  );

  fieldLine("COMPANY EMAIL:", corporate?.companyEmail ?? "", 18, 495, 130, 565);

  sectionTitle("HOW DID YOU HEAR ABOUT US?", 550, "TICK APPROPRIATELY");

  const referral = applicant.referralSource;

  checkbox(85, 610, "Marketer", referral === "Marketer");

  checkbox(270, 610, "Social Media", referral === "Social Media");

  checkbox(465, 610, "Referral", referral === "Referral");

  checkbox(85, 665, "Website", referral === "Website");

  checkbox(270, 665, "Staff", referral === "Staff");

  checkbox(465, 665, "Advertisement", referral === "Advertisement");

  checkbox(85, 720, "Others", referral === "Others");

  fieldLine(
    "Please Specify:",
    applicant.referralOther ?? "",
    180,
    720,
    270,
    565,
  );

  drawFooter();

  /*
   * ---------------------------------------------------------
   * PAGE 4
   * PROPERTY INFORMATION
   * ---------------------------------------------------------
   */

  doc.addPage();

  drawHeader();

  sectionTitle("PROPERTY INFORMATION", 145);

  fieldLine("ESTATE NAME:", estateName, 18, 200, 115, 565);

  fieldLine("ESTATE LOCATION:", "Kuje, Abuja", 18, 250, 130, 565);

  fieldLine("PROPERTY SIZE:", `${property.plotSizeSqm}`, 18, 300, 120, 300);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);

  doc.text("sqm", 305, 300);

  /*
   * Payment option
   */
  doc.text("PAYMENT OPTION:", 18, 350);

  checkbox(
    40,
    390,
    "Outright Payment",
    property.paymentOption?.toLowerCase().includes("outright"),
  );

  checkbox(
    280,
    390,
    "6 Months Payment Plan",
    property.paymentOption?.toLowerCase().includes("6"),
  );

  /*
   * Adashe payment plans
   */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BLACK);

  doc.text("Adashe Payment Plans (Tick One)", pageWidth / 2, 445, {
    align: "center",
  });

  const paymentOption = property.paymentOption?.toLowerCase() ?? "";

  checkbox(55, 485, "8 Months", paymentOption.includes("8"));

  checkbox(195, 485, "12 Months", paymentOption.includes("12"));

  checkbox(335, 485, "18 Months", paymentOption.includes("18"));

  checkbox(475, 485, "24 Months", paymentOption.includes("24"));

  /*
   * Purpose of acquisition
   */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);

  doc.text("PURPOSE OF ACQUISITION:", 18, 545);

  const purpose = property.acquisitionPurpose?.toLowerCase() ?? "";

  checkbox(55, 595, "Investment", purpose.includes("investment"));

  checkbox(260, 595, "Residential", purpose.includes("residential"));

  checkbox(465, 595, "Commercial", purpose.includes("commercial"));

  /*
   * Declaration
   */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...RED);

  doc.text("DECLARATION", pageWidth / 2, 655, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(...RED);

  const declaration =
    "I/We hereby declare that the information provided is true and correct.";

  const wrappedDeclaration = doc.splitTextToSize(declaration, pageWidth - 70);

  doc.text(wrappedDeclaration, pageWidth / 2, 700, {
    align: "center",
  });

  /*
   * Name
   */
  fieldLine("Name:", fullName, 18, 760, 65, 565);

  /*
   * Signature + Date
   */
  fieldLine("Signature:", "", 18, 805, 75, 300);

  fieldLine("Date:", "", 320, 805, 365, 565);

  drawFooter();

  /*
   * ---------------------------------------------------------
   * SAVE
   * ---------------------------------------------------------
   */

  doc.save(`${application.applicationNumber ?? "land-application"}.pdf`);
}
