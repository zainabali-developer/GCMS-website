import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}

export default function Table<T>({ columns, rows, rowKey }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-4 py-3 font-semibold ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-ink-50/60">
              {columns.map((col, i) => (
                <td key={i} className={`px-4 py-3 align-middle text-ink-700 ${col.className ?? ''}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
