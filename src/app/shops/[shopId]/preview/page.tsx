'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Monitor, Smartphone, Tablet, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { shopsStore } from '@/lib/store';
import type { Shop } from '@/types';
import Spinner from '@/components/ui/Spinner';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_CONFIG: Record<Device, { label: string; icon: React.ElementType; width: string; frameClass: string }> = {
  desktop: {
    label: 'Desktop', icon: Monitor,
    width: '100%',
    frameClass: 'w-full h-[700px]',
  },
  tablet: {
    label: 'Tablet', icon: Tablet,
    width: '768px',
    frameClass: 'w-[768px] h-[700px]',
  },
  mobile: {
    label: 'Mobile', icon: Smartphone,
    width: '390px',
    frameClass: 'w-[390px] h-[780px]',
  },
};

const TYPE_LABEL: Record<string, { color: string; bg: string; label: string }> = {
  online_vendor: { color: '#7c3aed', bg: '#f5f3ff', label: 'Online Store' },
  consultation: { color: '#1e40af', bg: '#eff6ff', label: 'Consultation' },
  hospitality: { color: '#0f766e', bg: '#f0fdfa', label: 'Hospitality' },
  service: { color: '#0891b2', bg: '#ecfeff', label: 'Service' },
};

export default function PreviewPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const [device, setDevice] = useState<Device>('desktop');
  const [key, setKey] = useState(0);

  const { data: shop, isLoading } = useQuery<Shop>({
    queryKey: ['shop', shopId],
    queryFn: () => shopsStore.get(shopId),
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!shop) return <p className="text-center py-16 text-gray-400">Shop not found.</p>;

  const deviceCfg = DEVICE_CONFIG[device];
  const typeInfo = TYPE_LABEL[shop.type] ?? TYPE_LABEL.online_vendor;
  const storefrontPath = `/s/${shop.slug}`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Eye className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Storefront Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">{shop.name}</p>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: typeInfo.color, background: typeInfo.bg }}>
              {typeInfo.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={storefrontPath} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors border border-primary-200 px-3 py-2 rounded-xl hover:bg-primary-50">
            <ExternalLink className="w-3.5 h-3.5" />Open Live
          </a>
        </div>
      </div>

      {/* Preview banner */}
      <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
        <p className="text-xs text-amber-800">
          This is a <strong>live preview</strong> of your public storefront. Changes you save in the Storefront tab will reflect here after refresh.
        </p>
        <button onClick={() => setKey((k) => k + 1)} className="ml-auto flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 transition-colors flex-shrink-0">
          <RefreshCw className="w-3 h-3" />Refresh
        </button>
      </div>

      {/* Device switcher */}
      <div className="flex items-center gap-1 mb-5 p-1 bg-white rounded-xl border border-primary-100 shadow-card-sm w-fit">
        {(Object.entries(DEVICE_CONFIG) as [Device, typeof deviceCfg][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${device === key ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Preview frame */}
      <div className={`overflow-auto ${device !== 'desktop' ? 'flex justify-center' : ''}`}>
        <div
          className={`relative rounded-2xl overflow-hidden border-2 border-primary-100 shadow-xl transition-all duration-300 ${deviceCfg.frameClass}`}
          style={{ minWidth: device !== 'desktop' ? deviceCfg.width : undefined }}
        >
          {/* Browser chrome mock */}
          <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2 flex-shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-lg h-5 flex items-center px-2 mx-2">
              <span className="text-[9px] text-gray-400 truncate">store.digittally.com/{shop.slug}</span>
            </div>
          </div>

          {/* Actual iframe */}
          <iframe
            key={key}
            src={storefrontPath}
            className="w-full border-0"
            style={{ height: device === 'mobile' ? 'calc(780px - 32px)' : 'calc(700px - 32px)' }}
            title={`Preview of ${shop.name}`}
          />
        </div>
      </div>

      {/* Tips per type */}
      <div className="mt-6 p-4 bg-white border border-primary-100 rounded-2xl shadow-card">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What customers see on your storefront</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {shop.type === 'online_vendor' && (
            <>
              <Tip icon="🛍️" text="Product grid with search and category filters" />
              <Tip icon="🛒" text="Add to cart and quantity management" />
              <Tip icon="💳" text="Checkout form with customer details" />
              <Tip icon="📦" text="Order confirmation and tracking info" />
            </>
          )}
          {shop.type === 'consultation' && (
            <>
              <Tip icon="📋" text="Services list with duration and pricing" />
              <Tip icon="📅" text="Calendly booking button (if connected)" />
              <Tip icon="💬" text="Virtual or in-person meeting details" />
              <Tip icon="📞" text="Contact section with WhatsApp link" />
            </>
          )}
          {shop.type === 'hospitality' && (
            <>
              <Tip icon="🛏️" text="Room cards with images, capacity and amenities" />
              <Tip icon="📅" text="Date range selection for check-in/out" />
              <Tip icon="🏨" text="Booking form with guest details" />
              <Tip icon="⏰" text="Check-in/out times and house rules" />
            </>
          )}
          {shop.type === 'service' && (
            <>
              <Tip icon="⭐" text="Services list with duration and pricing" />
              <Tip icon="📍" text="Service area displayed per listing" />
              <Tip icon="📝" text="Booking enquiry form" />
              <Tip icon="📞" text="Contact and WhatsApp quick actions" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-base flex-shrink-0">{icon}</span>
      <p className="text-xs text-gray-600">{text}</p>
    </div>
  );
}
