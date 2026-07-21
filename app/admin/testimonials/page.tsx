'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function TestimonialsPage() {
  return (
    <CrudPage
      config={{
        table: 'testimonials',
        title: 'Testimonials',
        description: 'Manage customer testimonials',
        searchColumns: ['name', 'role', 'quote'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Customer name' },
          { key: 'role', label: 'Role / Title', type: 'text', placeholder: 'e.g. Member since 2022' },
          { key: 'image', label: 'Photo', type: 'image', bucket: 'website-assets' },
          { key: 'quote', label: 'Quote', type: 'textarea', required: true, placeholder: 'Their testimonial...' },
          { key: 'transformation', label: 'Transformation', type: 'text', placeholder: 'e.g. Lost 15kg in 6 months' },
          { key: 'rating', label: 'Rating (1-5)', type: 'number', default: 5 },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show on the public website' },
        ],
        columns: [
          {
            key: 'name',
            label: 'Name',
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold">
                    {item.name?.charAt(0) || '?'}
                  </span>
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ),
          },
          { key: 'rating', label: 'Rating', render: (item) => `${item.rating}★` },
          { key: 'quote', label: 'Quote', render: (item) => <span className="line-clamp-1 max-w-xs">{item.quote}</span> },
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
