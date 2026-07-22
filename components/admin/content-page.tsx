'use client';

import { AdminShell } from '@/components/admin/shell';
import { AdminSectionHeader } from '@/components/admin/ui';
import { DataTable, type Column } from '@/components/admin/data-table';
import { Eye, EyeOff } from 'lucide-react';

interface ContentPageConfig<T> {
  table: string;
  title: string;
  description: string;
  columns: Column<T>[];
  searchColumns: (keyof T)[];
  filters?: { column: string; label: string; options: { label: string; value: string }[] }[];
  publishColumn?: string;
  orderColumn?: string;
  orderAscending?: boolean;
}

export function ContentManagementPage<T extends { id: string; published?: boolean }>({ config }: { config: ContentPageConfig<T> }) {
  return (
    <AdminShell>
      <AdminSectionHeader title={config.title} description={config.description} />
      <DataTable
        table={config.table}
        columns={config.columns}
        searchColumns={config.searchColumns}
        filters={config.filters}
        publishColumn={config.publishColumn || 'published'}
        orderColumn={config.orderColumn || 'sort_order'}
        orderAscending={config.orderAscending ?? true}
      />
    </AdminShell>
  );
}

// Helper to render published status badge
export function PublishBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
      <Eye className="h-3 w-3" /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold">
      <EyeOff className="h-3 w-3" /> Draft
    </span>
  );
}
