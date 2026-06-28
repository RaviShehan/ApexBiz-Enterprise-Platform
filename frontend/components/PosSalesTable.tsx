import { EmptyState } from './EmptyState';
import { formatMoney } from '../lib/format';

type PosSalesTableProps = {
  sales: any[];
};

function PaymentMethodBadge({ method }: { method: string }) {
  const normalizedMethod = method?.toUpperCase();

  const className =
    normalizedMethod === 'CASH'
      ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30'
      : normalizedMethod === 'CARD'
        ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
        : normalizedMethod === 'WALLET'
          ? 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/30'
          : 'bg-slate-500/10 text-slate-300 ring-1 ring-slate-500/30';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {normalizedMethod || 'UNKNOWN'}
    </span>
  );
}

export function PosSalesTable({ sales }: PosSalesTableProps) {
  if (!sales || sales.length === 0) {
    return (
      <EmptyState
        title="No POS sales found"
        message="Create your first POS sale to see sales records here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-3">Sale Number</th>
            <th className="pb-3">Payment</th>
            <th className="pb-3">Items</th>
            <th className="pb-3">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td className="py-3 font-medium text-white">{sale.saleNumber}</td>
              <td className="py-3">
                <PaymentMethodBadge method={sale.paymentMethod} />
              </td>
              <td className="py-3 text-slate-300">{sale.items?.length ?? 0}</td>
              <td className="py-3 font-bold text-cyan-300">
                {formatMoney(sale.totalAmountCents ?? sale.totalCents ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
