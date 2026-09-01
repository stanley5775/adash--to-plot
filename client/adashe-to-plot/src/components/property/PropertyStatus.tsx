import { Badge, statusToTone } from "@/components/ui/Badge";
import type { PropertyStatus as Status } from "@/types/property";

export function PropertyStatus({ status }: { status: Status }) {
  return <Badge tone={statusToTone(status)}>{status}</Badge>;
}
