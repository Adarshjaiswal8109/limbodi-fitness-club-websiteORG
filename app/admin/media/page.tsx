'use client';

import { AdminShell } from '@/components/admin/shell';
import { AdminSectionHeader } from '@/components/admin/ui';
import { FileManager } from '@/components/admin/file-manager';

export default function MediaLibraryPage() {
  return (
    <AdminShell>
      <AdminSectionHeader
        title="Media Library"
        description="Upload, manage, and organize all your media files"
      />
      <FileManager />
    </AdminShell>
  );
}
