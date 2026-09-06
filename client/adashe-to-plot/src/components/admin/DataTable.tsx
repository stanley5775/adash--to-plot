import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  actions?: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows, actions }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-800/10 bg-navy-50">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`whitespace-nowrap px-5 py-3.5 font-semibold text-ink-700 ${
                    col.className ?? ""
                  }`}>
                  {col.header}
                </th>
              ))}

              {actions && (
                <th className="px-5 py-3.5 font-semibold text-ink-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-navy-800/5 last:border-0 hover:bg-navy-50/60">
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={`whitespace-nowrap px-5 py-4 text-ink-700 ${
                      col.className ?? ""
                    }`}>
                    {col.render(row)}
                  </td>
                ))}

                {actions && (
                  <td className="whitespace-nowrap px-5 py-4">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-ink-500">
          No records to display.
        </p>
      )}
    </div>
  );
}
