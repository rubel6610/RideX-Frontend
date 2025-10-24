import { Skeleton } from "@/components/ui/skeleton";

export function GenericSkeleton({
  shape = "rect",
  width = "100%",
  height = "20px",
  count = 1,
  className = "",
}) {
  const shapeClass =
    shape === "circle" ? "rounded-full" : "rounded-md";

  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          className={`${shapeClass}`}
          style={{
            width,
            height,
          }}
        />
      ))}
    </div>
  );
}
