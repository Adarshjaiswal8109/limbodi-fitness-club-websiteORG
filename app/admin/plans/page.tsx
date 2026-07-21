'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function PlansPage() {
  return (
    <CrudPage
      config={{
        table: 'membership_plans',
        title: 'Membership Plans',
        description: 'Manage membership pricing plans',
        searchColumns: ['name', 'price', 'period'],
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'name', label: 'Plan Name', type: 'text', required: true, placeholder: 'e.g. Monthly Premium' },
          { key: 'price', label: 'Price', type: 'text', required: true, placeholder: 'e.g. ₹1,500' },
          { key: 'period', label: 'Period', type: 'text', placeholder: 'e.g. /month, /quarter, /year' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Plan description...' },
          { key: 'features', label: 'Features', type: 'tags', placeholder: 'Type a feature and press Enter' },
          { key: 'icon', label: 'Icon Name', type: 'text', default: 'Calendar', placeholder: 'Lucide icon name' },
          { key: 'highlighted', label: 'Highlight as Recommended', type: 'toggle', default: false, hint: 'Show as the featured/recommended plan' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
        ],
        columns: [
          { key: 'name', label: 'Plan Name', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'price', label: 'Price' },
          { key: 'period', label: 'Period' },
          {
            key: 'highlighted',
            label: 'Featured',
            render: (item) => item.highlighted ? (
              <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold">Featured</span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            ),
          },
        ],
      }}
    />
  );
}
