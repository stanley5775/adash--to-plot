import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-32 text-center">
      <SearchX className="h-12 w-12 text-navy-500/40" />
      <h1 className="text-2xl font-bold text-navy-950">We couldn&apos;t find that page</h1>
      <p className="max-w-sm text-sm text-ink-500">
        The estate or property you&apos;re looking for may have been renamed, sold out, or moved.
      </p>
      <div className="flex gap-3">
        <Button href="/estates">Browse Estates</Button>
        <Link href="/" className="inline-flex items-center rounded-full border border-navy-800/15 px-5 py-3 text-sm font-semibold text-navy-900 hover:border-navy-800/40">
          Back Home
        </Link>
      </div>
    </div>
  );
}
