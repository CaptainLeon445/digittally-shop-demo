'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart, Plus, Minus, X, Phone, Mail, MapPin,
  Instagram, Twitter, Facebook, MessageCircle, Star,
  Calendar, Clock, CheckCircle, Loader2,
} from 'lucide-react';
import { shopsStore, productsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { Shop, Product } from '@/types';
import Spinner from '@/components/ui/Spinner';

interface CartItem { product: Product; variant?: string; quantity: number; }

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-200" />
          </div>
        )}
        {product.comparePrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm mb-0.5">{product.title}</p>
        {product.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">{formatCurrency(product.price, product.currency)}</span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatCurrency(product.comparePrice, product.currency)}</span>
            )}
          </div>
          <button
            onClick={onAdd}
            disabled={product.stock === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #0b7d8e, #052e36)' }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutModal({ shop, cart, onClose, onSuccess }: { shop: Shop; cart: CartItem[]; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const handlePlace = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPlacing(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">Order Placed!</h3>
        <p className="text-gray-500 text-sm mb-2">Thank you, {form.name.split(' ')[0]}. Your order is confirmed.</p>
        <p className="text-gray-400 text-xs mb-6">You&apos;ll receive a confirmation on WhatsApp/email shortly.</p>
        <button onClick={onSuccess} className="px-6 py-2.5 rounded-xl text-white font-semibold" style={{ background: `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="space-y-1.5">
        {cart.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span className="text-gray-700">{item.product.title} × {item.quantity}</span>
            <span className="font-semibold">{formatCurrency(item.product.price * item.quantity, item.product.currency)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>Total</span>
          <span>{formatCurrency(total, shop.currency)}</span>
        </div>
      </div>

      <hr className="border-gray-100" />
      <p className="font-semibold text-gray-900 text-sm">Your Details</p>
      {[
        { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Ngozi Eze' },
        { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'ngozi@email.com' },
        { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+234 801 234 5678' },
        { label: 'Delivery Address', key: 'address', type: 'text', placeholder: '12 Ring Road, Enugu' },
      ].map(({ label, key, type, placeholder }) => (
        <div key={key}>
          <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
          <input
            type={type}
            placeholder={placeholder}
            value={(form as any)[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': shop.theme.primaryColor } as any}
          />
        </div>
      ))}

      <button
        onClick={handlePlace}
        disabled={!form.name.trim() || !form.email.trim() || placing}
        className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
        style={{ background: `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` }}
      >
        {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {placing ? 'Processing...' : `Place Order · ${formatCurrency(total, shop.currency)}`}
      </button>
    </div>
  );
}

export default function StorefrontPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: shop, isLoading: shopLoading } = useQuery<Shop>({
    queryKey: ['storefront-shop', slug],
    queryFn: () => shopsStore.getBySlug(slug),
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['storefront-products', shop?.id],
    queryFn: () => productsStore.list(shop!.id),
    enabled: !!shop,
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (shopLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Spinner size="lg" />
    </div>
  );

  if (!shop) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900 mb-2">Shop not found</p>
        <p className="text-gray-400">The storefront you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    </div>
  );

  const addToCart = (product: Product) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === product.id);
      if (existing) return c.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...c, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty === 0) setCart((c) => c.filter((i) => i.product.id !== productId));
    else setCart((c) => c.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const categories = ['All', ...Array.from(new Set((products ?? []).map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = (products ?? []).filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat && p.status === 'active';
  });

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const isBooking = shop.type === 'consultation' || shop.type === 'hospitality';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: shop.theme.primaryColor }}>
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="font-bold text-gray-900 text-sm">{shop.name}</span>
          </div>
          {!isBooking && cartCount > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold relative"
              style={{ background: shop.theme.primaryColor }}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartCount})
              <span className="ml-1 font-bold">{formatCurrency(cartTotal, shop.currency)}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div
        className="relative h-56 sm:h-72"
        style={{
          backgroundImage: shop.bannerUrl ? `url(${shop.bannerUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          background: !shop.bannerUrl ? `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {shop.logoUrl && (
            <img src={shop.logoUrl} alt={shop.name} className="w-16 h-16 rounded-2xl object-cover border-3 border-white/50 mb-3 shadow-lg" />
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">{shop.theme.heroHeadline}</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-md">{shop.theme.heroSubtext}</p>
          {isBooking && (
            <button
              className="mt-5 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
              style={{ background: shop.theme.accentColor, color: '#1f2937' }}
            >
              <Calendar className="w-4 h-4" />
              {shop.theme.heroCtaText}
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search & categories */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {categories.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                  style={activeCategory === cat ? { background: shop.theme.primaryColor, color: '#fff' } : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products grid */}
        {productsLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        )}

        {/* Contact / Social */}
        {(shop.contactEmail || shop.contactPhone || shop.socialLinks) && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="font-bold text-gray-900 mb-4">Get In Touch</h3>
            <div className="flex flex-wrap gap-3">
              {shop.contactPhone && (
                <a href={`tel:${shop.contactPhone}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-sm hover:border-gray-200 transition-all">
                  <Phone className="w-4 h-4 text-gray-400" />{shop.contactPhone}
                </a>
              )}
              {shop.contactEmail && (
                <a href={`mailto:${shop.contactEmail}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-sm hover:border-gray-200 transition-all">
                  <Mail className="w-4 h-4 text-gray-400" />{shop.contactEmail}
                </a>
              )}
              {shop.socialLinks?.whatsapp && (
                <a href={`https://wa.me/${shop.socialLinks.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm hover:bg-green-100 transition-all">
                  <MessageCircle className="w-4 h-4" />WhatsApp
                </a>
              )}
              {shop.socialLinks?.instagram && (
                <a href={`https://instagram.com/${shop.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 border border-pink-100 text-pink-700 text-sm hover:bg-pink-100 transition-all">
                  <Instagram className="w-4 h-4" />@{shop.socialLinks.instagram}
                </a>
              )}
            </div>
            {shop.address && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />{shop.address}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-300">Powered by <span className="font-semibold text-gray-400">Digit-Tally</span></p>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative bg-white w-full max-w-sm flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-bold text-gray-900">Your Cart ({cartCount})</h3>
              <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  {item.product.images[0] && <img src={item.product.images[0]} alt={item.product.title} className="w-12 h-12 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product.title}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(item.product.price, item.product.currency)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t">
              <div className="flex justify-between font-bold text-base mb-4">
                <span>Total</span>
                <span>{formatCurrency(cartTotal, shop.currency)}</span>
              </div>
              <button
                onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm"
                style={{ background: shop.theme.primaryColor }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Complete Order</h3>
              <button onClick={() => setShowCheckout(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <CheckoutModal
              shop={shop}
              cart={cart}
              onClose={() => setShowCheckout(false)}
              onSuccess={() => { setShowCheckout(false); setCart([]); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
