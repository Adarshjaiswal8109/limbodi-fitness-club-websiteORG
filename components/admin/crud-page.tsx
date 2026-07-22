'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { AdminSectionHeader } from '@/components/admin/ui';
import { ConfirmDialog, useToast } from '@/components/admin/form-system';
import { FormModal, type FormFieldDef } from '@/components/admin/form-modal';
import { supabase } from '@/lib/supabase-client';
import { cn } from '@/lib/utils';

export interface CrudConfig {
  table: string;
  title: string;
  description: string;
  fields: FormFieldDef[];
  columns: { key: string; label: string; render?: (item: any) => React.ReactNode }[];
  searchColumns: string[];
  filters?: { column: string; label: string; options: { label: string; value: string }[] }[];
  publishColumn?: string;
  orderColumn?: string;
  orderAscending?: boolean;
  addLabel?: string;
  editLabel?: string;
  slugField?: string;
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export function CrudPage({ config }: { config: CrudConfig }) {
  const { showToast, Toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState(config.orderColumn || 'created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(config.orderAscending ? 'asc' : 'desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from(config.table).select('*', { count: 'exact' });

      Object.entries(activeFilters).forEach(([col, val]) => {
        if (val === 'true' || val === 'false') {
          query = query.eq(col, val === 'true');
        } else if (val) {
          query = query.eq(col, val);
        }
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
    } catch (err: any) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config.table, config.searchColumns, search, activeFilters, page, sortBy, sortDir]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
    setActionMenu(null);
  };

  const handleSubmit = async (data: Record<string, any>): Promise<{ error: string | null }> => {
    try {
      const payload = { ...data };

      if (config.slugField && payload[config.slugField]) {
        payload[config.slugField] = slugify(payload[config.slugField]);
      }
      if (config.slugField && !payload[config.slugField] && payload.name) {
        payload[config.slugField] = slugify(payload.name);
      }
      if (config.slugField && !payload[config.slugField] && payload.title) {
        payload[config.slugField] = slugify(payload.title);
      }

      if (editingItem) {
        const { error } = await supabase.from(config.table).update(payload).eq('id', editingItem.id);
        if (error) throw error;
        showToast(`${config.title.slice(0, -1)} updated successfully`);
      } else {
        const { error } = await supabase.from(config.table).insert(payload);
        if (error) throw error;
        showToast(`${config.title.slice(0, -1)} created successfully`);
      }
      loadData();
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to save' };
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supabase.from(config.table).delete().eq('id', deleteTarget);
      setItems(prev => prev.filter(i => i.id !== deleteTarget));
      setTotal(prev => prev - 1);
      showToast('Item deleted successfully');
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

  const handleTogglePublish = async (item: any) => {
    if (!config.publishColumn) return;
    setActionMenu(null);
    try {
      await supabase.from(config.table).update({ [config.publishColumn!]: !item[config.publishColumn!] }).eq('id', item.id);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, [config.publishColumn!]: !i[config.publishColumn!] } : i));
      showToast(item[config.publishColumn!] ? 'Unpublished' : 'Published');
    } catch {
      showToast('Update failed', 'error');
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    if (!config.publishColumn) return;
    try {
      await supabase.from(config.table).update({ [config.publishColumn!]: publish }).in('id', Array.from(selected));
      setItems(prev => prev.map(i => selected.has(i.id) ? { ...i, [config.publishColumn!]: publish } : i));
      setSelected(new Set());
      showToast(`Successfully ${publish ? 'published' : 'unpublished'} items`);
    } catch {
      showToast('Bulk update failed', 'error');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  return (
    <AdminShell>
      <Toast />
      <AdminSectionHeader
        title={config.title}
        description={config.description}
        action={
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-full gradient-accent text-white px-5 h-10 text-sm font-semibold hover:shadow-glow transition-all"
          >
            <Plus className="h-4 w-4" />
            {config.addLabel || `Add ${config.title.slice(0, -1)}`}
          </button>
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
          className="flex items-center gap-3 rounded-2xl bg-accent/10 border border-accent/20 p-3 mb-4 flex-wrap"
        >
          <span className="text-sm font-semibold text-accent">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto flex-wrap">
            {config.publishColumn && (
              <>
                <button onClick={() => handleBulkPublish(true)} className="flex items-center gap-1.5 rounded-full bg-green-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-green-600 transition-colors">
                  <Eye className="h-3.5 w-3.5" /> Publish All
                </button>
                <button onClick={() => handleBulkPublish(false)} className="flex items-center gap-1.5 rounded-full bg-orange-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-orange-600 transition-colors">
                  <EyeOff className="h-3.5 w-3.5" /> Unpublish All
                </button>
              </>
            )}
            <button onClick={handleBulkDelete} disabled={bulkDeleting} className="flex items-center gap-1.5 rounded-full bg-red-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-600 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete All
            </button>
            <button onClick={() => setSelected(new Set())} className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/20 transition-colors">
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06] bg-secondary/30">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === items.length && items.length > 0}
                    onChange={() => selected.size === items.length ? setSelected(new Set()) : setSelected(new Set(items.map(i => i.id)))}
                    className="accent-orange-500"
                  />
                </th>
                {config.columns.map((col) => (
                  <th key={col.key} className="p-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                    <button onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-black transition-colors">
                      {col.label}
                      {sortBy === col.key && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
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
                <tr>
                  <td colSpan={config.columns.length + 2} className="p-12 text-center text-muted-foreground">
                    No {config.title.toLowerCase()} found. Click &quot;{config.addLabel || `Add ${config.title.slice(0, -1)}`}&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-black/[0.04] hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="accent-orange-500" />
                    </td>
                    {config.columns.map((col) => (
                      <td key={col.key} className="p-4 text-sm">
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent/10 hover:text-accent transition-colors" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        {config.publishColumn && (
                          <button onClick={() => handleTogglePublish(item)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/10 transition-colors" aria-label="Toggle publish">
                            {item[config.publishColumn] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        )}
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
            <p className="text-sm text-muted-foreground">
              {((page - 1) * itemsPerPage) + 1}–{Math.min(page * itemsPerPage, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors">←</button>
              <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors">→</button>
            </div>
          </div>
        )}
      </div>

      <FormModal
        open={modalOpen}
        title={editingItem ? `${config.editLabel || `Edit ${config.title.slice(0, -1)}`}` : `${config.addLabel || `Add ${config.title.slice(0, -1)}`}`}
        fields={config.fields}
        initialData={editingItem}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />

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
