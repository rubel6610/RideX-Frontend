import { GenericSkeleton } from "./GenericSkeleton"

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm animate-pulse">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4">
        <GenericSkeleton width="70%" height="1.25rem" />
        <GenericSkeleton width="70%" height="1.25rem" />
        <GenericSkeleton width="50%" height="1.25rem" />
        <GenericSkeleton width="60%" height="1.25rem" />
      </div>

      {/* Rows */}
      <div className="divide-y">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4">
            <GenericSkeleton width="80%" height="1rem" />
            <GenericSkeleton width="90%" height="1rem" />
            <GenericSkeleton width="50%" height="1rem" />
            <GenericSkeleton width="70%" height="1rem" />
          </div>
        ))}
      </div>
    </div>
  )
}
