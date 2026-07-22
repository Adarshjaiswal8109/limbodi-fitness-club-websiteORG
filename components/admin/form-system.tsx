'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Loader2, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Form Field Wrapper ---
export function FormField({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-black/70 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs text-red-600 mt-1"
        >
          <AlertCircle className="h-3 w-3" /> {error}
        </motion.p>
      )}
    </div>
  );
}

// --- Form Input ---
export function FormInput({
  label,
  error,
  required,
  hint,
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <input
        {...props}
        className={cn(
          'w-full rounded-2xl border bg-white px-4 h-12 text-sm transition-all',
          error ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20',
          'focus:outline-none',
          props.className
        )}
      />
    </FormField>
  );
}

// --- Form Textarea ---
export function FormTextarea({
  label,
  error,
  required,
  hint,
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <textarea
        {...props}
        className={cn(
          'w-full rounded-2xl border bg-white px-4 py-3 text-sm transition-all min-h-24',
          error ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20',
          'focus:outline-none',
          props.className
        )}
      />
    </FormField>
  );
}

// --- Form Select ---
export function FormSelect({
  label,
  error,
  required,
  hint,
  options,
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <select
        {...props}
        className={cn(
          'w-full rounded-2xl border bg-white px-4 h-12 text-sm transition-all',
          error ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20',
          'focus:outline-none',
          props.className
        )}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FormField>
  );
}

// --- Form Toggle ---
export function FormToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-black/15'
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform',
          checked && 'translate-x-5'
        )} />
      </button>
    </div>
  );
}

// --- Form Actions ---
export function FormActions({
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  submitting,
}: {
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  submitting?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-black/10 px-5 h-10 text-sm font-semibold hover:bg-black/5 transition-colors"
        >
          Cancel
        </button>
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full gradient-accent text-white px-5 h-10 text-sm font-semibold hover:shadow-glow transition-all disabled:opacity-60"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          <><Check className="h-4 w-4" /> {submitLabel}</>
        )}
      </button>
    </div>
  );
}

// --- Form Success Banner ---
export function FormSuccess({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 p-4"
    >
      <Check className="h-5 w-5 text-green-600 shrink-0" />
      <p className="text-sm text-green-700 flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-green-600 hover:text-green-800">
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

// --- Form Error Banner ---
export function FormErrorBanner({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4"
    >
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
      <p className="text-sm text-red-700 flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

// --- Confirmation Dialog ---
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full mb-4',
                variant === 'danger' ? 'bg-red-100' : 'bg-accent/10'
              )}>
                <AlertTriangle className={cn('h-7 w-7', variant === 'danger' ? 'text-red-500' : 'text-accent')} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{message}</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-full border border-black/10 px-4 h-10 text-sm font-semibold hover:bg-black/5 transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={cn(
                    'flex-1 rounded-full px-4 h-10 text-sm font-semibold text-white transition-all disabled:opacity-60',
                    variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'gradient-accent hover:shadow-glow'
                  )}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Toast Notification ---
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const Toast = () => (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={cn(
            'fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl',
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          )}
        >
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { showToast, Toast };
}
