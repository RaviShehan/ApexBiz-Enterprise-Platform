'use client';

import { useState, type FormEvent } from 'react';
import { apiRequest } from '../lib/api';

type InventoryActionFormProps = {
  token: string;
  businessId: string;
  branchId: string;
  createdById: string;
  products: any[];
  onSuccess: () => Promise<void>;
};

type ActionType = 'stock-in' | 'stock-out' | 'adjust';

export function InventoryActionForm({
  token,
  businessId,
  branchId,
  createdById,
  products,
  onSuccess,
}: InventoryActionFormProps) {
  const [actionType, setActionType] = useState<ActionType>('stock-in');
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(5);
  const [newStockQuantity, setNewStockQuantity] = useState(20);
  const [reason, setReason] = useState('Inventory update from dashboard');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const reference = `${actionType.toUpperCase()}-${Date.now()}`;

      let path = '/inventory/stock-in';
      let body: Record<string, unknown> = {
        reference,
        productId,
        businessId,
        branchId,
        createdById,
        quantity: Number(quantity),
        reason,
      };

      if (actionType === 'stock-out') {
        path = '/inventory/stock-out';
      }

      if (actionType === 'adjust') {
        path = '/inventory/adjust';
        body = {
          reference,
          productId,
          businessId,
          branchId,
          createdById,
          newStockQuantity: Number(newStockQuantity),
          reason,
        };
      }

      await apiRequest(
        path,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        token,
      );

      setMessage('Inventory updated successfully');
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inventory update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="mb-4 text-lg font-bold text-white">Inventory Action</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Action</span>
          <select
            value={actionType}
            onChange={(event) => setActionType(event.target.value as ActionType)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="stock-in">Stock In</option>
            <option value="stock-out">Stock Out</option>
            <option value="adjust">Adjust Stock</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Product</span>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - Stock {product.stockQuantity}
              </option>
            ))}
          </select>
        </label>

        {actionType !== 'adjust' && (
          <label className="block">
            <span className="mb-1 block text-sm text-slate-400">Quantity</span>
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </label>
        )}

        {actionType === 'adjust' && (
          <label className="block">
            <span className="mb-1 block text-sm text-slate-400">New Stock Quantity</span>
            <input
              type="number"
              value={newStockQuantity}
              onChange={(event) => setNewStockQuantity(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </label>
        )}

        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm text-slate-400">Reason</span>
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || !productId}
        className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
      >
        {saving ? 'Saving...' : 'Save Inventory Action'}
      </button>

      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
