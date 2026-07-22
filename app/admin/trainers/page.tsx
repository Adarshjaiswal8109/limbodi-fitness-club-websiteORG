'use client';

import { CrudPage } from '@/components/admin/crud-page';

export default function TrainersPage() {
  return (
    <CrudPage
      config={{
        table: 'trainers',
        title: 'Trainers',
        description: 'Manage trainer profiles',
        slugField: 'slug',
        searchColumns: ['name', 'role'],
        publishColumn: 'published',
        orderColumn: 'sort_order',
        orderAscending: true,
        fields: [
          { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Rajesh Kumar' },
          { key: 'role', label: 'Role / Title', type: 'text', required: true, placeholder: 'e.g. Head Strength Coach' },
          { key: 'image', label: 'Profile Image URL', type: 'image', placeholder: 'https://...' },
          { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short biography...' },
          { key: 'experience', label: 'Experience', type: 'text', placeholder: 'e.g. 10+ years' },
          { key: 'certifications', label: 'Certifications', type: 'tags', placeholder: 'Type and press Enter' },
          { key: 'expertise', label: 'Specializations', type: 'tags', placeholder: 'e.g. Strength Training, CrossFit' },
          { key: 'achievements', label: 'Achievements', type: 'tags', placeholder: 'Type and press Enter' },
          { key: 'schedule', label: 'Schedule', type: 'text', placeholder: 'e.g. Mon-Sat, 6 AM - 12 PM' },
          { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
          { key: 'published', label: 'Published', type: 'toggle', default: true, hint: 'Show this trainer on the public website' },
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
          { key: 'experience', label: 'Experience' },
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
