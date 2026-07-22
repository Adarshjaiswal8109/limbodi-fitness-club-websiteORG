'use client';

import { AdminListPage } from '@/components/admin/list-page';

export default function MessagesPage() {
  return (
    <AdminListPage
      config={{
        table: 'contact_messages',
        title: 'Contact Messages',
        description: 'Manage all contact form submissions',
        exportable: true,
        searchColumns: ['name', 'email', 'subject', 'message'],
        filters: [
          {
            column: 'status',
            label: 'Status',
            options: [
              { label: 'New', value: 'new' },
              { label: 'Read', value: 'read' },
              { label: 'Replied', value: 'replied' },
              { label: 'Archived', value: 'archived' },
            ],
          },
        ],
        statusColumn: 'status',
        statusOptions: [
          { label: 'New', value: 'new', variant: 'info' },
          { label: 'Read', value: 'read', variant: 'warning' },
          { label: 'Replied', value: 'replied', variant: 'success' },
          { label: 'Archived', value: 'archived', variant: 'default' },
        ],
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'subject', label: 'Subject' },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.status === 'new' ? 'bg-blue-100 text-blue-700' :
                item.status === 'read' ? 'bg-orange-100 text-orange-700' :
                item.status === 'replied' ? 'bg-green-100 text-green-700' :
                'bg-black/5 text-black/60'
              }`}>
                {item.status}
              </span>
            ),
          },
          {
            key: 'created_at',
            label: 'Date',
            render: (item) => new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          },
        ],
        detailFields: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'subject', label: 'Subject' },
          { key: 'message', label: 'Message' },
          { key: 'created_at', label: 'Sent At', render: (item) => new Date(item.created_at).toLocaleString('en-IN') },
        ],
      }}
    />
  );
}
