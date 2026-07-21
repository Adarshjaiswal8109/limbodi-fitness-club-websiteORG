'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown,
  Trash2, Eye, EyeOff, MoreVertical, X, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase-client';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  table: string;
  columns: Column<T>[];
  filters?: { column: string; label: string; options: FilterOption[] }[];
  searchColumns?: (keyof T)[];
  itemsPerPage?: number;
  renderItem?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onTogglePublish?: (item: T) => void;
  publishColumn?: string;
  select?: string;
  orderColumn?: string;
  orderAscending?: boolean;
  transformData?: (data: any[]) => T[];
}

export function DataTable<T extends { id: string }>({
  table,
  columns,
  filters = [],
  searchColumns = [],
  itemsPerPage = 10,
  emptyMessage = 'No items found.',
  onEdit,
  onDelete,
  onTogglePublish,
  publishColumn = 'published',
  select = '*',
  orderColumn = 'created_at',
  orderAscending = false,
  transformData,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>(orderColumn);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(orderAscending ? 'asc' : 'desc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const totalPages = Math.ceil(total / itemsPerPage);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let query = supabase.from(table).select(select, { count: 'exact' });

      // Filters
      Object.entries(activeFilters).forEach(([col, val]) => {
        if (val) query = query.eq(col, val);
      });

      // Search
      if (search && searchColumns.length > 0) {
        const searchQuery = searchColumns.map(c => `${String(c)}.ilike.%${search}%`).join(',');
        query = query.or(searchQuery);
      }

      // Sorting
      query = query.order(sortBy, { ascending: sortDir === 'asc' });

      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data: result, error: queryError, count } = await query;

      if (queryError) throw queryError;

      const transformed = transformData ? transformData(result || []) : (result || []) as unknown as T[];
      setData(transformed);
      setTotal(count || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [table, select, page, itemsPerPage, search, sortBy, sortDir, activeFilters, searchColumns, transformData]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
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

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map(d => d.id)));
    }
  };

  useEffect(() => {
    setShowBulkActions(selected.size > 0);
  }, [selected]);

  const bulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
    const ids = Array.from(selected);
    try {
      if (action === 'delete') {
        await supabase.from(table).delete().in('id', ids);
      } else {
        await supabase.from(table).update({ [publishColumn]: action === 'publish' }).in('id', ids);
      }
      setSelected(new Set());
      loadData();
    } catch { /* ignore */ }
  };

  const handleTogglePublish = async (item: T) => {
    if (onTogglePublish) {
      onTogglePublish(item);
    } else {
      try {
        await supabase.from(table).update({ [publishColumn]: !(item as any)[publishColumn] }).eq('id', item.id);
        loadData();
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="w-full rounded-full border border-black/10 bg-white pl-9 pr-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <select
              key={f.column}
              value={activeFilters[f.column] || ''}
              onChange={(e) => {
                setActiveFilters(prev => ({ ...prev, [f.column]: e.target.value }));
                setPage(1);
              }}
              className="rounded-full border border-black/10 bg-white px-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
            >
              <option value="">{f.label}: All</option>
              {f.options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-2xl bg-accent/10 border border-accent/20 p-3"
          >
            <span className="text-sm font-semibold text-accent">{selected.size} selected</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => bulkAction('publish')} className="flex items-center gap-1.5 rounded-full bg-green-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-green-600 transition-colors">
                <Eye className="h-3.5 w-3.5" /> Publish All
              </button>
              <button onClick={() => bulkAction('unpublish')} className="flex items-center gap-1.5 rounded-full bg-orange-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-orange-600 transition-colors">
                <EyeOff className="h-3.5 w-3.5" /> Unpublish All
              </button>
              <button onClick={() => bulkAction('delete')} className="flex items-center gap-1.5 rounded-full bg-red-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-600 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Delete All
              </button>
              <button onClick={() => setSelected(new Set())} className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/20 transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06] bg-secondary/30">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === data.length && data.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-orange-500"
                  />
                </th>
                {columns.map((col) => (
                  <th key={String(col.key)} className={cn('p-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider', col.className)}>
                    {col.sortable ? (
                      <button onClick={() => handleSort(String(col.key))} className="flex items-center gap-1 hover:text-black transition-colors">
                        {col.label}
                        {sortBy === col.key ? (
                          sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.04]">
                    <td className="p-4"><div className="h-4 w-4 shimmer rounded" /></td>
                    {columns.map((col) => (
                      <td key={String(col.key)} className="p-4"><div className="h-4 shimmer rounded" /></td>
                    ))}
                    <td className="p-4"></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="p-12 text-center text-muted-foreground">
                    {error || emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-b border-black/[0.04] hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="accent-orange-500"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={String(col.key)} className={cn('p-4 text-sm', col.className)}>
                        {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                      </td>
                    ))}
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === item.id ? null : item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <AnimatePresence>
                          {actionMenu === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-10 z-10 w-40 rounded-2xl border border-black/[0.06] bg-white shadow-2xl overflow-hidden"
                            >
                              {onEdit && (
                                <button onClick={() => { onEdit(item); setActionMenu(null); }} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-black/5 transition-colors text-left">
                                  Edit
                                </button>
                              )}
                              <button onClick={() => { handleTogglePublish(item); setActionMenu(null); }} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-black/5 transition-colors text-left">
                                {(item as any)[publishColumn] ? 'Unpublish' : 'Publish'}
                              </button>
                              {onDelete && (
                                <button onClick={() => { onDelete(item); setActionMenu(null); }} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                  Delete
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-black/[0.06]">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * itemsPerPage) + 1}–{Math.min(page * itemsPerPage, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
