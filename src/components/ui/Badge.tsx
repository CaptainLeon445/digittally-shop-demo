import clsx from 'clsx';

export type BadgeColor = 'primary' | 'green' | 'yellow' | 'red' | 'gray' | 'blue';

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  primary: 'bg-primary/8 text-primary border border-primary/15',
  green:   'bg-emerald-50 text-emerald-700 border border-emerald-100',
  yellow:  'bg-amber-50 text-amber-700 border border-amber-100',
  red:     'bg-red-50 text-red-600 border border-red-100',
  gray:    'bg-gray-50 text-gray-500 border border-gray-200',
  blue:    'bg-blue-50 text-blue-600 border border-blue-100',
};

export default function Badge({ color = 'gray', children, className }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide',
      colorClasses[color],
      className,
    )}>
      {children}
    </span>
  );
}
