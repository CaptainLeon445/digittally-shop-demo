'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Users } from 'lucide-react';
import { shopsApi } from '@/lib/api';
import { ShopSalesRep } from '@/types/shop';
import RepCard from '@/components/reps/RepCard';
import AddRepModal from '@/components/reps/AddRepModal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function RepsPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: reps = [], isLoading, error } = useQuery<ShopSalesRep[]>({
    queryKey: ['shop-reps', shopId],
    queryFn: () => shopsApi.getReps(shopId),
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; email: string; phone?: string; role: string }) =>
      shopsApi.addRep(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-reps', shopId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (repId: string) => shopsApi.removeRep(shopId, repId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-reps', shopId] });
      setRemovingId(null);
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message ?? 'Failed to remove rep');
      setRemovingId(null);
    },
  });

  const handleRemove = (repId: string) => {
    if (!confirm('Remove this sales representative from the shop?')) return;
    setActionError(null);
    setRemovingId(repId);
    removeMutation.mutate(repId);
  };

  const handleAdd = async (data: { name: string; email: string; phone?: string; role: 'rep' | 'manager' | 'support' }) => {
    await addMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sales Representative Terminal</h2>
          <p className="text-sm text-gray-500 mt-0.5 max-w-md">
            Reps receive alerts and can manage customer complaints for this shop.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Rep
        </Button>
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700">Failed to load sales reps</p>
        </div>
      ) : reps.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sales reps yet</h3>
          <p className="text-gray-500 text-sm mb-5 max-w-xs">
            Add sales representatives to help manage customer interactions.
          </p>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add First Rep
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reps.map((rep) => (
            <RepCard
              key={rep.id}
              rep={rep}
              onRemove={handleRemove}
              removing={removingId === rep.id}
            />
          ))}
        </div>
      )}

      <AddRepModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
