'use client';

import { useState, ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopNav } from '@/components/admin/top-nav';

export function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminSidebar mobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <AdminTopNav onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
