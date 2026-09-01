import Image from "next/image";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSessionBar } from "@/components/admin/AdminSessionBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-navy-50">
      <div className="container-page flex flex-col gap-8 py-10 sm:py-12 lg:flex-row">
        <div className="rounded-2xl bg-navy-950 p-4 lg:sticky lg:top-24 lg:h-fit lg:w-64 lg:shrink-0">
          <Link href="/admin" className="mb-4 flex items-center gap-2 px-2 py-2">
            <Image src="/images/logo.png" alt="Adashè-to-Plot" width={140} height={36} className="h-8 w-auto brightness-0 invert" />
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-100/60">Staff</span>
          </Link>
          <AdminSessionBar />
          <AdminSidebar />
        </div>
        <div className="min-w-0 flex-1 space-y-8">{children}</div>
      </div>
    </div>
  );
}
