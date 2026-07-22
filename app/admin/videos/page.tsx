'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function VideosPage() {
  return (
    <CrudPage
      config={{
        table: 'videos',
        title: 'Videos',
        description: 'Manage video content',
        slugField: 'slug',
        searchColumns: ['title', 'category'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Video title' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto-generated from title' },
          { key: 'url', label: 'Video URL', type: 'text', required: true, placeholder: 'https://youtube.com/...' },
          { key: 'thumbnail', label: 'Thumbnail URL', type: 'image', placeholder: 'https://...' },
          { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Workout, Tutorial' },
          { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 5:30' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show on the public website' },
        ],
        columns: [
          {
            key: 'thumbnail',
            label: 'Thumbnail',
            render: (item) => item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title} className="h-12 w-16 rounded-lg object-cover" />
            ) : <span className="text-xs text-muted-foreground">No thumbnail</span>,
          },
          { key: 'title', label: 'Title', render: (item) => <span className="font-medium">{item.title}</span> },
          { key: 'category', label: 'Category' },
          { key: 'duration', label: 'Duration' },
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
