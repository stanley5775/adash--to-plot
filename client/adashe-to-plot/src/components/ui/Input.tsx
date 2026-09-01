import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className = "", ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20 ${className}`}
        {...rest}
      />
    </div>
  );
}
