import { EmptyState } from './EmptyState';

type InventoryMovementsTableProps = {
  movements: any[];
};

function MovementTypeBadge({ type }: { type: string }) {
  const normalizedType = type?.toUpperCase();

  const className =
    normalizedType === 'STOCK_IN'
      ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30'
      : normalizedType === 'STOCK_OUT'
        ? 'bg-red-500/10 text-red-300 ring-1 ring-red-500/30'
        : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {normalizedType || 'UNKNOWN'}
    </span>
  );
}

export function InventoryMovementsTable({ movements }: InventoryMovementsTableProps) {
  if (!movements || movements.length === 0) {
    return (
      <EmptyState
        title="No inventory movements found"
        message="Stock in, stock out, and stock adjustment records will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-3">Type</th>
            <th className="pb-3">Product</th>
            <th className="pb-3">Quantity</th>
            <th className="pb-3">Reference</th>
            <th className="pb-3">Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td className="py-3">
                <MovementTypeBadge type={movement.type} />
              </td>
              <td className="py-3 font-medium text-white">
                {movement.product?.name || movement.productId}
              </td>
              <td className="py-3 text-slate-300">{movement.quantity}</td>
              <td className="py-3 text-slate-300">{movement.reference}</td>
              <td className="py-3 text-slate-300">{movement.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
