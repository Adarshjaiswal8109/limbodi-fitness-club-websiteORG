'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium', className)}>
      {children}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  gradient,
  trend,
  loading,
}: {
  label: string;
  value: number | string;
  icon: any;
  gradient: string;
  trend?: { value: string; up: boolean };
  loading?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-premium">
      <div className="flex items-start justify-between mb-4">
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white', gradient)}>
          <Icon className="h-6 w-6" />
        </span>
        {trend && (
          <span className={cn('flex items-center gap-1 text-xs font-semibold', trend.up ? 'text-green-600' : 'text-red-500')}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-bold">{loading ? '—' : value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export function AdminSectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold mb-1">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminBadge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) {
  const variants = {
    default: 'bg-black/5 text-black/60',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variants[variant])}>
      {children}
    </span>
  );
}
