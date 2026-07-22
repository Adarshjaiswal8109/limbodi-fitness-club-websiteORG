'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Loader2, Search } from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { AdminSectionHeader } from '@/components/admin/ui';
import { supabase } from '@/lib/supabase-client';
import type { ActivityLog } from '@/lib/types';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('activity_logs').select('*', { count: 'exact' });
      if (search) {
        query = query.or(`action.ilike.%${search}%,entity_type.ilike.%${search}%`);
      }
      query = query.order('created_at', { ascending: false }).range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, count, error } = await query;
      if (error) throw error;
      setLogs(data || []);
      setTotal(count || 0);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  return (
    <AdminShell>
      <AdminSectionHeader
        title="Activity Logs"
        description="Audit trail of all admin actions"
      />

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search activity..."
          className="w-full rounded-full border border-black/10 bg-white pl-9 pr-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
        />
      </div>

      <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-premium">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No activity logged yet. Admin actions will be recorded here.</p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-4 p-4 hover:bg-secondary/20 transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent shrink-0">
                  <Activity className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold capitalize">{log.action.replace(/_/g, ' ')}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {log.entity_type && <span className="rounded-full bg-black/5 px-2 py-0.5">{log.entity_type}</span>}
                    {log.entity_id && <span className="font-mono">{log.entity_id.slice(0, 8)}</span>}
                    <span>{new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-black/[0.06]">
            <p className="text-sm text-muted-foreground">
              {((page - 1) * itemsPerPage) + 1}–{Math.min(page * itemsPerPage, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors">
                ←
              </button>
              <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 hover:bg-black/5 transition-colors">
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
