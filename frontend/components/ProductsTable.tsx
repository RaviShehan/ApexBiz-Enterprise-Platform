import { EmptyState } from './EmptyState';
import { LowStockBadge } from './LowStockBadge';
import { StatusBadge } from './StatusBadge';
import { formatMoney } from '../lib/format';

type ProductsTableProps = {
  products: any[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Create your first product to start using inventory and POS sales."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-3">Product</th>
            <th className="pb-3">SKU</th>
            <th className="pb-3">Price</th>
            <th className="pb-3">Stock</th>
            <th className="pb-3">Reorder Level</th>
            <th className="pb-3">Stock Status</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-3 font-medium text-white">{product.name}</td>
              <td className="py-3 text-slate-300">{product.sku}</td>
              <td className="py-3 text-slate-300">
                {formatMoney(product.sellingPriceCents)}
              </td>
              <td className="py-3 text-slate-300">{product.stockQuantity}</td>
              <td className="py-3 text-slate-300">{product.reorderLevel}</td>
              <td className="py-3">
                <LowStockBadge
                  stockQuantity={product.stockQuantity}
                  reorderLevel={product.reorderLevel}
                />
              </td>
              <td className="py-3">
                <StatusBadge status={product.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
