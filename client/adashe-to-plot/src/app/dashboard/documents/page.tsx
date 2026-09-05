import {redirect} from "next/navigation";
import { Download, FileText } from "lucide-react";
import { getCurrentCustomer } from "@/services/customer.service";
import { getSaleByCustomerId } from "@/services/sale.service";
import { getDocumentsByPropertyId } from "@/services/document.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/payment";

export default async function DashboardDocumentsPage() {
  const customer = await getCurrentCustomer();
  
  if (!customer) {
    redirect("/login?redirect=/dashboard/documents");
  }

  const sale = await getSaleByCustomerId(customer.id);
  const docs = sale ? await getDocumentsByPropertyId(sale.propertyId) : [];

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title="Documents" subtitle="Every document tied to your property, in one place." />

      {docs.length === 0 ? (
        <EmptyState title="No documents yet" description="Documents will appear here as your purchase progresses." icon={<FileText className="h-8 w-8" />} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-2xl border border-navy-800/10 bg-white p-5">
              <div>
                <p className="font-semibold text-navy-950">{doc.name}</p>
                <p className="mt-1 text-xs text-ink-500">{doc.dateIssued ? `Issued ${formatDate(doc.dateIssued)}` : "Not yet issued"}</p>
                <Badge tone={statusToTone(doc.status)}>{doc.status}</Badge>
              </div>
              <button
                disabled={doc.status !== "Available"}
                className="flex items-center gap-1.5 rounded-full border border-navy-800/15 px-4 py-2 text-xs font-semibold text-navy-900 hover:border-navy-800/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
