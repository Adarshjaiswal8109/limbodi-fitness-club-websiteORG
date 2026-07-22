'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function GalleryPage() {
  return (
    <CrudPage
      config={{
        table: 'gallery_items',
        title: 'Gallery',
        description: 'Manage gallery images',
        searchColumns: ['label', 'category'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g. Weight Training Zone' },
          { key: 'image', label: 'Image URL', type: 'image', required: true, placeholder: 'https://...' },
          { key: 'category', label: 'Category', type: 'text', default: 'All', placeholder: 'e.g. Gym, Classes, Events' },
          { key: 'span', label: 'Grid Span', type: 'text', placeholder: 'e.g. md:col-span-2' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show on the public website' },
        ],
        columns: [
          {
            key: 'image',
            label: 'Image',
            render: (item) => (
              <img src={item.image} alt={item.label} className="h-12 w-12 rounded-lg object-cover" />
            ),
          },
          { key: 'label', label: 'Label' },
          { key: 'category', label: 'Category' },
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
