'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Mail, Phone, Calendar, MessageSquare, X, Download } from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { AdminSectionHeader, AdminBadge } from '@/components/admin/ui';
import { ConfirmDialog, useToast } from '@/components/admin/form-system';
import { supabase } from '@/lib/supabase-client';

interface ListConfig {
  table: string;
  title: string;
  description: string;
  columns: { key: string; label: string; render?: (item: any) => React.ReactNode }[];
  searchColumns: string[];
  filters?: { column: string; label: string; options: { label: string; value: string }[] }[];
  statusColumn?: string;
  statusOptions?: { label: string; value: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }[];
  detailFields?: { key: string; label: string; render?: (item: any) => React.ReactNode }[];
  exportable?: boolean;
}

export function AdminListPage({ config }: { config: ListConfig }) {
  const { showToast, Toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from(config.table).select('*', { count: 'exact' });

      Object.entries(activeFilters).forEach(([col, val]) => {
        if (val) query = query.eq(col, val);
      });

      if (search && config.searchColumns.length > 0) {
        const searchQuery = config.searchColumns.map(c => `${c}.ilike.%${search}%`).join(',');
        query = query.or(searchQuery);
      }

      query = query.order(sortBy, { ascending: sortDir === 'asc' });
      query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      setItems(data || []);
      setTotal(count || 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config.table, config.searchColumns, search, activeFilters, page, sortBy, sortDir]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supabase.from(config.table).delete().eq('id', deleteTarget);
      setItems(prev => prev.filter(i => i.id !== deleteTarget));
      setTotal(prev => prev - 1);
      showToast('Item deleted');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await supabase.from(config.table).delete().in('id', Array.from(selected));
      setItems(prev => prev.filter(i => !selected.has(i.id)));
      setTotal(prev => prev - selected.size);
      setSelected(new Set());
      showToast(`${selected.size} items deleted`);
    } catch {
      showToast('Bulk delete failed', 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!config.statusColumn) return;
    try {
      await supabase.from(config.table).update({ [config.statusColumn]: status }).eq('id', id);
      setItems(prev => prev.map(i => i.id === id ? { ...i, [config.statusColumn!]: status } : i));
      showToast('Status updated');
    } catch {
      showToast('Update failed', 'error');
    }
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const headers = config.columns.map(c => c.label);
    const rows = items.map(item =>
      config.columns.map(c => {
        const val = item[c.key];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val || '';
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.table}-${Date.now()}.csv`;
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
        title={config.title}
        description={config.description}
        action={
          config.exportable && (
            <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 h-10 text-sm font-semibold hover:bg-black/5 transition-colors">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          )
        }
      />

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="w-full rounded-full border border-black/10 bg-white pl-4 pr-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {config.filters?.map((f) => (
            <select
              key={f.column}
              value={activeFilters[f.column] || ''}
              onChange={(e) => { setActiveFilters(prev => ({ ...prev, [f.column]: e.target.value })); setPage(1); }}
              className="rounded-full border border-black/10 bg-white px-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
            >
              <option value="">All {f.label}</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-3 mb-4"
        >
          <span className="text-sm font-semibold text-red-700">{selected.size} selected</span>
          <button onClick={handleBulkDelete} disabled={bulkDeleting} className="ml-auto flex items-center gap-1.5 rounded-full bg-red-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-600 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Delete Selected
          </button>
          <button onClick={() => setSelected(new Set())} className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/20 transition-colors">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06] bg-secondary/30">
                <th className="p-4 w-10">
                  <input type="checkbox" checked={selected.size === items.length && items.length > 0} onChange={() => selected.size === items.length ? setSelected(new Set()) : setSelected(new Set(items.map(i => i.id)))} className="accent-orange-500" />
                </th>
                {config.columns.map((col) => (
                  <th key={col.key} className="p-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="p-4 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.04]">
                    <td className="p-4"><div className="h-4 w-4 shimmer rounded" /></td>
                    {config.columns.map((col) => <td key={col.key} className="p-4"><div className="h-4 shimmer rounded" /></td>)}
                    <td className="p-4"></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr><td colSpan={config.columns.length + 2} className="p-12 text-center text-muted-foreground">No items found.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-black/[0.04] hover:bg-secondary/20 transition-colors">
                    <td className="p-4"><input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="accent-orange-500" /></td>
                    {config.columns.map((col) => (
                      <td key={col.key} className="p-4 text-sm">
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => setDetailItem(item)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/10 transition-colors" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(item.id)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailItem(null)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Details</h3>
              <button onClick={() => setDetailItem(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {config.detailFields?.map((field) => (
                <div key={field.key} className="flex flex-col gap-1 pb-4 border-b border-black/[0.04]">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</span>
                  <span className="text-sm">
                    {field.render ? field.render(detailItem) : String(detailItem[field.key] ?? 'N/A')}
                  </span>
                </div>
              ))}
              {config.statusColumn && config.statusOptions && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Status</span>
                  <div className="flex gap-2 flex-wrap">
                    {config.statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { updateStatus(detailItem.id, opt.value); setDetailItem({ ...detailItem, [config.statusColumn!]: opt.value }); }}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                          detailItem[config.statusColumn!] === opt.value
                            ? 'gradient-accent text-white'
                            : 'bg-black/5 text-black/60 hover:bg-black/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
