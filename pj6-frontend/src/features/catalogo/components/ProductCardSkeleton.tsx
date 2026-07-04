export default function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3" aria-hidden="true">
      <div className="aspect-[4/5] rounded-[var(--radius-lg)] border border-line bg-primary/5" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded-[var(--radius-sm)] bg-primary/10" />
        <div className="h-3 w-1/2 rounded-[var(--radius-sm)] bg-primary/5" />
      </div>
    </div>
  )
}