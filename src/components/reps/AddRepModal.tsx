'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  role: z.enum(['rep', 'manager', 'support']),
});

type FormData = z.infer<typeof schema>;

interface AddRepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => Promise<void>;
}

const ROLE_OPTIONS = [
  { value: 'rep', label: 'Sales Rep' },
  { value: 'manager', label: 'Manager' },
  { value: 'support', label: 'Support' },
];

export default function AddRepModal({ isOpen, onClose, onAdd }: AddRepModalProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'rep' },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await onAdd(data);
      reset();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to add rep');
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Sales Representative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Jane Smith"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone Number (optional)"
          type="tel"
          placeholder="+234 800 000 0000"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              label="Role"
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={isSubmitting} className="flex-1">
            Add Rep
          </Button>
        </div>
      </form>
    </Modal>
  );
}
