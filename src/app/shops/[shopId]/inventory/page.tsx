'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Package, Search, Pencil, Trash2, X, Image as ImageIcon,
  CheckCircle, AlertCircle, Clock, Users, MapPin, Video,
  Calendar, Wifi, Star,
} from 'lucide-react';
import { productsStore, shopsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { Product, Shop, ShopType, MeetingType } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

// ── Type Config ──────────────────────────────────────────────────
interface InventoryConfig {
  itemLabel: string;
  pluralLabel: string;
  addLabel: string;
  emptyMessage: string;
  searchPlaceholder: string;
  showImages: boolean;
  showStock: boolean;
  showSku: boolean;
  stockLabel: string;
  unitPlaceholder: string;
  priceLabel: string;
  showDuration: boolean;
  showMeetingType: boolean;
  showCapacity: boolean;
  showAmenities: boolean;
  showServiceArea: boolean;
  categoryPlaceholder: string;
}

const INVENTORY_CONFIG: Record<ShopType, InventoryConfig> = {
  online_vendor: {
    itemLabel: 'Product', pluralLabel: 'Products', addLabel: 'Add Product',
    emptyMessage: 'Add your first product to start selling.',
    searchPlaceholder: 'Search products...',
    showImages: true, showStock: true, showSku: true,
    stockLabel: 'Stock Qty', unitPlaceholder: 'piece / set / kg',
    priceLabel: 'Price', showDuration: false, showMeetingType: false,
    showCapacity: false, showAmenities: false, showServiceArea: false,
    categoryPlaceholder: 'Dresses / Accessories / Sets',
  },
  consultation: {
    itemLabel: 'Service', pluralLabel: 'Services', addLabel: 'Add Service',
    emptyMessage: 'Add your consultation services.',
    searchPlaceholder: 'Search services...',
    showImages: false, showStock: false, showSku: false,
    stockLabel: 'Max Bookings', unitPlaceholder: 'session',
    priceLabel: 'Price per Session', showDuration: true, showMeetingType: true,
    showCapacity: false, showAmenities: false, showServiceArea: false,
    categoryPlaceholder: 'Legal / Medical / Financial',
  },
  hospitality: {
    itemLabel: 'Room / Space', pluralLabel: 'Rooms & Spaces', addLabel: 'Add Room',
    emptyMessage: 'Add your rooms and spaces.',
    searchPlaceholder: 'Search rooms...',
    showImages: true, showStock: true, showSku: false,
    stockLabel: 'Available Rooms', unitPlaceholder: 'night',
    priceLabel: 'Price per Night', showDuration: false, showMeetingType: false,
    showCapacity: true, showAmenities: true, showServiceArea: false,
    categoryPlaceholder: 'Standard / Deluxe / Suite',
  },
  service: {
    itemLabel: 'Service', pluralLabel: 'Services', addLabel: 'Add Service',
    emptyMessage: 'Add your services to start taking bookings.',
    searchPlaceholder: 'Search services...',
    showImages: false, showStock: false, showSku: false,
    stockLabel: 'Daily Capacity', unitPlaceholder: 'session / hour / visit',
    priceLabel: 'Price', showDuration: true, showMeetingType: false,
    showCapacity: false, showAmenities: false, showServiceArea: true,
    categoryPlaceholder: 'Cleaning / Plumbing / Repairs',
  },
};

const RESTAURANT_INVENTORY_CONFIG: InventoryConfig = {
  itemLabel: 'Menu Item', pluralLabel: 'Menu', addLabel: 'Add Menu Item',
  emptyMessage: 'Add your food and drink items to start taking orders.',
  searchPlaceholder: 'Search menu items...',
  showImages: true, showStock: false, showSku: false,
  stockLabel: 'Daily Quantity', unitPlaceholder: 'serving / plate / glass',
  priceLabel: 'Price', showDuration: false, showMeetingType: false,
  showCapacity: false, showAmenities: false, showServiceArea: false,
  categoryPlaceholder: 'Starters / Mains / Grills / Drinks / Desserts',
};

const MEETING_TYPE_OPTIONS: { value: MeetingType; label: string }[] = [
  { value: 'virtual', label: 'Virtual Only' },
  { value: 'in_person', label: 'In Person Only' },
  { value: 'both', label: 'Virtual & In Person' },
];

const COMMON_AMENITIES = [
  'Free WiFi', 'Air Conditioning', 'Smart TV', 'En-suite Bathroom', 'Mini Fridge',
  'Full Kitchen', 'Living Area', 'King Bed', 'Balcony', 'Washing Machine',
  'Swimming Pool', 'Gym', 'Parking', '24hr Security',
];

const DURATION_PRESETS = [
  { label: '30 min', value: 30 }, { label: '1 hr', value: 60 },
  { label: '2 hrs', value: 120 }, { label: '3 hrs', value: 180 },
  { label: '4 hrs', value: 240 }, { label: '1 day', value: 480 },
];

// ── Product Form ─────────────────────────────────────────────────
function InventoryForm({ shopId, shopType, configOverride, initial, onClose }: {
  shopId: string; shopType: ShopType; configOverride?: InventoryConfig; initial?: Product; onClose: () => void;
}) {
  const config = configOverride ?? INVENTORY_CONFIG[shopType];
  const queryClient = useQueryClient();

  const defaultProduct: Partial<Product> = shopType === 'online_vendor'
    ? { title: '', description: '', images: [], price: 0, unit: 'piece', sku: '', stock: 0, status: 'draft', variants: [], category: '' }
    : shopType === 'consultation'
    ? { title: '', description: '', images: [], price: 0, unit: 'session', stock: 999, status: 'draft', variants: [], category: '', duration: 60, meetingType: 'both' }
    : shopType === 'hospitality'
    ? { title: '', description: '', images: [], price: 0, unit: 'night', stock: 1, status: 'draft', variants: [], category: 'Standard', capacity: 2, amenities: [] }
    : { title: '', description: '', images: [], price: 0, unit: 'session', stock: 999, status: 'draft', variants: [], category: '', duration: 60, serviceArea: '' };

  const [form, setForm] = useState<Partial<Product>>(initial ?? defaultProduct);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = () => {
    if (!imageUrl.trim()) return;
    set('images', [...(form.images ?? []), imageUrl.trim()]);
    setImageUrl('');
  };

  const toggleAmenity = (amenity: string) => {
    const current = form.amenities ?? [];
    set('amenities', current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { setError(`${config.itemLabel} name is required`); return; }
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
      setError(err?.message ?? 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
      {/* Basic info */}
      <div className="space-y-3">
        <Input label={`${config.itemLabel} Name *`} value={form.title ?? ''} onChange={(e) => set('title', e.target.value)}
          placeholder={shopType === 'online_vendor' ? 'Ankara Wrap Dress' : shopType === 'hospitality' ? 'Executive Suite' : 'Service name'} />
        <Input label="Category" value={form.category ?? ''} onChange={(e) => set('category', e.target.value)}
          placeholder={config.categoryPlaceholder} />
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)}
            className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            placeholder={shopType === 'online_vendor' ? 'Describe this product...' : shopType === 'consultation' ? 'What this service covers...' : 'Describe what\'s included...'} />
        </div>
      </div>

      {/* Duration (consultation / service) */}
      {config.showDuration && (
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5" />Duration
          </label>
          <div className="flex gap-2 flex-wrap mb-2">
            {DURATION_PRESETS.map(({ label, value }) => (
              <button key={value} type="button" onClick={() => set('duration', value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.duration === value ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="number" min="15" step="15" className="w-24 rounded-xl border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.duration ?? 60} onChange={(e) => set('duration', parseInt(e.target.value) || 60)} />
            <span className="text-sm text-gray-500">minutes</span>
          </div>
        </div>
      )}

      {/* Meeting Type (consultation) */}
      {config.showMeetingType && (
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
            <Video className="w-3.5 h-3.5" />Meeting Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {MEETING_TYPE_OPTIONS.map(({ value, label }) => (
              <button key={value} type="button" onClick={() => set('meetingType', value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.meetingType === value ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                {label}
              </button>
            ))}
          </div>
          {(form.meetingType === 'virtual' || form.meetingType === 'both') && (
            <div className="mt-3">
              <Input label="Meeting Link (optional override)" value={form.meetingLink ?? ''}
                onChange={(e) => set('meetingLink', e.target.value)}
                placeholder="https://calendly.com/your-name/service or Zoom link" />
            </div>
          )}
        </div>
      )}

      {/* Service Area (service shops) */}
      {config.showServiceArea && (
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5" />Service Area
          </label>
          <input className="w-full rounded-xl border border-primary-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="e.g. Lekki, VI, Ikoyi" value={form.serviceArea ?? ''} onChange={(e) => set('serviceArea', e.target.value)} />
        </div>
      )}

      {/* Capacity (hospitality) */}
      {config.showCapacity && (
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5" />Max Guests (capacity)
          </label>
          <input type="number" min="1" className="w-32 rounded-xl border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={form.capacity ?? 2} onChange={(e) => set('capacity', parseInt(e.target.value) || 1)} />
        </div>
      )}

      {/* Amenities (hospitality) */}
      {config.showAmenities && (
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
            <Wifi className="w-3.5 h-3.5" />Room Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_AMENITIES.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${(form.amenities ?? []).includes(a) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pricing & Stock */}
      <div className="grid grid-cols-2 gap-3">
        <Input label={`${config.priceLabel} *`} type="number" min="0"
          value={form.price ?? ''} onChange={(e) => set('price', parseFloat(e.target.value) || 0)} placeholder="25000" />
        {shopType === 'online_vendor' && (
          <Input label="Compare-at Price" type="number" min="0"
            value={form.comparePrice ?? ''} onChange={(e) => set('comparePrice', parseFloat(e.target.value) || undefined)} placeholder="30000" />
        )}
        {config.showStock && (
          <Input label={config.stockLabel} type="number" min="0"
            value={form.stock ?? ''} onChange={(e) => set('stock', parseInt(e.target.value) || 0)} placeholder="5" />
        )}
        <Input label="Unit" value={form.unit ?? ''} onChange={(e) => set('unit', e.target.value)} placeholder={config.unitPlaceholder} />
        {config.showSku && (
          <Input label="SKU / Code" value={form.sku ?? ''} onChange={(e) => set('sku', e.target.value)} placeholder="FH-001" />
        )}
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
        <div className="flex gap-2">
          {(['active', 'draft', 'archived'] as const).map((s) => (
            <button key={s} type="button" onClick={() => set('status', s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${form.status === s ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      {config.showImages && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Images</label>
          <div className="flex gap-2 mb-2">
            <input type="url" className="flex-1 rounded-xl border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="https://example.com/image.jpg" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())} />
            <Button variant="secondary" size="sm" onClick={addImage} type="button">Add</Button>
          </div>
          {(form.images ?? []).length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {(form.images ?? []).map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-primary-100" />
                  <button onClick={() => set('images', (form.images ?? []).filter((_, i) => i !== idx))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" size="md" onClick={handleSave} loading={saving} className="flex-1">
          {initial ? 'Save Changes' : `Add ${config.itemLabel}`}
        </Button>
      </div>
    </div>
  );
}

// ── Item Card ────────────────────────────────────────────────────
function InventoryCard({ product, shopType, configOverride, onEdit, onDelete }: {
  product: Product; shopType: ShopType; configOverride?: InventoryConfig; onEdit: () => void; onDelete: () => void;
}) {
  const config = configOverride ?? INVENTORY_CONFIG[shopType];
  const statusColors: Record<string, 'green' | 'gray' | 'red'> = { active: 'green', draft: 'gray', archived: 'red' };

  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-card overflow-hidden group">
      {/* Image or icon */}
      {config.showImages ? (
        <div className="relative h-36 bg-gray-50">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-gray-200" />
            </div>
          )}
          {product.comparePrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</div>
          )}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-16 bg-primary/5 flex items-center px-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
            {shopType === 'consultation' ? <Calendar className="w-4 h-4 text-primary" /> : <Star className="w-4 h-4 text-primary" />}
          </div>
          <Badge color={statusColors[product.status] ?? 'gray'} className="flex-shrink-0">{product.status}</Badge>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{product.title}</p>
          {config.showImages && <Badge color={statusColors[product.status] ?? 'gray'} className="flex-shrink-0">{product.status}</Badge>}
        </div>
        {product.category && <p className="text-[10px] text-gray-400 mb-2">{product.category}</p>}

        {/* Type-specific meta */}
        {product.duration && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1.5">
            <Clock className="w-3 h-3" />{product.duration >= 60 ? `${product.duration / 60}h` : `${product.duration}m`} session
            {product.meetingType && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary capitalize">{product.meetingType.replace('_', ' ')}</span>
            )}
          </div>
        )}
        {product.capacity && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1.5">
            <Users className="w-3 h-3" />Up to {product.capacity} guests
          </div>
        )}
        {product.serviceArea && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1.5">
            <MapPin className="w-3 h-3" />{product.serviceArea}
          </div>
        )}
        {product.amenities && product.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{a}</span>
            ))}
            {product.amenities.length > 3 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">+{product.amenities.length - 3}</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price, product.currency)}</span>
            {product.unit && <span className="text-[10px] text-gray-400 ml-1">/{product.unit}</span>}
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatCurrency(product.comparePrice, product.currency)}</span>
            )}
          </div>
          {config.showStock && (
            <span className="text-xs text-gray-500">{product.stock} avail.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function InventoryPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: shop, isLoading: shopLoading } = useQuery<Shop>({
    queryKey: ['shop', shopId],
    queryFn: () => shopsStore.get(shopId),
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['products', shopId],
    queryFn: () => productsStore.list(shopId),
    enabled: !!shop,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsStore.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', shopId] });
      setDeleteId(null);
    },
  });

  const isLoading = shopLoading || productsLoading;

  if (isLoading && !shop) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  const shopType: ShopType = shop?.type ?? 'online_vendor';
  const isRestaurant = shopType === 'hospitality' && !!shop?.restaurantMode;
  const config = isRestaurant ? RESTAURANT_INVENTORY_CONFIG : INVENTORY_CONFIG[shopType];

  const filtered = (products ?? []).filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{config.pluralLabel}</h2>
          <p className="text-sm text-gray-500">{products?.length ?? 0} {(products?.length ?? 0) === 1 ? config.itemLabel : config.pluralLabel}</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          {config.addLabel}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-primary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          placeholder={config.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">No {config.pluralLabel.toLowerCase()} yet</p>
          <p className="text-sm text-gray-400 mb-5">{config.emptyMessage}</p>
          <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            {config.addLabel}
          </Button>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <InventoryCard
              key={product.id}
              product={product}
              shopType={shopType}
              configOverride={isRestaurant ? RESTAURANT_INVENTORY_CONFIG : undefined}
              onEdit={() => setEditProduct(product)}
              onDelete={() => setDeleteId(product.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={config.addLabel}>
        {shop && <InventoryForm shopId={shopId} shopType={shopType} configOverride={isRestaurant ? RESTAURANT_INVENTORY_CONFIG : undefined} onClose={() => setShowAdd(false)} />}
      </Modal>

      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title={`Edit ${config.itemLabel}`}>
        {editProduct && shop && (
          <InventoryForm shopId={shopId} shopType={shopType} configOverride={isRestaurant ? RESTAURANT_INVENTORY_CONFIG : undefined} initial={editProduct} onClose={() => setEditProduct(null)} />
        )}
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={`Delete ${config.itemLabel}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to delete this {config.itemLabel.toLowerCase()}? This cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button variant="primary" size="md" className="flex-1 !bg-red-500 hover:!bg-red-600"
              loading={deleteMutation.isPending} onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
