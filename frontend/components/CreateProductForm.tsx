'use client';

import { useState, type FormEvent } from 'react';
import { apiRequest } from '../lib/api';

type CreateProductFormProps = {
  token: string;
  businessId: string;
  onSuccess: () => Promise<void>;
};

export function CreateProductForm({
  token,
  businessId,
  onSuccess,
}: CreateProductFormProps) {
  const [name, setName] = useState('Sugar 1kg Pack');
  const [sku, setSku] = useState(`SUGAR-1KG-${Date.now()}`);
  const [barcode, setBarcode] = useState(`479${Date.now()}`);
  const [description, setDescription] = useState('Sugar 1kg packet');
  const [sellingPriceCents, setSellingPriceCents] = useState(45000);
  const [costPriceCents, setCostPriceCents] = useState(38000);
  const [stockQuantity, setStockQuantity] = useState(25);
  const [reorderLevel, setReorderLevel] = useState(10);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await apiRequest(
        '/products',
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            sku,
            barcode,
            description,
            sellingPriceCents: Number(sellingPriceCents),
            costPriceCents: Number(costPriceCents),
            stockQuantity: Number(stockQuantity),
            reorderLevel: Number(reorderLevel),
            businessId,
          }),
        },
        token,
      );

      setMessage('Product created successfully');
      await onSuccess();

      setName('New Product');
      setSku(`PRODUCT-${Date.now()}`);
      setBarcode(`479${Date.now()}`);
      setDescription('');
      setSellingPriceCents(100000);
      setCostPriceCents(80000);
      setStockQuantity(10);
      setReorderLevel(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="mb-4 text-lg font-bold text-white">Create Product</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">SKU</span>
          <input
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Barcode</span>
          <input
            value={barcode}
            onChange={(event) => setBarcode(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
          <span className="mb-1 block text-sm text-slate-400">Cost Price Cents</span>
          <input
            type="number"
            value={costPriceCents}
            onChange={(event) => setCostPriceCents(Number(event.target.value))}
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
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
      >
        {saving ? 'Creating...' : 'Create Product'}
      </button>

      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
