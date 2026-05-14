import type { BoothStatus, PaymentStatus, BoothType } from '../types';

export const statusColors: Record<BoothStatus, string> = {
  open: 'bg-emerald-500',
  booked: 'bg-blue-500',
  reserved: 'bg-amber-400',
  past_due: 'bg-red-500',
  maintenance: 'bg-slate-400',
};

export const statusTextColors: Record<BoothStatus, string> = {
  open: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40',
  booked: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40',
  reserved: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40',
  past_due: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40',
  maintenance: 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/60',
};

export const statusLabel: Record<BoothStatus, string> = {
  open: 'Open',
  booked: 'Booked',
  reserved: 'Reserved',
  past_due: 'Past Due',
  maintenance: 'Maintenance',
};

export const paymentTextColors: Record<PaymentStatus, string> = {
  paid: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40',
  due_soon: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40',
  past_due: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40',
  not_applicable: 'text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-700/40',
};

export const paymentLabel: Record<PaymentStatus, string> = {
  paid: 'Paid',
  due_soon: 'Due Soon',
  past_due: 'Past Due',
  not_applicable: 'N/A',
};

export const boothTypeLabel: Record<BoothType, string> = {
  standard: 'Standard',
  corner: 'Corner',
  front: 'Front Wall',
  food: 'Food Court',
  outdoor: 'Outdoor',
  small: 'Small',
};

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
