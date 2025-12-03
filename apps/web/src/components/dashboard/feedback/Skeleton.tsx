type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-muted)] ${className ?? ""}`}
      style={{ minHeight: "12px" }}
      aria-hidden
    />
  );
}
