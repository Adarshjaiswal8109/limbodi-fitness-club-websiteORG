'use client';

import { AdminShell } from '@/components/admin/shell';
import { AdminSectionHeader } from '@/components/admin/ui';
import { ConfirmDialog, useToast } from '@/components/admin/form-system';
import { supabase } from '@/lib/supabase-client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, Mail, Loader2, X } from 'lucide-react';

export default function NewsletterPage() {
  const { showToast, Toast } = useToast();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('newsletter_subscribers').select('*', { count: 'exact' });
      if (search) query = query.ilike('email', `%${search}%`);
      query = query.order('subscribed_at', { ascending: false }).range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, count } = await query;
      setSubscribers(data || []);
      setTotal(count || 0);
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supabase.from('newsletter_subscribers').delete().eq('id', deleteTarget);
      setSubscribers(prev => prev.filter(s => s.id !== deleteTarget));
      setTotal(prev => prev - 1);
      showToast('Subscriber removed');
    } catch {
      showToast('Failed to remove', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await supabase.from('newsletter_subscribers').delete().in('id', Array.from(selected));
      setSubscribers(prev => prev.filter(s => !selected.has(s.id)));
      setTotal(prev => prev - selected.size);
      setSelected(new Set());
      showToast(`${selected.size} subscribers removed`);
    } catch {
      showToast('Bulk delete failed', 'error');
    }
  };

  const exportCSV = () => {
    const csv = ['email,subscribed_at', ...subscribers.map(s => `"${s.email}","${s.subscribed_at}"`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported to CSV');
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AdminShell>
      <Toast />
      <AdminSectionHeader
        title="Newsletter Subscribers"
        description={`${total} subscriber${total !== 1 ? 's' : ''} total`}
        action={
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 h-10 text-sm font-semibold hover:bg-black/5 transition-colors">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-3 mb-4"
        >
          <span className="text-sm font-semibold text-red-700">{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="ml-auto flex items-center gap-1.5 rounded-full bg-red-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-600 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Delete Selected
          </button>
          <button onClick={() => setSelected(new Set())} className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/20 transition-colors">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </motion.div>
      )}

      <div className="mb-4 relative max-w-md">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by email..."
          className="w-full rounded-full border border-black/10 bg-white pl-4 pr-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
        />
      </div>

      <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-premium">
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No subscribers yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06] bg-secondary/30">
                <th className="p-4 w-10"><input type="checkbox" checked={selected.size === subscribers.length && subscribers.length > 0} onChange={() => selected.size === subscribers.length ? setSelected(new Set()) : setSelected(new Set(subscribers.map(s => s.id)))} className="accent-orange-500" /></th>
                <th className="p-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Email</th>
                <th className="p-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Subscribed At</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-black/[0.04] hover:bg-secondary/20 transition-colors">
                  <td className="p-4"><input type="checkbox" checked={selected.has(sub.id)} onChange={() => toggleSelect(sub.id)} className="accent-orange-500" /></td>
                  <td className="p-4 text-sm font-medium">{sub.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(sub.subscribed_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="p-4">
                    <button onClick={() => setDeleteTarget(sub.id)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-black/[0.06]">
            <p className="text-sm text-muted-foreground">{((page - 1) * itemsPerPage) + 1}–{Math.min(page * itemsPerPage, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors">←</button>
              <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors">→</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Subscriber"
        message="Are you sure you want to remove this subscriber?"
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
