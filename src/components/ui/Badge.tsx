import clsx from 'clsx';

export type BadgeColor = 'primary' | 'green' | 'yellow' | 'red' | 'gray' | 'blue';

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  primary: 'bg-primary-100 text-primary-dark border border-primary-200',
  green:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  yellow:  'bg-amber-50 text-amber-700 border border-amber-200',
  red:     'bg-red-50 text-red-700 border border-red-200',
  gray:    'bg-gray-100 text-gray-600 border border-gray-200',
  blue:    'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function Badge({ color = 'gray', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClasses[color], className)}>
      {children}
    </span>
  );
}
