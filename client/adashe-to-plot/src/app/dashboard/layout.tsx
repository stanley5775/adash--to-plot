import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-navy-50 py-10 sm:py-12">
      <div className="container-page flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 space-y-8">{children}</div>
      </div>
    </div>
  );
}
