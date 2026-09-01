import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export function Select({ label, id, options, className = "", ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20 ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
