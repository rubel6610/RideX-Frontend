import { GenericSkeleton } from "./GenericSkeleton";

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="max-w-6xl mx-auto bg-background rounded-2xl shadow-lg border border-border/20 animate-pulse overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-border/20 bg-background">
        <GenericSkeleton width="10rem" height="1.75rem" />
        <GenericSkeleton width="6rem" height="2.25rem" />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted/50">
            <tr>
              {[...Array(cols)].map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <GenericSkeleton width="6rem" height="1.25rem" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, r) => (
              <tr key={r} className="border-t border-border/10">
                {[...Array(cols)].map((_, c) => (
                  <td key={c} className="px-4 py-3">
                    <GenericSkeleton width="100%" height="1.25rem" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 py-4 border-t border-border/20">
        <GenericSkeleton width="7rem" height="2.25rem" />
        <GenericSkeleton width="7rem" height="2.25rem" />
      </div>
    </div>
  );
}
