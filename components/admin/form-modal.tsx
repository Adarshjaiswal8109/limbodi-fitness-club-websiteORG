'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/components/admin/image-upload';

export interface FormFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'toggle' | 'number' | 'image' | 'file' | 'tags';
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: { label: string; value: string }[];
  default?: any;
  bucket?: string;
  accept?: string;
}

interface FormModalProps {
  open: boolean;
  title: string;
  fields: FormFieldDef[];
  initialData?: Record<string, any> | null;
  onSubmit: (data: Record<string, any>) => Promise<{ error: string | null }>;
  onClose: () => void;
  submitLabel?: string;
}

export function FormModal({ open, title, fields, initialData, onSubmit, onClose, submitLabel = 'Save' }: FormModalProps) {
  const [data, setData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (open) {
      const initial: Record<string, any> = {};
      fields.forEach(f => {
        initial[f.key] = initialData?.[f.key] ?? f.default ?? (f.type === 'toggle' ? false : f.type === 'tags' ? [] : f.type === 'number' ? 0 : '');
      });
      setData(initial);
      setErrors({});
      setSubmitError('');
    }
  }, [open, initialData, fields]);

  const update = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !data[f.key] && data[f.key] !== 0) {
        newErrors[f.key] = `${f.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    const { error } = await onSubmit(data);
    setSubmitting(false);
    if (error) {
      setSubmitError(error);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-black/[0.06] bg-white">
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {submitError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {fields.map((field) => (
                <div key={field.key}>
                  {field.type === 'toggle' ? (
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4">
                      <div>
                        <p className="text-sm font-semibold">{field.label}</p>
                        {field.hint && <p className="text-xs text-muted-foreground mt-0.5">{field.hint}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => update(field.key, !data[field.key])}
                        className={cn('relative h-6 w-11 rounded-full transition-colors', data[field.key] ? 'bg-accent' : 'bg-black/15')}
                      >
                        <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform', data[field.key] && 'translate-x-5')} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="text-sm font-semibold text-black/70 mb-1.5 block">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={data[field.key] || ''}
                          onChange={(e) => update(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className={cn(
                            'w-full rounded-2xl border bg-white px-4 py-3 text-sm transition-all focus:outline-none',
                            errors[field.key] ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20'
                          )}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={data[field.key] || ''}
                          onChange={(e) => update(field.key, e.target.value)}
                          className={cn(
                            'w-full rounded-2xl border bg-white px-4 h-12 text-sm transition-all focus:outline-none',
                            errors[field.key] ? 'border-red-400' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20'
                          )}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : field.type === 'number' ? (
                        <input
                          type="number"
                          value={data[field.key] ?? 0}
                          onChange={(e) => update(field.key, parseInt(e.target.value) || 0)}
                          placeholder={field.placeholder}
                          className={cn(
                            'w-full rounded-2xl border bg-white px-4 h-12 text-sm transition-all focus:outline-none',
                            errors[field.key] ? 'border-red-400' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20'
                          )}
                        />
                      ) : field.type === 'image' ? (
                        <ImageUpload
                          value={data[field.key] || ''}
                          onChange={(url) => update(field.key, url)}
                          bucket={field.bucket || 'website-assets'}
                          accept="image/*"
                        />
                      ) : field.type === 'file' ? (
                        <ImageUpload
                          value={data[field.key] || ''}
                          onChange={(url) => update(field.key, url)}
                          bucket={field.bucket || 'videos'}
                          accept={field.accept || 'video/*'}
                        />
                      ) : field.type === 'tags' ? (
                        <TagsInput
                          value={data[field.key] || []}
                          onChange={(val) => update(field.key, val)}
                          placeholder={field.placeholder || 'Type and press Enter'}
                        />
                      ) : (
                        <input
                          type="text"
                          value={data[field.key] || ''}
                          onChange={(e) => update(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className={cn(
                            'w-full rounded-2xl border bg-white px-4 h-12 text-sm transition-all focus:outline-none',
                            errors[field.key] ? 'border-red-400' : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20'
                          )}
                        />
                      )}
                      {field.hint && !errors[field.key] && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
                      {errors[field.key] && <p className="text-xs text-red-600 mt-1">{errors[field.key]}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-black/[0.06] bg-white">
              <button
                onClick={onClose}
                className="rounded-full border border-black/10 px-5 h-10 text-sm font-semibold hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full gradient-accent text-white px-5 h-10 text-sm font-semibold hover:shadow-glow transition-all disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> {submitLabel}</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (val: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm focus:outline-none"
      />
    </div>
  );
}
