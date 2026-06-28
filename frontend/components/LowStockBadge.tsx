type LowStockBadgeProps = {
  stockQuantity: number;
  reorderLevel: number;
};

export function LowStockBadge({ stockQuantity, reorderLevel }: LowStockBadgeProps) {
  const isLowStock = stockQuantity <= reorderLevel;

  if (isLowStock) {
    return (
      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30">
        LOW STOCK
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
      OK
    </span>
  );
}
