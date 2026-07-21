'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function FAQsPage() {
  return (
    <CrudPage
      config={{
        table: 'faqs',
        title: 'FAQs',
        description: 'Manage frequently asked questions',
        searchColumns: ['question', 'answer', 'category'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'question', label: 'Question', type: 'text', required: true, placeholder: 'The question' },
          { key: 'answer', label: 'Answer', type: 'textarea', required: true, placeholder: 'The answer' },
          { key: 'category', label: 'Category', type: 'text', default: 'General', placeholder: 'e.g. General, Membership' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show on the public website' },
        ],
        columns: [
          { key: 'question', label: 'Question', render: (item) => <span className="font-medium line-clamp-1 max-w-md">{item.question}</span> },
          { key: 'answer', label: 'Answer', render: (item) => <span className="line-clamp-1 max-w-md text-muted-foreground">{item.answer}</span> },
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
