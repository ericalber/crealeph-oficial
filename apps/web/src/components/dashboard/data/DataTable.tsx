import type { ReactNode } from "react";

type Column = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
};

type DataTableProps = {
  columns: Column[];
  rows: Record<string, ReactNode | string | number | Date>[];
};

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface)] shadow-[var(--shadow-sm)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead
            className="bg-[var(--surface-muted)] text-[var(--muted)]"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                  style={{ textAlign: col.align ?? "left" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t transition hover:bg-[var(--surface-muted)]"
                style={{ borderColor: "var(--line)" }}
              >
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  const displayValue =
                    cellValue instanceof Date ? cellValue.toLocaleDateString() : cellValue;
                  return (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-[var(--ink)]"
                      style={{ textAlign: col.align ?? "left" }}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
