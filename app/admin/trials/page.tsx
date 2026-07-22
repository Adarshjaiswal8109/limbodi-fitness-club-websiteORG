'use client';

import { AdminListPage } from '@/components/admin/list-page';

export default function TrialsPage() {
  return (
    <AdminListPage
      config={{
        table: 'trial_bookings',
        title: 'Free Trial Bookings',
        description: 'Manage all free trial booking requests',
        exportable: true,
        searchColumns: ['name', 'email', 'mobile', 'fitness_goal'],
        filters: [
          {
            column: 'status',
            label: 'Status',
            options: [
              { label: 'New', value: 'new' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ],
        statusColumn: 'status',
        statusOptions: [
          { label: 'New', value: 'new', variant: 'info' },
          { label: 'Confirmed', value: 'confirmed', variant: 'warning' },
          { label: 'Completed', value: 'completed', variant: 'success' },
          { label: 'Cancelled', value: 'cancelled', variant: 'error' },
        ],
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'mobile', label: 'Mobile' },
          { key: 'preferred_date', label: 'Date' },
          { key: 'preferred_time', label: 'Time' },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.status === 'new' ? 'bg-blue-100 text-blue-700' :
                item.status === 'confirmed' ? 'bg-orange-100 text-orange-700' :
                item.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.status}
              </span>
            ),
          },
        ],
        detailFields: [
          { key: 'name', label: 'Name' },
          { key: 'mobile', label: 'Mobile' },
          { key: 'email', label: 'Email' },
          { key: 'preferred_date', label: 'Preferred Date' },
          { key: 'preferred_time', label: 'Preferred Time' },
          { key: 'fitness_goal', label: 'Fitness Goal' },
          { key: 'created_at', label: 'Booked At', render: (item) => new Date(item.created_at).toLocaleString('en-IN') },
        ],
      }}
    />
  );
}
