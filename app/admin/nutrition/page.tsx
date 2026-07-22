'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function NutritionPage() {
  return (
    <CrudPage
      config={{
        table: 'nutrition_articles',
        title: 'Nutrition Articles',
        description: 'Manage nutrition blog content',
        slugField: 'slug',
        searchColumns: ['title', 'category'],
        publishColumn: 'published',
        orderColumn: 'created_at',
        orderAscending: false,
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Article title' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto-generated from title' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short summary...' },
          { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Full article content...' },
          { key: 'category', label: 'Category', type: 'text', default: 'Nutrition', placeholder: 'e.g. Nutrition, Diet' },
          { key: 'image', label: 'Featured Image URL', type: 'image', placeholder: 'https://...' },
          { key: 'read_time', label: 'Read Time', type: 'text', default: '5 min read', placeholder: 'e.g. 5 min read' },
          { key: 'published', label: 'Published', type: 'toggle', default: false, hint: 'Publish to show on the public website' },
        ],
        columns: [
          {
            key: 'title',
            label: 'Title',
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="h-9 w-9 rounded-lg object-cover" />
                ) : null}
                <span className="font-medium">{item.title}</span>
              </div>
            ),
          },
          { key: 'category', label: 'Category' },
          { key: 'read_time', label: 'Read Time' },
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
