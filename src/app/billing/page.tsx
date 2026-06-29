'use client';

import { useState } from 'react';
import {
  CheckCircle, CreditCard, Zap, TrendingUp, Shield,
  Package, Users, Store, ShoppingBag,
} from 'lucide-react';
import { PLANS, DUMMY_SUBSCRIPTION, DUMMY_USER } from '@/lib/dummy-data';
import { formatCurrency } from '@/lib/dummy-data';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const PLAN_ICONS: Record<string, any> = { starter: Zap, growth: TrendingUp, scale: Shield };

export default function BillingPage() {
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const sub = DUMMY_SUBSCRIPTION;
  const currentPlan = PLANS.find((p) => p.id === sub.planId)!;
  const user = DUMMY_USER;

  const handleUpgrade = (planId: string) => {
    setUpgrading(planId);
    setTimeout(() => {
      alert(`[Demo] Redirecting to payment for ${planId} plan. In production, this opens Paystack or Flutterwave.`);
      setUpgrading(null);
    }, 1000);
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your plan and usage</p>
      </div>

      {/* Current Subscription */}
      <div
        className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #052e36, #0b7d8e)' }}
      >
        <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl bg-teal-300" />
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <p className="text-white/50 text-xs mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              <p className="text-white font-bold text-xl capitalize">{currentPlan.name}</p>
              <Badge color="green">Active</Badge>
            </div>
            <p className="text-white/60 text-xs mt-0.5">
              Renews {new Date(sub.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Shops Used</p>
            <p className="text-white font-bold text-lg">{sub.shopCount} / {currentPlan.limits.shops === 999 ? '∞' : currentPlan.limits.shops}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Products</p>
            <p className="text-white font-bold text-lg">{sub.productCount}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Next Invoice</p>
            <p className="text-white font-bold text-lg">{formatCurrency(sub.nextBillingAmount, 'NGN')}</p>
          </div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 mb-8">
        <p className="section-label mb-5">Usage This Billing Period</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Store, label: 'Shops', used: sub.shopCount, limit: currentPlan.limits.shops },
            { icon: Package, label: 'Products', used: sub.productCount, limit: currentPlan.limits.productsPerShop * sub.shopCount },
            { icon: Users, label: 'Sales Reps', used: sub.repCount, limit: currentPlan.limits.repsPerShop * sub.shopCount },
          ].map(({ icon: Icon, label, used, limit }) => {
            const pct = limit >= 999 ? 20 : Math.min(100, Math.round((used / limit) * 100));
            const isHigh = pct > 80;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {used} / {limit >= 999 ? '∞' : limit}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isHigh ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan options */}
      <div>
        <p className="section-label mb-5">Available Plans</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === sub.planId;
            const PlanIcon = PLAN_ICONS[plan.id] ?? Zap;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-5 relative ${
                  isCurrent
                    ? 'border-primary ring-2 ring-primary/20 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary/30 hover:shadow-md transition-all'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold text-white bg-primary">
                    Current Plan
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0b7d8e20, #052e3615)' }}>
                    <PlanIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  {plan.price === 0 ? (
                    <p className="text-2xl font-bold text-gray-900">Free</p>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(plan.price, plan.currency)}</p>
                      <p className="text-xs text-gray-400">per month</p>
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-primary bg-primary/10">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    loading={upgrading === plan.id}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {plan.price > (currentPlan.price ?? 0) ? 'Upgrade' : 'Downgrade'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment method */}
      <div className="mt-8 bg-white rounded-2xl border border-primary-100 shadow-card p-6">
        <p className="section-label mb-4">Payment Method</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</p>
            <p className="text-xs text-gray-400">Expires 09/27</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">Update</Button>
        </div>
      </div>

      {/* Billing history */}
      <div className="mt-6 bg-white rounded-2xl border border-primary-100 shadow-card p-6">
        <p className="section-label mb-4">Billing History</p>
        <div className="space-y-3">
          {[
            { date: 'Jun 1, 2025', amount: 15000, status: 'paid', plan: 'Growth' },
            { date: 'May 1, 2025', amount: 15000, status: 'paid', plan: 'Growth' },
            { date: 'Apr 1, 2025', amount: 0, status: 'paid', plan: 'Starter' },
          ].map(({ date, amount, status, plan }) => (
            <div key={date} className="flex items-center justify-between py-2.5 border-b border-primary-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{plan} Plan</p>
                <p className="text-xs text-gray-400">{date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge color={status === 'paid' ? 'green' : 'gray'}>{status}</Badge>
                <p className="text-sm font-bold text-gray-900">{amount === 0 ? 'Free' : formatCurrency(amount, 'NGN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
