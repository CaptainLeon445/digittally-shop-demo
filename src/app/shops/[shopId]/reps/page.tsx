'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserPlus, Users, Bell, BellOff, Trash2, Copy, CheckCircle,
  Phone, Mail, MessageCircle, Shield, Star,
} from 'lucide-react';
import { repsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/dummy-data';
import type { SalesRep } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';

const ROLE_OPTIONS = [
  { value: 'rep', label: 'Sales Rep' },
  { value: 'manager', label: 'Manager' },
  { value: 'support', label: 'Support' },
];

const ROLE_COLORS: Record<string, 'green' | 'primary' | 'gray'> = {
  manager: 'green', rep: 'primary', support: 'gray',
};

function InviteRepForm({ shopId, onClose }: { shopId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsappNumber: '', role: 'rep', alertsEnabled: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required'); return; }
    setSaving(true);
    try {
      await repsStore.invite(shopId, form as any);
      queryClient.invalidateQueries({ queryKey: ['reps', shopId] });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to invite rep');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
        <MessageCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-green-700 leading-relaxed">
          Your rep will receive an invite link and can get WhatsApp alerts for every new order on this shop.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Full Name *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Kunle Adeyemi" />
        <Select label="Role" options={ROLE_OPTIONS} value={form.role} onChange={(e) => set('role', (e as any).target.value)} />
      </div>
      <Input label="Email Address *" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="rep@business.com" />
      <Input label="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+234 801 234 5678" />
      <div>
        <Input
          label="WhatsApp Number (for order alerts)"
          value={form.whatsappNumber}
          onChange={(e) => set('whatsappNumber', e.target.value)}
          placeholder="+234 801 234 5678"
        />
        <p className="text-[10px] text-gray-400 mt-1">Leave same as phone if it&apos;s a WhatsApp number</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set('alertsEnabled', !form.alertsEnabled)}
          className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${form.alertsEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${form.alertsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
        <label className="text-sm text-gray-700">Enable WhatsApp order alerts</label>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" size="md" onClick={handleSave} loading={saving} className="flex-1">
          <UserPlus className="w-4 h-4 mr-1.5" />
          Send Invite
        </Button>
      </div>
    </div>
  );
}

function RepCard({ rep, onRemove, onToggleAlerts }: { rep: SalesRep; onRemove: () => void; onToggleAlerts: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    navigator.clipboard.writeText(`https://store.digittally.com/join/${rep.inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = rep.status === 'active' ? 'green' : rep.status === 'pending' ? 'gray' : 'red';

  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {rep.role === 'manager' ? <Star className="w-5 h-5 text-primary" /> : <Users className="w-5 h-5 text-primary" />}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{rep.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge color={ROLE_COLORS[rep.role] ?? 'gray'} className="text-[10px]">{rep.role}</Badge>
              <Badge color={statusColor} className="text-[10px]">{rep.status}</Badge>
            </div>
          </div>
        </div>
        <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1.5 mb-3">
        <a href={`mailto:${rep.email}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors">
          <Mail className="w-3 h-3" />{rep.email}
        </a>
        {rep.phone && (
          <a href={`tel:${rep.phone}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors">
            <Phone className="w-3 h-3" />{rep.phone}
          </a>
        )}
        {rep.whatsappNumber && (
          <a href={`https://wa.me/${rep.whatsappNumber.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700 transition-colors">
            <MessageCircle className="w-3 h-3" />WhatsApp: {rep.whatsappNumber}
          </a>
        )}
      </div>

      {rep.totalOrders !== undefined && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-center">
          <div className="bg-primary-50 rounded-lg p-2">
            <p className="text-xs font-bold text-gray-900">{rep.totalOrders}</p>
            <p className="text-[9px] text-gray-400">Orders</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-2">
            <p className="text-xs font-bold text-gray-900">{formatCurrency(rep.revenue ?? 0, 'NGN')}</p>
            <p className="text-[9px] text-gray-400">Revenue</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onToggleAlerts}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${rep.alertsEnabled ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
        >
          {rep.alertsEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          WA alerts {rep.alertsEnabled ? 'on' : 'off'}
        </button>

        {rep.status === 'pending' && rep.inviteCode && (
          <button onClick={copyInvite} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary-dark transition-colors">
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy invite'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RepsPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);

  const { data: reps, isLoading } = useQuery<SalesRep[]>({
    queryKey: ['reps', shopId],
    queryFn: () => repsStore.list(shopId),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => repsStore.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reps', shopId] }),
  });

  const toggleAlerts = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => repsStore.update(id, { alertsEnabled: enabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reps', shopId] }),
  });

  const active = (reps ?? []).filter((r) => r.status === 'active').length;
  const pending = (reps ?? []).filter((r) => r.status === 'pending').length;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sales Representatives</h2>
          <p className="text-sm text-gray-500">{active} active · {pending} pending</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowInvite(true)}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Invite Rep
        </Button>
      </div>

      {/* How it works banner */}
      {(!reps || reps.length === 0) && !isLoading && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm mb-1">How WhatsApp alerts work</p>
              <p className="text-xs text-green-700 leading-relaxed">
                When a customer places an order on your shop, all active reps with alerts enabled receive an instant WhatsApp message with the order number, customer name, and total amount — so they can act immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!isLoading && (!reps || reps.length === 0) && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">No reps yet</p>
          <p className="text-sm text-gray-400 mb-5 max-w-xs">Invite your first sales rep to help manage orders and receive alerts.</p>
          <Button variant="primary" size="md" onClick={() => setShowInvite(true)}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Invite First Rep
          </Button>
        </div>
      )}

      {!isLoading && reps && reps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reps.map((rep) => (
            <RepCard
              key={rep.id}
              rep={rep}
              onRemove={() => removeMutation.mutate(rep.id)}
              onToggleAlerts={() => toggleAlerts.mutate({ id: rep.id, enabled: !rep.alertsEnabled })}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Sales Rep">
        <InviteRepForm shopId={shopId} onClose={() => setShowInvite(false)} />
      </Modal>
    </div>
  );
}
