'use client';

import { AdminListPage } from '@/components/admin/list-page';

export default function EnquiriesPage() {
  return (
    <AdminListPage
      config={{
        table: 'membership_enquiries',
        title: 'Membership Enquiries',
        description: 'Manage all membership enquiry submissions',
        exportable: true,
        searchColumns: ['full_name', 'email', 'phone', 'preferred_plan'],
        filters: [
          {
            column: 'status',
            label: 'Status',
            options: [
              { label: 'New', value: 'new' },
              { label: 'Contacted', value: 'contacted' },
              { label: 'Converted', value: 'converted' },
              { label: 'Lost', value: 'lost' },
            ],
          },
        ],
        statusColumn: 'status',
        statusOptions: [
          { label: 'New', value: 'new', variant: 'info' },
          { label: 'Contacted', value: 'contacted', variant: 'warning' },
          { label: 'Converted', value: 'converted', variant: 'success' },
          { label: 'Lost', value: 'lost', variant: 'error' },
        ],
        columns: [
          { key: 'full_name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'preferred_plan', label: 'Plan' },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.status === 'new' ? 'bg-blue-100 text-blue-700' :
                item.status === 'contacted' ? 'bg-orange-100 text-orange-700' :
                item.status === 'converted' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
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
          { key: 'full_name', label: 'Full Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'age', label: 'Age' },
          { key: 'gender', label: 'Gender' },
          { key: 'fitness_goal', label: 'Fitness Goal' },
          { key: 'preferred_plan', label: 'Preferred Plan' },
          { key: 'preferred_time', label: 'Preferred Time' },
          { key: 'message', label: 'Message' },
          { key: 'created_at', label: 'Submitted At', render: (item) => new Date(item.created_at).toLocaleString('en-IN') },
        ],
      }}
    />
  );
}
