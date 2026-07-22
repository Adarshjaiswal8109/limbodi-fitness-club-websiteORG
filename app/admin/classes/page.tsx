'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function ClassesPage() {
  return (
    <CrudPage
      config={{
        table: 'classes',
        title: 'Classes',
        description: 'Manage fitness classes and schedules',
        slugField: 'slug',
        searchColumns: ['name', 'day_of_week', 'difficulty'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'name', label: 'Class Name', type: 'text', required: true, placeholder: 'e.g. HIIT Training' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto-generated from name' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Class description...' },
          { key: 'image', label: 'Class Image URL', type: 'image', placeholder: 'https://...' },
          { key: 'day_of_week', label: 'Day of Week', type: 'text', placeholder: 'e.g. Monday, Tuesday' },
          { key: 'start_time', label: 'Start Time', type: 'text', placeholder: 'e.g. 6:00 AM' },
          { key: 'end_time', label: 'End Time', type: 'text', placeholder: 'e.g. 7:00 AM' },
          { key: 'capacity', label: 'Capacity', type: 'number', default: 20 },
          {
            key: 'difficulty',
            label: 'Difficulty Level',
            type: 'select',
            default: 'All Levels',
            options: [
              { label: 'Beginner', value: 'Beginner' },
              { label: 'Intermediate', value: 'Intermediate' },
              { label: 'Advanced', value: 'Advanced' },
              { label: 'All Levels', value: 'All Levels' },
            ],
          },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show on the public website' },
        ],
        columns: [
          { key: 'name', label: 'Class Name', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'day_of_week', label: 'Day' },
          { key: 'start_time', label: 'Start' },
          { key: 'end_time', label: 'End' },
          { key: 'difficulty', label: 'Level' },
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
