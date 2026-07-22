'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function FacilitiesPage() {
  return (
    <CrudPage
      config={{
        table: 'facilities',
        title: 'Facilities',
        description: 'Manage gym facilities and amenities',
        slugField: 'slug',
        searchColumns: ['name', 'description'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'name', label: 'Facility Name', type: 'text', required: true, placeholder: 'e.g. Strength Zone' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto-generated from name' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Facility description...' },
          { key: 'image', label: 'Image URL', type: 'image', placeholder: 'https://...' },
          { key: 'icon', label: 'Icon Name', type: 'text', default: 'Dumbbell', placeholder: 'Lucide icon name' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show on the public website' },
        ],
        columns: [
          {
            key: 'name',
            label: 'Facility',
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />
                ) : null}
                <span className="font-medium">{item.name}</span>
              </div>
            ),
          },
          { key: 'description', label: 'Description', render: (item) => <span className="line-clamp-1 max-w-md text-muted-foreground">{item.description}</span> },
          { key: 'icon', label: 'Icon' },
          {
            key: 'published',
            label: 'Status',
            render: (item) => (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
            ),
          },
        ],
      }}
    />
  );
}
