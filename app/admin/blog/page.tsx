'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function BlogPage() {
  return (
    <CrudPage
      config={{
        table: 'blog_posts',
        title: 'Blog Posts',
        description: 'Manage blog articles',
        slugField: 'slug',
        searchColumns: ['title', 'category'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Blog post title' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto-generated from title if empty' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short summary...' },
          { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Full article content...' },
          { key: 'category', label: 'Category', type: 'text', required: true, default: 'Fitness', placeholder: 'e.g. Fitness, Nutrition' },
          { key: 'image', label: 'Featured Image', type: 'image', bucket: 'blog-images' },
          { key: 'read_time', label: 'Read Time', type: 'text', default: '5 min read', placeholder: 'e.g. 5 min read' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
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
          {
            key: 'created_at',
            label: 'Created',
            render: (item) => new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          },
        ],
      }}
    />
  );
}
