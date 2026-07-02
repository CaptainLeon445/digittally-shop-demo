'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'No credit card needed',
    features: ['1 storefront', '20 products', '2 sales reps', '100 orders/month', '5 payment links'],
    cta: 'Open your shop',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₦15,000',
    sub: '/month',
    features: ['5 storefronts', '200 products each', '10 reps per shop', '2,000 orders/month', 'WhatsApp alerts', 'Booking system', 'Full branding control', 'Wallet & payouts'],
    cta: 'Start growing',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'Scale',
    price: '₦45,000',
    sub: '/month',
    features: ['Unlimited storefronts', 'Unlimited products', 'Unlimited reps', 'Unlimited orders', 'White-label store', 'API access', 'Custom domain', 'Priority support'],
    cta: 'Go unlimited',
    href: '/signup',
    highlighted: false,
  },
];

const FEATURES = [
  {
    tag: 'Storefront',
    title: 'A real online presence — not just a link-in-bio',
    body: 'Build a fully branded storefront with your logo, colours, hero image, and custom messaging. Customers see a proper business, not a generic page.',
  },
  {
    tag: 'Inventory',
    title: 'Add products in seconds, manage stock in real time',
    body: 'Upload images, set prices, add variants, and track stock levels. When something runs out, it disappears from your shop automatically.',
  },
  {
    tag: 'Orders',
    title: 'Every order tracked from payment to delivery',
    body: 'See what customers ordered, where it is, and what they paid. Update statuses, print receipts, and keep buyers in the loop without phone calls.',
  },
  {
    tag: 'Wallet',
    title: 'Payments go directly into your wallet',
    body: 'Collected revenue sits in your Digit-Tally wallet. Withdraw to your bank account whenever you want. No hidden fees, no waiting periods.',
  },
  {
    tag: 'Reps',
    title: 'Your sales team gets instant WhatsApp alerts',
    body: 'Assign reps to your shop and they receive a WhatsApp message the moment an order drops — with the order number, customer name, and total.',
  },
  {
    tag: 'Bookings',
    title: 'Accept appointments and reservations automatically',
    body: 'For consultations, shortlets, events, and services — customers pick a slot on your live calendar. No back-and-forth messages.',
  },
];

const SHOP_TYPES = [
  {
    slug: 'vendor',
    label: 'Online Vendors',
    headline: 'Sell products. Ship anywhere.',
    body: 'Whether you sell clothes, electronics, food, or cosmetics — set up a product catalogue, take orders, and track every sale from your dashboard.',
    examples: ['Fashion boutiques', 'Food businesses', 'Electronics', 'Beauty & skincare'],
  },
  {
    slug: 'consultation',
    label: 'Consultants',
    headline: 'Book clients without the back-and-forth.',
    body: 'Lawyers, doctors, coaches, and advisors can show availability, accept bookings, and collect payment — all before the first meeting.',
    examples: ['Legal firms', 'Medical clinics', 'Business coaches', 'Financial advisors'],
  },
  {
    slug: 'hospitality',
    label: 'Hospitality',
    headline: 'Reservations, rooms, and restaurants.',
    body: 'Run shortlets, hotels, event spaces, or restaurants with a proper booking page, payment collection, and reservation management.',
    examples: ['Shortlet apartments', 'Event venues', 'Restaurants', 'Spas & salons'],
  },
  {
    slug: 'service',
    label: 'Service Businesses',
    headline: 'Take bookings for any kind of service.',
    body: 'Repair shops, cleaning companies, logistics, and freelancers — let customers book a slot and pay upfront, with alerts going straight to your team.',
    examples: ['Repair services', 'Delivery businesses', 'Freelancers', 'Agencies'],
  },
];

const TESTIMONIALS = [
  {
    quote: "I set up my shop in 10 minutes and got my first order the same day. The WhatsApp alerts mean I never miss a sale, even when I'm at the market.",
    name: 'Chioma Obi',
    title: 'Fashion Designer',
    location: 'Lagos',
  },
  {
    quote: "My clients can now book consultations without calling me every hour. The booking system is clean and professional — they comment on how polished it looks.",
    name: 'Ifeanyi Nwosu',
    title: 'Legal Consultant',
    location: 'Abuja',
  },
  {
    quote: "Before this, I was managing reservations on a WhatsApp group. Now I have proper payment, receipts, and everything in one place. No more confusion.",
    name: 'Bisi Adeyemi',
    title: 'Shortlet Owner',
    location: 'Ibadan',
  },
];

const FAQS = [
  { q: 'Do I need technical skills to set up a shop?', a: 'No. If you can fill a form, you can launch your shop. Everything is designed for business owners, not developers — no code, no plugins, no hosting.' },
  { q: 'What types of shops can I create?', a: 'Product stores, booking/consultation websites, hospitality reservation pages, and service businesses. Each type has settings built for how that business actually operates.' },
  { q: 'How do customers pay?', a: 'Your storefront accepts card payments and bank transfers. You can also generate payment links to share directly on WhatsApp, email, or Instagram.' },
  { q: 'Can I manage multiple shops from one account?', a: 'Yes — run multiple shops, brands, or locations under a single Digit-Tally account. Each shop has its own inventory, orders, reps, and wallet.' },
  { q: 'How do WhatsApp alerts work?', a: 'When an order comes in, your assigned reps receive an instant WhatsApp message with the order number, customer name, and total amount — so they can respond immediately.' },
  { q: 'Can I try it for free?', a: 'The Starter plan is permanently free — one shop, 20 products, up to 100 orders per month. No credit card, no time limit.' },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-5">
      <button className="w-full flex justify-between items-start gap-4 text-left group" onClick={() => setOpen((o) => !o)}>
        <span className="text-gray-900 font-medium text-sm sm:text-[15px] leading-snug group-hover:text-primary transition-colors">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">{a}</p>}
    </div>
  );
}

/* ── Fake product card used inside the hero mockup ───────────── */
function MockProductCard({ name, price, tag }: { name: string; price: string; tag: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-subtle">
      <div className="h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-2.5 flex items-center justify-center">
        <span className="text-[10px] text-gray-400 font-medium">{tag}</span>
      </div>
      <p className="text-xs font-semibold text-gray-900 truncate">{name}</p>
      <p className="text-[11px] text-primary font-bold mt-0.5">{price}</p>
    </div>
  );
}

export default function LandingPage() {
  const [activeType, setActiveType] = useState('vendor');
  const activeShop = SHOP_TYPES.find((t) => t.slug === activeType) ?? SHOP_TYPES[0];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="3" y="3" width="6" height="6" rx="1" fill="white" />
                <rect x="11" y="3" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
                <rect x="3" y="11" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
                <rect x="11" y="11" width="6" height="6" rx="1" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-ink text-[15px] tracking-tight">Digit-Tally</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-gray-500">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#shop-types" className="hover:text-ink transition-colors">Shop Types</a>
            <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-ink transition-colors hidden sm:block font-medium">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors">
              Open your shop
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f1e21]">
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          {/* Copy */}
          <div className="pb-16 lg:pb-20">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-primary-light mb-6 border border-primary/30 px-3 py-1 rounded-full">
              Built for Nigerian entrepreneurs
            </span>
            <h1 className="font-serif text-[42px] sm:text-[52px] leading-[1.1] text-white mb-5">
              Your business,<br />
              <em className="not-italic text-primary-light">running itself.</em>
            </h1>
            <p className="text-[15px] text-white/60 leading-relaxed max-w-md mb-8">
              Sell products, take bookings, collect payments, and manage your team — from one dashboard built for how African businesses actually work.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                Open your shop free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm font-medium hover:bg-white/5 transition-colors">
                See how it works
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-[12px] text-white/35">
              <span>No credit card</span>
              <span className="text-white/15">·</span>
              <span>Free forever plan</span>
              <span className="text-white/15">·</span>
              <span>5-minute setup</span>
            </div>
          </div>

          {/* App mockup */}
          <div className="relative self-end hidden lg:block">
            <div className="rounded-t-2xl border border-white/10 overflow-hidden" style={{ background: '#f9fafb' }}>
              {/* Fake browser bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-200 bg-white">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                <div className="flex-1 mx-3 px-3 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-400 font-mono">
                  store.digittally.com/s/fashion-hub
                </div>
              </div>
              {/* Fake storefront */}
              <div>
                <div className="h-24 flex items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #0f1e21, #0b7d8e)' }}>
                  <div>
                    <p className="text-white font-bold text-lg">Fashion Hub Nigeria</p>
                    <p className="text-white/60 text-xs mt-0.5 text-center">Premium styles delivered to your door</p>
                  </div>
                </div>
                <div className="px-4 py-4 grid grid-cols-3 gap-2.5">
                  <MockProductCard name="Ankara Jumpsuit" price="₦18,500" tag="New" />
                  <MockProductCard name="Lace Blouse" price="₦9,200" tag="Sale" />
                  <MockProductCard name="Aso-Oke Set" price="₦45,000" tag="Top" />
                </div>
                <div className="px-4 pb-4">
                  <div className="rounded-lg bg-primary text-white text-xs font-semibold text-center py-2">
                    View full catalogue →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted-by strip ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100 py-6 px-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Used by businesses in</span>
          {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Accra'].map((city) => (
            <span key={city} className="text-sm font-semibold text-gray-500">{city}</span>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">What you get</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              Everything a serious business<br className="hidden sm:block" /> needs to sell online.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {FEATURES.map(({ tag, title, body }, i) => (
              <div key={tag} className="bg-white p-7 hover:bg-primary-50/50 transition-colors">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded mb-4">
                  {tag}
                </span>
                <h3 className="font-semibold text-ink text-[15px] leading-snug mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop Types ──────────────────────────────────────────────── */}
      <section id="shop-types" className="py-20 px-5 bg-[#f5f3ef]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Built for every business</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              Choose the setup that fits<br className="hidden sm:block" /> how you work.
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            {SHOP_TYPES.map((t) => (
              <button
                key={t.slug}
                onClick={() => setActiveType(t.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeType === t.slug
                    ? 'bg-ink text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-ink/30 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Active type card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="font-serif text-2xl text-ink mb-3">{activeShop.headline}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{activeShop.body}</p>
              <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                Set up this shop type <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Used by</p>
              <div className="space-y-2">
                {activeShop.examples.map((ex) => (
                  <div key={ex} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-ink">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Setup</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">From zero to open for business.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Create your account', body: 'Sign up with your name, email, and business name. Takes 30 seconds. No card, no setup fee.' },
              { n: '2', title: 'Build your storefront', body: 'Choose your shop type, add your logo and branding, upload products or services, and set your prices.' },
              { n: '3', title: 'Share and start selling', body: 'Share your shop link on WhatsApp, Instagram, or wherever your customers are. Orders come in — you manage from the dashboard.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="relative">
                <div className="w-8 h-8 rounded-lg border-2 border-primary/30 flex items-center justify-center mb-5">
                  <span className="text-sm font-bold text-primary">{n}</span>
                </div>
                <h3 className="font-semibold text-ink text-[15px] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-[#0f1e21]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-light mb-3">From businesses like yours</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              People who switched<br className="hidden sm:block" /> and never looked back.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, title, location }) => (
              <div key={name} className="border border-white/10 rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/75 text-sm leading-relaxed flex-1 mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{title} · {location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Pricing</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-3">Start free. Pay when you grow.</h2>
            <p className="text-gray-500 text-sm">No hidden fees. Cancel anytime. No credit card for the free plan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(({ name, price, sub, features, cta, href, highlighted }) => (
              <div
                key={name}
                className={`rounded-2xl border p-6 flex flex-col ${
                  highlighted
                    ? 'bg-ink border-ink text-white ring-2 ring-ink ring-offset-2'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="mb-5">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${highlighted ? 'text-primary-light' : 'text-primary'}`}>
                    {name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${highlighted ? 'text-white' : 'text-ink'}`}>{price}</span>
                    <span className={`text-sm ${highlighted ? 'text-white/50' : 'text-gray-400'}`}>{sub}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${highlighted ? 'text-primary-light' : 'text-primary'}`} />
                      <span className={highlighted ? 'text-white/75' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    highlighted
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-ink text-white hover:bg-ink/90'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-5 bg-[#f5f3ef]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">FAQ</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">Questions we get a lot.</h2>
          </div>
          {FAQS.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-ink mb-4">Ready to open your shop?</h2>
          <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of Nigerian businesses running their operations on Digit-Tally. Free to start, no credit card needed.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ink text-white font-semibold text-base hover:bg-ink/90 transition-colors"
          >
            Create your free account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-400 text-xs mt-4">No credit card · 5-minute setup · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-[#0f1e21] text-white/40 py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
                    <rect x="3" y="3" width="6" height="6" rx="1" fill="white" />
                    <rect x="11" y="3" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
                    <rect x="3" y="11" width="6" height="6" rx="1" fill="white" fillOpacity=".5" />
                    <rect x="11" y="11" width="6" height="6" rx="1" fill="white" />
                  </svg>
                </div>
                <span className="font-bold text-white text-sm tracking-tight">Digit-Tally</span>
              </div>
              <p className="text-xs leading-relaxed max-w-[180px]">
                Your all-in-one platform to sell online, take bookings, and grow your business.
              </p>
            </div>
            <div>
              <p className="text-white/70 font-semibold text-xs uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#features" className="hover:text-white/70 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white/70 transition-colors">Pricing</a></li>
                <li><a href="#shop-types" className="hover:text-white/70 transition-colors">Shop Types</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/70 font-semibold text-xs uppercase tracking-widest mb-4">Company</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-white/70 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white/70 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white/70 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/70 font-semibold text-xs uppercase tracking-widest mb-4">Support</p>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#faq" className="hover:text-white/70 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white/70 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>© 2025 Digit-Tally. All rights reserved.</p>
            <p>SSL secured · PCI compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
