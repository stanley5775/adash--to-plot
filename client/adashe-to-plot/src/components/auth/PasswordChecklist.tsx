import { Check, X } from "lucide-react";
import { checkPassword } from "@/lib/validators";

export function PasswordChecklist({ password }: { password: string }) {
  const checks = checkPassword(password);
  return (
    <ul className="grid grid-cols-1 gap-1.5 rounded-xl bg-navy-50 px-4 py-3 sm:grid-cols-2">
      {checks.map((c) => (
        <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.passed ? "text-status-available" : "text-ink-400"}`}>
          {c.passed ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
          {c.label}
        </li>
      ))}
    </ul>
  );
}
