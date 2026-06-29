'use client';

import { Trash2, Mail, Phone, Shield } from 'lucide-react';
import { ShopSalesRep } from '@/types/shop';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface RepCardProps {
  rep: ShopSalesRep;
  onRemove: (repId: string) => void;
  removing?: boolean;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const roleColors: Record<string, string> = {
  manager: 'bg-purple-100 text-purple-700',
  rep: 'bg-blue-100 text-blue-700',
  support: 'bg-orange-100 text-orange-700',
};

export default function RepCard({ rep, onRemove, removing }: RepCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-4 flex gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #0b7d8e, #13a0b5)' }}>
        {getInitials(rep.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900">{rep.name}</p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
              roleColors[rep.role] ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {rep.role}
          </span>
          <Badge color={rep.status === 'active' ? 'green' : 'gray'}>
            {rep.status}
          </Badge>
        </div>
        <div className="mt-1.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{rep.email}</span>
          </div>
          {rep.phone && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{rep.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(rep.id)}
        disabled={removing}
        className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
        aria-label="Remove rep"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
