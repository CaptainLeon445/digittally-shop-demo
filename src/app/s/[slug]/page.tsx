'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart, Plus, Minus, X, Phone, Mail, MapPin,
  Instagram, Twitter, Facebook, MessageCircle, CheckCircle,
  Loader2, Calendar, Clock, Users, Wifi, ExternalLink, Video,
  Star, ChevronRight,
} from 'lucide-react';
import { shopsStore, productsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { Shop, Product } from '@/types';
import Spinner from '@/components/ui/Spinner';

interface CartItem { product: Product; quantity: number; }

// ── Shared helpers ───────────────────────────────────────────────
function Navbar({ shop, cartCount, cartTotal, onCartClick }: { shop: Shop; cartCount: number; cartTotal: number; onCartClick: () => void }) {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
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
        {cartCount > 0 && (
          <button onClick={onCartClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: shop.theme.primaryColor }}>
            <ShoppingCart className="w-4 h-4" />
            Cart ({cartCount}) · {formatCurrency(cartTotal, shop.currency)}
          </button>
        )}
      </div>
    </nav>
  );
}

function Hero({ shop, ctaContent }: { shop: Shop; ctaContent?: React.ReactNode }) {
  return (
    <div className="relative h-60 sm:h-80"
      style={{
        backgroundImage: shop.bannerUrl ? `url(${shop.bannerUrl})` : undefined,
        backgroundSize: 'cover', backgroundPosition: 'center',
        background: !shop.bannerUrl ? `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` : undefined,
      }}>
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {shop.logoUrl && (
          <img src={shop.logoUrl} alt={shop.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50 mb-3 shadow-lg" />
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">{shop.theme.heroHeadline}</h1>
        <p className="text-white/80 text-sm sm:text-base max-w-md">{shop.theme.heroSubtext}</p>
        {ctaContent}
      </div>
    </div>
  );
}

function ContactSection({ shop }: { shop: Shop }) {
  return (
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
          <a href={`https://wa.me/${shop.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm hover:bg-green-100 transition-all">
            <MessageCircle className="w-4 h-4" />WhatsApp
          </a>
        )}
        {shop.socialLinks?.instagram && (
          <a href={`https://instagram.com/${shop.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 border border-pink-100 text-pink-700 text-sm hover:bg-pink-100 transition-all">
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
  );
}

function Footer() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
      <p className="text-xs text-gray-300">Powered by <span className="font-semibold text-gray-400">Digit-Tally</span></p>
    </div>
  );
}

// ── Online Vendor ────────────────────────────────────────────────
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

  if (done) return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">Order Placed!</h3>
      <p className="text-gray-500 text-sm mb-1">Thank you, {form.name.split(' ')[0]}. Your order is confirmed.</p>
      <p className="text-gray-400 text-xs mb-6">You&apos;ll receive a confirmation shortly.</p>
      <button onClick={onSuccess} className="px-6 py-2.5 rounded-xl text-white font-semibold" style={{ background: shop.theme.primaryColor }}>
        Continue Shopping
      </button>
    </div>
  );

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
          <span>Total</span><span>{formatCurrency(total, shop.currency)}</span>
        </div>
      </div>
      <hr className="border-gray-100" />
      <p className="font-semibold text-gray-900 text-sm">Your Details</p>
      {[
        { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Ngozi Eze' },
        { label: 'Email *', key: 'email', type: 'email', placeholder: 'ngozi@email.com' },
        { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+234 801 234 5678' },
        { label: 'Delivery Address', key: 'address', type: 'text', placeholder: '12 Ring Road, Enugu' },
      ].map(({ label, key, type, placeholder }) => (
        <div key={key}>
          <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
          <input type={type} placeholder={placeholder} value={(form as any)[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
      ))}
      <button onClick={handlePlace} disabled={!form.name.trim() || !form.email.trim() || placing}
        className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
        style={{ background: `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` }}>
        {placing && <Loader2 className="w-4 h-4 animate-spin" />}
        {placing ? 'Processing...' : `Place Order · ${formatCurrency(total, shop.currency)}`}
      </button>
    </div>
  );
}

function OnlineVendorStorefront({ shop, products }: { shop: Shop; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (product: Product) => setCart((c) => {
    const existing = c.find((i) => i.product.id === product.id);
    if (existing) return c.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...c, { product, quantity: 1 }];
  });
  const updateQty = (id: string, qty: number) => {
    if (qty === 0) setCart((c) => c.filter((i) => i.product.id !== id));
    else setCart((c) => c.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat && p.status === 'active';
  });
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar shop={shop} cartCount={cartCount} cartTotal={cartTotal} onCartClick={() => setShowCart(true)} />
      <Hero shop={shop} ctaContent={
        <button className="mt-5 px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: shop.theme.accentColor }}>
          {shop.theme.heroCtaText}
        </button>
      } />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search & categories */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {categories.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border"
                  style={activeCategory === cat ? { background: shop.theme.primaryColor, color: '#fff', borderColor: shop.theme.primaryColor } : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-48">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                  {product.comparePrice && <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</div>}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{product.title}</p>
                  {product.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{formatCurrency(product.price, product.currency)}</span>
                      {product.comparePrice && <span className="text-xs text-gray-400 line-through ml-1.5">{formatCurrency(product.comparePrice, product.currency)}</span>}
                    </div>
                    <button onClick={() => addToCart(product)} disabled={product.stock === 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40"
                      style={{ background: shop.theme.primaryColor }}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <ContactSection shop={shop} />
        <Footer />
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
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t">
              <div className="flex justify-between font-bold text-base mb-4"><span>Total</span><span>{formatCurrency(cartTotal, shop.currency)}</span></div>
              <button onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm" style={{ background: shop.theme.primaryColor }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Complete Order</h3>
              <button onClick={() => setShowCheckout(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <CheckoutModal shop={shop} cart={cart} onClose={() => setShowCheckout(false)}
              onSuccess={() => { setShowCheckout(false); setCart([]); }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Consultation ─────────────────────────────────────────────────
function BookingSuccessModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">Booking Request Sent!</h3>
      <p className="text-gray-500 text-sm mb-1">Thank you, {name.split(' ')[0]}. Your request is confirmed.</p>
      <p className="text-gray-400 text-xs mb-6">The team will reach out to confirm your booking details.</p>
      <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-white font-semibold bg-primary">Done</button>
    </div>
  );
}

function ConsultationStorefront({ shop, products }: { shop: Shop; products: Product[] }) {
  const [selectedService, setSelectedService] = useState<Product | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', date: '', time: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const activeServices = products.filter((p) => p.status === 'active');

  const handleBook = async () => {
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
  };

  const meetingTypeLabel: Record<string, string> = {
    virtual: 'Virtual', in_person: 'In Person', both: 'Virtual or In Person',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar shop={shop} cartCount={0} cartTotal={0} onCartClick={() => {}} />

      <Hero shop={shop} ctaContent={
        shop.calendlyUrl ? (
          <a href={shop.calendlyUrl} target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: shop.theme.accentColor, color: '#1f2937' }}>
            <Calendar className="w-4 h-4" />{shop.theme.heroCtaText}
          </a>
        ) : (
          <button onClick={() => { setSelectedService(activeServices[0] ?? null); setShowBooking(true); }}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: shop.theme.accentColor, color: '#1f2937' }}>
            <Calendar className="w-4 h-4" />{shop.theme.heroCtaText}
          </button>
        )
      } />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Calendly CTA banner */}
        {shop.calendlyUrl && (
          <div className="mb-8 p-5 rounded-2xl border-2 flex items-center gap-4"
            style={{ borderColor: shop.theme.primaryColor, background: `${shop.theme.primaryColor}10` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: shop.theme.primaryColor }}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">Book via Calendly</p>
              <p className="text-xs text-gray-500">Pick your preferred date and time instantly using our scheduling system.</p>
            </div>
            <a href={shop.calendlyUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold flex-shrink-0"
              style={{ background: shop.theme.primaryColor }}>
              <ExternalLink className="w-3.5 h-3.5" />Book Now
            </a>
          </div>
        )}

        {/* Services */}
        <h2 className="text-xl font-bold text-gray-900 mb-5">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {activeServices.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-gray-900">{service.title}</p>
                  {service.category && <p className="text-xs text-gray-400 mt-0.5">{service.category}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatCurrency(service.price, service.currency)}</p>
                  <p className="text-[10px] text-gray-400">per {service.unit ?? 'session'}</p>
                </div>
              </div>
              {service.description && <p className="text-sm text-gray-500 mb-3 flex-1">{service.description}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {service.duration && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3 h-3" />{service.duration >= 60 ? `${service.duration / 60} hour${service.duration > 60 ? 's' : ''}` : `${service.duration} min`}
                  </span>
                )}
                {service.meetingType && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Video className="w-3 h-3" />{meetingTypeLabel[service.meetingType] ?? service.meetingType}
                  </span>
                )}
              </div>
              {service.meetingLink ? (
                <a href={service.meetingLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: shop.theme.primaryColor, color: '#fff' }}>
                  <Calendar className="w-4 h-4" />Book This Service
                </a>
              ) : shop.calendlyUrl ? (
                <a href={shop.calendlyUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: shop.theme.primaryColor, color: '#fff' }}>
                  <ExternalLink className="w-4 h-4" />Book via Calendly
                </a>
              ) : (
                <button onClick={() => { setSelectedService(service); setShowBooking(true); setDone(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: shop.theme.primaryColor, color: '#fff' }}>
                  <Calendar className="w-4 h-4" />Book Now
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Availability info */}
        {(shop.availableHours || shop.availableDays) && (
          <div className="mb-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Availability</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {shop.availableHours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />{shop.availableHours.start} – {shop.availableHours.end}
                </span>
              )}
              {shop.availableDays && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].filter((_, i) => shop.availableDays?.includes(i)).join(', ')}
                </span>
              )}
            </div>
          </div>
        )}

        <ContactSection shop={shop} />
        <Footer />
      </div>

      {/* Booking form modal (fallback when no Calendly) */}
      {showBooking && !shop.calendlyUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">
                {selectedService ? `Book: ${selectedService.title}` : 'Book a Consultation'}
              </h3>
              <button onClick={() => setShowBooking(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {done ? <BookingSuccessModal name={bookingForm.name} onClose={() => setShowBooking(false)} /> : (
              <div className="space-y-3">
                {[
                  { label: 'Full Name *', key: 'name', type: 'text' },
                  { label: 'Email *', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                  { label: 'Preferred Date', key: 'date', type: 'date' },
                  { label: 'Preferred Time', key: 'time', type: 'time' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                    <input type={type} value={(bookingForm as any)[key]}
                      onChange={(e) => setBookingForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Notes / Questions</label>
                  <textarea rows={3} value={bookingForm.notes}
                    onChange={(e) => setBookingForm((f) => ({ ...f, notes: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="Anything you'd like us to know..." />
                </div>
                <button onClick={handleBook} disabled={!bookingForm.name.trim() || !bookingForm.email.trim() || submitting}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` }}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Sending...' : 'Request Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hospitality ──────────────────────────────────────────────────
function HospitalityStorefront({ shop, products }: { shop: Shop; products: Product[] }) {
  const [selectedRoom, setSelectedRoom] = useState<Product | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const activeRooms = products.filter((p) => p.status === 'active');

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  const handleBook = async () => {
    if (!bookingForm.name.trim() || !bookingForm.email.trim() || !checkIn || !checkOut) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar shop={shop} cartCount={0} cartTotal={0} onCartClick={() => {}} />
      <Hero shop={shop} ctaContent={
        <button onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
          style={{ background: shop.theme.accentColor, color: '#1f2937' }}>
          <Calendar className="w-4 h-4" />{shop.theme.heroCtaText}
        </button>
      } />

      {/* Date picker */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Guests</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus className="w-4 h-4" /></button>
                <span className="text-sm font-semibold w-6 text-center">{guests}</span>
                <button onClick={() => setGuests((g) => g + 1)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          {nights > 0 && (
            <p className="text-xs text-gray-500 mt-2">{nights} night{nights !== 1 ? 's' : ''} selected</p>
          )}
        </div>
      </div>

      <div id="rooms" className="max-w-5xl mx-auto px-4 py-6">
        {/* Check-in/out info */}
        {(shop.checkInTime || shop.checkOutTime) && (
          <div className="flex gap-4 mb-6">
            {shop.checkInTime && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-3 py-2">
                <Clock className="w-4 h-4 text-gray-400" />Check-in from {shop.checkInTime}
              </span>
            )}
            {shop.checkOutTime && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-3 py-2">
                <Clock className="w-4 h-4 text-gray-400" />Check-out by {shop.checkOutTime}
              </span>
            )}
          </div>
        )}

        {/* Featured amenities */}
        {shop.featuredAmenities && shop.featuredAmenities.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-3">Property Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {shop.featuredAmenities.map((a) => (
                <span key={a} className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-100 rounded-xl px-3 py-1.5">
                  <Wifi className="w-3.5 h-3.5 text-gray-400" />{a}
                </span>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-5">Available Rooms & Spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {activeRooms.map((room) => {
            const totalPrice = nights > 0 ? room.price * nights : room.price;
            return (
              <div key={room.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                {room.images[0] ? (
                  <div className="h-48 overflow-hidden">
                    <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-36 bg-gray-50 flex items-center justify-center">
                    <Star className="w-10 h-10 text-gray-200" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-gray-900">{room.title}</p>
                    {room.stock <= 2 && (
                      <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        Only {room.stock} left
                      </span>
                    )}
                  </div>
                  {room.description && <p className="text-sm text-gray-500 mb-3">{room.description}</p>}

                  <div className="flex gap-3 mb-3">
                    {room.capacity && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />Up to {room.capacity} guests
                      </span>
                    )}
                  </div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{a}</span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">+{room.amenities.length - 4} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPrice, room.currency)}</p>
                      <p className="text-xs text-gray-400">{nights > 0 ? `${nights} night${nights !== 1 ? 's' : ''}` : 'per night'}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedRoom(room); setShowBooking(true); setDone(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm"
                      style={{ background: shop.theme.primaryColor }}>
                      <Calendar className="w-4 h-4" />Reserve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* House Rules */}
        {shop.houseRules && (
          <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">House Rules</h3>
            <p className="text-sm text-gray-600">{shop.houseRules}</p>
          </div>
        )}

        <ContactSection shop={shop} />
        <Footer />
      </div>

      {/* Room booking modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">
                {selectedRoom ? `Reserve: ${selectedRoom.title}` : 'Make a Reservation'}
              </h3>
              <button onClick={() => setShowBooking(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {done ? <BookingSuccessModal name={bookingForm.name} onClose={() => setShowBooking(false)} /> : (
              <div className="space-y-3">
                {selectedRoom && nights > 0 && (
                  <div className="p-3 bg-primary-50 rounded-xl text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">{selectedRoom.title}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{checkIn} → {checkOut} ({nights} nights)</span>
                      <span className="font-bold text-gray-900">{formatCurrency(selectedRoom.price * nights, selectedRoom.currency)}</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Check-in *</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Check-out *</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                {[
                  { label: 'Full Name *', key: 'name', type: 'text' },
                  { label: 'Email *', key: 'email', type: 'email' },
                  { label: 'Phone *', key: 'phone', type: 'tel' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                    <input type={type} value={(bookingForm as any)[key]}
                      onChange={(e) => setBookingForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <button onClick={handleBook}
                  disabled={!bookingForm.name.trim() || !bookingForm.email.trim() || !checkIn || !checkOut || submitting}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` }}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Processing...' : `Confirm Reservation${nights > 0 && selectedRoom ? ` · ${formatCurrency(selectedRoom.price * nights, selectedRoom.currency)}` : ''}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Service ──────────────────────────────────────────────────────
function ServiceStorefront({ shop, products }: { shop: Shop; products: Product[] }) {
  const [selectedService, setSelectedService] = useState<Product | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', date: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const activeServices = products.filter((p) => p.status === 'active');
  const categories = Array.from(new Set(activeServices.map((p) => p.category).filter(Boolean) as string[]));

  const handleBook = async () => {
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar shop={shop} cartCount={0} cartTotal={0} onCartClick={() => {}} />
      <Hero shop={shop} ctaContent={
        <button onClick={() => { setShowBooking(true); setDone(false); }}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
          style={{ background: shop.theme.accentColor, color: '#1f2937' }}>
          <ChevronRight className="w-4 h-4" />{shop.theme.heroCtaText}
        </button>
      } />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Service area banner */}
        {(shop as any).serviceArea && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-xl px-4 py-3 w-fit shadow-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            Serving: <span className="font-semibold">{(shop as any).serviceArea}</span>
          </div>
        )}

        {/* Services by category */}
        {(categories.length > 0 ? categories : [null]).map((cat) => {
          const items = cat ? activeServices.filter((p) => p.category === cat) : activeServices;
          return (
            <div key={cat ?? 'all'} className="mb-8">
              {cat && <h2 className="text-lg font-bold text-gray-900 mb-4">{cat}</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-bold text-gray-900">{service.title}</p>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">{formatCurrency(service.price, service.currency)}</p>
                        {service.unit && <p className="text-[10px] text-gray-400">per {service.unit}</p>}
                      </div>
                    </div>
                    {service.description && <p className="text-sm text-gray-500 mb-3">{service.description}</p>}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />{service.duration >= 60 ? `${service.duration / 60} hrs` : `${service.duration} min`}
                        </span>
                      )}
                      {service.serviceArea && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3" />{service.serviceArea}
                        </span>
                      )}
                    </div>
                    <button onClick={() => { setSelectedService(service); setShowBooking(true); setDone(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm"
                      style={{ background: shop.theme.primaryColor }}>
                      <Calendar className="w-4 h-4" />Book This Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Availability */}
        {shop.availableHours && (
          <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-2">
              <Clock className="w-4 h-4 text-gray-400" />{shop.availableHours.start} – {shop.availableHours.end}
            </span>
            {shop.availableDays && (
              <span className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].filter((_, i) => shop.availableDays?.includes(i)).join(', ')}
              </span>
            )}
          </div>
        )}

        <ContactSection shop={shop} />
        <Footer />
      </div>

      {/* Booking modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">
                {selectedService ? `Book: ${selectedService.title}` : 'Book a Service'}
              </h3>
              <button onClick={() => setShowBooking(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {done ? <BookingSuccessModal name={bookingForm.name} onClose={() => setShowBooking(false)} /> : (
              <div className="space-y-3">
                {selectedService && (
                  <div className="p-3 bg-primary-50 rounded-xl flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{selectedService.title}</span>
                    <span className="font-bold">{formatCurrency(selectedService.price, selectedService.currency)}</span>
                  </div>
                )}
                {[
                  { label: 'Full Name *', key: 'name', type: 'text' },
                  { label: 'Email *', key: 'email', type: 'email' },
                  { label: 'Phone *', key: 'phone', type: 'tel' },
                  { label: 'Preferred Date', key: 'date', type: 'date' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                    <input type={type} value={(bookingForm as any)[key]}
                      onChange={(e) => setBookingForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Notes / Special Requests</label>
                  <textarea rows={3} value={bookingForm.notes}
                    onChange={(e) => setBookingForm((f) => ({ ...f, notes: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="e.g. 3-bedroom apartment, need morning slot..." />
                </div>
                <button onClick={handleBook}
                  disabled={!bookingForm.name.trim() || !bookingForm.email.trim() || submitting}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${shop.theme.primaryColor}, #052e36)` }}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Sending...' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────
export default function StorefrontPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: shop, isLoading: shopLoading } = useQuery<Shop>({
    queryKey: ['storefront-shop', slug],
    queryFn: () => shopsStore.getBySlug(slug),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['storefront-products', shop?.id],
    queryFn: () => productsStore.list(shop!.id),
    enabled: !!shop,
  });

  if (shopLoading || (productsLoading && !products.length)) return (
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

  if (shop.type === 'consultation') return <ConsultationStorefront shop={shop} products={products} />;
  if (shop.type === 'hospitality') return <HospitalityStorefront shop={shop} products={products} />;
  if (shop.type === 'service') return <ServiceStorefront shop={shop} products={products} />;
  return <OnlineVendorStorefront shop={shop} products={products} />;
}
