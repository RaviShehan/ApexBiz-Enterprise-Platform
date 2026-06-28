'use client';

import { useState, type FormEvent } from 'react';
import { apiRequest } from '../lib/api';

type CreatePosSaleFormProps = {
  token: string;
  businessId: string;
  branchId: string;
  cashierId: string;
  products: any[];
  onSuccess: () => Promise<void>;
};

export function CreatePosSaleForm({
  token,
  businessId,
  branchId,
  cashierId,
  products,
  onSuccess,
}: CreatePosSaleFormProps) {
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedProduct = products.find((product) => product.id === productId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (!selectedProduct) {
      setError('Please select a product');
      setSaving(false);
      return;
    }

    if (selectedProduct.status !== 'ACTIVE') {
      setError('This product is inactive and cannot be sold');
      setSaving(false);
      return;
    }

    if (Number(quantity) <= 0) {
      setError('Quantity must be greater than 0');
      setSaving(false);
      return;
    }

    if (Number(quantity) > selectedProduct.stockQuantity) {
      setError(`Only ${selectedProduct.stockQuantity} items available in stock`);
      setSaving(false);
      return;
    }

    try {
      await apiRequest(
        '/pos-sales',
        {
          method: 'POST',
          body: JSON.stringify({
            saleNumber: `POS-FRONTEND-${Date.now()}`,
            businessId,
            branchId,
            cashierId,
            paymentMethod,
            discountCents: 0,
            taxCents: 0,
            items: [
              {
                productId,
                quantity: Number(quantity),
              },
            ],
          }),
        },
        token,
      );

      setMessage('POS sale created successfully');
      await onSuccess();
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create POS sale');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="mb-4 text-lg font-bold text-white">Create POS Sale</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Product</span>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - Stock {product.stockQuantity} - {product.status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Quantity</span>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Payment Method</span>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="WALLET">WALLET</option>
          </select>
        </label>
      </div>

      {selectedProduct && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
          <p>Selected product: {selectedProduct.name}</p>
          <p>Available stock: {selectedProduct.stockQuantity}</p>
          <p>Status: {selectedProduct.status}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving || !productId}
        className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
      >
        {saving ? 'Creating sale...' : 'Create POS Sale'}
      </button>

      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
