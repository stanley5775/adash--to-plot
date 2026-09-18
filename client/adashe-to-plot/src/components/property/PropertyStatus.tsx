import { Badge, statusToTone } from "@/components/ui/Badge";
import type { PropertyStatus as Status } from "@/types/property";

export function PropertyStatus({ status }: { status: Status }) {
  const label =
    status === "NON_ACTIVE"
      ? "Not Available"
      : status === "SOLD_OUT"
        ? "Sold Out"
        : "Active";

  return <Badge tone={statusToTone(status)}>{label}</Badge>;
}
