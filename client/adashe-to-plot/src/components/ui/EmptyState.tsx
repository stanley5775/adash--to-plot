import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-800/20 bg-white px-6 py-16 text-center">
      {icon && <div className="text-navy-600">{icon}</div>}
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      <p className="max-w-sm text-sm text-ink-500">{description}</p>
      {action}
    </div>
  );
}
