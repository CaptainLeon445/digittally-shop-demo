'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Store, ShoppingBag, Users, Wallet, Link as LinkIcon,
  CheckCircle, ArrowRight, Star, ChevronDown, ChevronUp,
  Zap, Globe, BarChart3, Shield, Smartphone, Clock,
  Calendar, Package, Bell, CreditCard,
} from 'lucide-react';

// ── Pricing tiers for landing ────────────────────────────────────
const PLANS = [
  {
    name: 'Starter', price: 'Free', sub: 'Forever free',
    features: ['1 shop', '20 products', '2 sales reps', '100 orders/month', '5 payment links'],
    cta: 'Start Free', href: '/signup', highlighted: false,
  },
  {
    name: 'Growth', price: '₦15,000', sub: 'per month',
    features: ['5 shops', '200 products/shop', '10 reps/shop', '2,000 orders/month', 'WhatsApp alerts', 'Booking system', 'Full customisation', 'Wallet & payouts'],
    cta: 'Start Growing', href: '/signup', highlighted: true,
  },
  {
    name: 'Scale', price: '₦45,000', sub: 'per month',
    features: ['Unlimited shops', 'Unlimited products', 'Unlimited reps', 'Unlimited orders', 'White-label store', 'API access', 'Custom domain', 'Priority support'],
    cta: 'Go Unlimited', href: '/signup', highlighted: false,
  },
];

const FEATURES = [
  { icon: Store, title: 'Multiple Shop Types', desc: 'Launch product stores, booking sites, or service pages — choose what fits your business.' },
  { icon: Package, title: 'Smart Inventory', desc: 'Manage products with images, variants, stock levels, and pricing in seconds.' },
  { icon: Bell, title: 'WhatsApp Order Alerts', desc: 'Your sales reps get instant WhatsApp notifications the moment an order comes in.' },
  { icon: Wallet, title: 'Built-in Wallet', desc: 'Collect payments, track earnings, and withdraw funds directly to your bank.' },
  { icon: LinkIcon, title: 'Payment Links', desc: 'Generate shareable payment links for deposits, invoices, or custom amounts.' },
  { icon: BarChart3, title: 'Order Tracking', desc: 'Real-time order status updates with detailed customer information pages.' },
  { icon: Calendar, title: 'Booking System', desc: 'Accept appointments and reservations with an automated booking calendar.' },
  { icon: Globe, title: 'Custom Storefront', desc: 'Brand your storefront with colours, logos, hero images, and custom messaging.' },
];

const SHOP_TYPES = [
  {
    icon: ShoppingBag,
    title: 'Online Vendors',
    desc: 'Sell clothing, electronics, food, accessories, and more with a fully branded product catalogue.',
    color: 'from-purple-500 to-purple-700',
    examples: ['Fashion stores', 'Food businesses', 'Electronics', 'Beauty & cosmetics'],
  },
  {
    icon: Calendar,
    title: 'Consultations',
    desc: 'Take bookings for legal advice, medical appointments, coaching, and professional services.',
    color: 'from-blue-500 to-blue-700',
    examples: ['Legal firms', 'Medical clinics', 'Business coaches', 'Financial advisors'],
  },
  {
    icon: Clock,
    title: 'Hospitality',
    desc: 'Manage reservations for hotels, event venues, shortlets, restaurants, and more.',
    color: 'from-teal-500 to-teal-700',
    examples: ['Shortlet apartments', 'Event venues', 'Restaurants', 'Spas & salons'],
  },
  {
    icon: Zap,
    title: 'Service Businesses',
    desc: 'Accept bookings for repairs, deliveries, cleaning, and any service-based business.',
    color: 'from-orange-500 to-orange-700',
    examples: ['Repair services', 'Delivery businesses', 'Freelancers', 'Agencies'],
  },
];

const TESTIMONIALS = [
  { name: 'Chioma Obi', role: 'Fashion Designer, Lagos', rating: 5, text: 'I set up my shop in 10 minutes and got my first order the same day. The WhatsApp alerts mean I never miss a sale. Absolute game changer.' },
  { name: 'Dr. Ifeanyi Nwosu', role: 'Legal Consultant, Abuja', rating: 5, text: 'My clients can now book consultations without calling me every hour. The booking system is incredibly easy to use and professional-looking.' },
  { name: 'Bisi Adeyemi', role: 'Shortlet Owner, Ibadan', rating: 5, text: 'Managing reservations was a nightmare before. Now I have a proper system, payment links, and everything in one place. Highly recommend!' },
];

const FAQS = [
  { q: 'Do I need technical skills to set up a shop?', a: 'Not at all! Digit-Tally is designed for non-technical business owners. If you can fill a form, you can launch your shop in minutes.' },
  { q: 'What types of shops can I create?', a: 'You can create online product stores, booking/consultation websites, hospitality reservation pages, and general service businesses — all from one dashboard.' },
  { q: 'How do customers pay?', a: 'Your storefront accepts card payments, bank transfers, and you can also generate custom payment links to share via WhatsApp, email, or social media.' },
  { q: 'Can I manage multiple shops?', a: "Yes! You can create and manage multiple shops under one business account. Great for businesses with multiple brands, locations, or service lines." },
  { q: 'How do sales rep alerts work?', a: "When a customer places an order, your assigned sales reps receive an instant WhatsApp message with the order details so they can act immediately." },
  { q: 'Can I try it for free?', a: "Absolutely. Our Starter plan is permanently free — 1 shop, 20 products, and up to 100 orders per month. No credit card needed." },
];

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in 30 seconds. No credit card. No technical setup. Just your name, email, and business name.' },
  { num: '02', title: 'Launch Your Shop', desc: 'Choose your shop type, add your branding, set up your products or services, and customise your storefront.' },
  { num: '03', title: 'Start Selling', desc: 'Share your shop link, get orders, track payments in your wallet, and manage everything from one dashboard.' },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        className="w-full flex justify-between items-start gap-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-gray-900 font-medium text-sm sm:text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b7d8e] to-[#052e36] flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Digit-Tally</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#shop-types" className="hover:text-gray-900 transition-colors">Shop Types</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0b7d8e, #052e36)' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-20 pb-28 px-4"
        style={{ background: 'linear-gradient(145deg, #052e36 0%, #0b5d6e 50%, #0f8fa3 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#13a0b5' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#0b7d8e' }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-200 border border-teal-400/30 bg-teal-400/10 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Launch your shop in 5 minutes
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Sell Online.<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #7de8f4, #13a0b5)' }}>
              Grow Your Business.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Everything you need to sell products, take bookings, and manage your business online — built for Nigerian entrepreneurs and African SMEs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-900 text-base transition-all hover:opacity-95 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
            >
              Start Selling Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-base border border-white/20 hover:bg-white/10 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-400" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-400" /> Free forever plan</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-400" /> Set up in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '12,000+', label: 'Active Shops' },
            { num: '₦2.8B+', label: 'Orders Processed' },
            { num: '45,000+', label: 'Happy Customers' },
            { num: '4.9/5', label: 'Average Rating' },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{num}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0b7d8e] uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">One platform. Endless possibilities.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">From inventory management to payment collection, we've built every tool your business needs to thrive online.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0b7d8e20, #052e3610)' }}>
                  <Icon className="w-5 h-5 text-[#0b7d8e]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop Types ───────────────────────────────────────── */}
      <section id="shop-types" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0b7d8e] uppercase tracking-widest mb-3">Built For Every Business</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose your shop type</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Whether you sell products, offer services, or take bookings — we have a setup that fits your business perfectly.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SHOP_TYPES.map(({ icon: Icon, title, desc, color, examples }) => (
              <div key={title} className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <span key={ex} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{ex}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0b7d8e, #052e36)' }}>
              Launch Your Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0b7d8e] uppercase tracking-widest mb-3">Simple Setup</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Up and running in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center font-bold text-2xl text-white" style={{ background: 'linear-gradient(135deg, #0b7d8e, #052e36)' }}>
                  {num}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0b7d8e] uppercase tracking-widest mb-3">Loved By Businesses</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Real results from real businesses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, rating, text }) => (
              <div key={name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-gray-400 text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0b7d8e] uppercase tracking-widest mb-3">Transparent Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Plans that grow with you</h2>
            <p className="text-gray-500">Start free. Upgrade when you're ready. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(({ name, price, sub, features, cta, href, highlighted }) => (
              <div
                key={name}
                className={`rounded-2xl p-6 border ${highlighted ? 'border-[#0b7d8e] shadow-lg ring-2 ring-[#0b7d8e]/20' : 'border-gray-200 bg-white'} relative`}
                style={highlighted ? { background: 'linear-gradient(145deg, #052e36, #0b7d8e)' } : {}}
              >
                {highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-amber-500">
                    Most Popular
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${highlighted ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <div className="mb-5">
                  <span className={`text-3xl font-bold ${highlighted ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`text-sm ml-1 ${highlighted ? 'text-white/60' : 'text-gray-400'}`}>{sub}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlighted ? 'text-teal-300' : 'text-[#0b7d8e]'}`} />
                      <span className={highlighted ? 'text-white/80' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 ${
                    highlighted
                      ? 'bg-white text-[#052e36]'
                      : 'text-white'
                  }`}
                  style={!highlighted ? { background: 'linear-gradient(135deg, #0b7d8e, #052e36)' } : {}}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#0b7d8e] uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Common questions</h2>
          </div>
          <div>
            {FAQS.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(145deg, #052e36 0%, #0b5d6e 50%, #0f8fa3 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to launch your shop?</h2>
          <p className="text-white/70 text-lg mb-8">Join 12,000+ businesses selling smarter with Digit-Tally. Free to start, no credit card needed.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-900 text-base transition-all hover:opacity-95 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/40 text-sm mt-4">No credit card · Takes 2 minutes · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#0b7d8e] flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-sm">Digit-Tally</span>
              </div>
              <p className="text-xs leading-relaxed">Your all-in-one platform to sell online, take bookings, and grow your business.</p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Product</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#shop-types" className="hover:text-white transition-colors">Shop Types</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Company</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Support</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>© 2025 Digit-Tally. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>SSL secured · PCI compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
