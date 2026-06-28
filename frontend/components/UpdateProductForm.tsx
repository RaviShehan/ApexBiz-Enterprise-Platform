'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { apiRequest } from '../lib/api';

type UpdateProductFormProps = {
  token: string;
  products: any[];
  onSuccess: () => Promise<void>;
};

export function UpdateProductForm({
  token,
  products,
  onSuccess,
}: UpdateProductFormProps) {
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const selectedProduct = products.find((product) => product.id === productId);

  const [name, setName] = useState('');
  const [sellingPriceCents, setSellingPriceCents] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(0);
  const [status, setStatus] = useState('ACTIVE');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setName(selectedProduct.name ?? '');
    setSellingPriceCents(selectedProduct.sellingPriceCents ?? 0);
    setStockQuantity(selectedProduct.stockQuantity ?? 0);
    setReorderLevel(selectedProduct.reorderLevel ?? 0);
    setStatus(selectedProduct.status ?? 'ACTIVE');
  }, [selectedProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (!productId) {
      setError('Please select a product');
      setSaving(false);
      return;
    }

    if (!name.trim()) {
      setError('Product name cannot be empty');
      setSaving(false);
      return;
    }

    if (Number(sellingPriceCents) <= 0) {
      setError('Selling price must be greater than 0');
      setSaving(false);
      return;
    }

    if (Number(stockQuantity) < 0 || Number(reorderLevel) < 0) {
      setError('Stock and reorder level cannot be negative');
      setSaving(false);
      return;
    }

    try {
      await apiRequest(
        `/products/${productId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            name,
            sellingPriceCents: Number(sellingPriceCents),
            stockQuantity: Number(stockQuantity),
            reorderLevel: Number(reorderLevel),
            status,
          }),
        },
        token,
      );

      setMessage('Product updated successfully');
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="mb-4 text-lg font-bold text-white">Update Product</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Select Product</span>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.sku}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Product Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Selling Price Cents</span>
          <input
            type="number"
            value={sellingPriceCents}
            onChange={(event) => setSellingPriceCents(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Stock Quantity</span>
          <input
            type="number"
            value={stockQuantity}
            onChange={(event) => setStockQuantity(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Reorder Level</span>
          <input
            type="number"
            value={reorderLevel}
            onChange={(event) => setReorderLevel(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || products.length === 0}
        className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
      >
        {saving ? 'Updating...' : 'Update Product'}
      </button>

      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
