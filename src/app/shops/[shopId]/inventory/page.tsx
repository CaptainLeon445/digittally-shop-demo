'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Package, Search, Pencil, Trash2, X, Image as ImageIcon,
  CheckCircle, AlertCircle,
} from 'lucide-react';
import { productsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { Product, ProductVariant, VariantOption } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

// ── Product Form ─────────────────────────────────────────────────
function ProductForm({
  shopId,
  initial,
  onClose,
}: {
  shopId: string;
  initial?: Product;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<Product>>(
    initial ?? {
      title: '', description: '', images: [], price: 0, comparePrice: undefined,
      unit: 'piece', sku: '', stock: 0, status: 'draft', variants: [], category: '',
    }
  );
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = () => {
    if (!imageUrl.trim()) return;
    set('images', [...(form.images ?? []), imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (idx: number) => set('images', (form.images ?? []).filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!form.title?.trim()) { setError('Product title is required'); return; }
    if (!form.price || form.price <= 0) { setError('Price must be greater than 0'); return; }
    setSaving(true);
    setError(null);
    try {
      if (initial) {
        await productsStore.update(initial.id, form);
      } else {
        await productsStore.create(shopId, form);
      }
      queryClient.invalidateQueries({ queryKey: ['products', shopId] });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save product');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      {/* Basic info */}
      <div className="space-y-3">
        <Input label="Product Title *" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Ankara Wrap Dress" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Category" value={form.category ?? ''} onChange={(e) => set('category', e.target.value)} placeholder="Dresses" />
          <Input label="SKU / Code" value={form.sku ?? ''} onChange={(e) => set('sku', e.target.value)} placeholder="FH-001" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            placeholder="Describe this product..."
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price *" type="number" min="0" value={form.price ?? ''} onChange={(e) => set('price', parseFloat(e.target.value) || 0)} placeholder="18500" />
        <Input label="Compare-at Price" type="number" min="0" value={form.comparePrice ?? ''} onChange={(e) => set('comparePrice', parseFloat(e.target.value) || undefined)} placeholder="22000" />
        <Input label="Stock Qty *" type="number" min="0" value={form.stock ?? ''} onChange={(e) => set('stock', parseInt(e.target.value) || 0)} placeholder="25" />
        <Input label="Unit" value={form.unit ?? ''} onChange={(e) => set('unit', e.target.value)} placeholder="piece / set / kg" />
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
        <div className="flex gap-2">
          {(['active', 'draft', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => set('status', s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${form.status === s ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Product Images</label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            className="flex-1 rounded-xl border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <Button variant="secondary" size="sm" onClick={addImage} type="button">Add</Button>
        </div>
        {(form.images ?? []).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {(form.images ?? []).map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-primary-100" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" size="md" onClick={handleSave} loading={saving} className="flex-1">
          {initial ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </div>
  );
}

// ── Main Inventory Page ──────────────────────────────────────────
export default function InventoryPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', shopId],
    queryFn: () => productsStore.list(shopId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsStore.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', shopId] });
      setDeleteId(null);
    },
  });

  const filtered = (products ?? []).filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, 'green' | 'gray' | 'red'> = {
    active: 'green', draft: 'gray', archived: 'red',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500">{products?.length ?? 0} products</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-primary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">No products yet</p>
          <p className="text-sm text-gray-400 mb-5">Add your first product to start selling</p>
          <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Product
          </Button>
        </div>
      )}

      {/* Products grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden group">
              {/* Image */}
              <div className="relative h-36 bg-gray-50">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-gray-200" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditProduct(product)}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {product.comparePrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    SALE
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{product.title}</p>
                  <Badge color={statusColors[product.status] ?? 'gray'} className="flex-shrink-0">{product.status}</Badge>
                </div>
                {product.category && <p className="text-[10px] text-gray-400 mb-2">{product.category}</p>}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price, product.currency)}</span>
                    {product.comparePrice && (
                      <span className="text-xs text-gray-400 line-through ml-1.5">{formatCurrency(product.comparePrice, product.currency)}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{product.stock} {product.unit ?? 'units'}</span>
                </div>
                {product.variants.length > 0 && (
                  <p className="text-[10px] text-primary mt-1.5">{product.variants.length} variant{product.variants.length > 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Product">
        <ProductForm shopId={shopId} onClose={() => setShowAdd(false)} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Product">
        {editProduct && <ProductForm shopId={shopId} initial={editProduct} onClose={() => setEditProduct(null)} />}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to delete this product? This cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 !bg-red-500 hover:!bg-red-600"
              loading={deleteMutation.isPending}
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
