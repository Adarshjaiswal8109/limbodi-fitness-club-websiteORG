'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Settings, Mail, Calendar, MessageSquare, Bell,
  Image as ImageIcon, Users, FileText, Star, HelpCircle, Dumbbell,
  LogOut, ArrowUpRight, FolderOpen, Video, Newspaper, Activity,
  Shield, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export interface NavItem {
  icon: any;
  label: string;
  href: string;
  badge?: string;
  group: 'main' | 'content' | 'system';
}

export const adminNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', group: 'main' },
  { icon: Mail, label: 'Enquiries', href: '/admin/enquiries', group: 'main' },
  { icon: Calendar, label: 'Trials', href: '/admin/trials', group: 'main' },
  { icon: MessageSquare, label: 'Messages', href: '/admin/messages', group: 'main' },
  { icon: Bell, label: 'Newsletter', href: '/admin/newsletter', group: 'main' },

  { icon: Users, label: 'Trainers', href: '/admin/trainers', group: 'content' },
  { icon: Dumbbell, label: 'Classes', href: '/admin/classes', group: 'content' },
  { icon: FolderOpen, label: 'Facilities', href: '/admin/facilities', group: 'content' },
  { icon: ImageIcon, label: 'Gallery', href: '/admin/gallery', group: 'content' },
  { icon: Video, label: 'Videos', href: '/admin/videos', group: 'content' },
  { icon: FileText, label: 'Blog', href: '/admin/blog', group: 'content' },
  { icon: Newspaper, label: 'Nutrition', href: '/admin/nutrition', group: 'content' },
  { icon: Star, label: 'Testimonials', href: '/admin/testimonials', group: 'content' },
  { icon: HelpCircle, label: 'FAQs', href: '/admin/faqs', group: 'content' },
  { icon: Dumbbell, label: 'Membership Plans', href: '/admin/plans', group: 'content' },

  { icon: FolderOpen, label: 'Media Library', href: '/admin/media', group: 'system' },
  { icon: Settings, label: 'Settings', href: '/admin/settings', group: 'system' },
  { icon: Activity, label: 'Activity Logs', href: '/admin/activity', group: 'system' },
  { icon: Shield, label: 'Profile & Security', href: '/admin/profile', group: 'system' },
];

const groupLabels: Record<string, string> = {
  main: 'Overview',
  content: 'Content Management',
  system: 'System',
};

export function AdminSidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const pathname = usePathname();
  const { admin, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const groupedItems = adminNavItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col z-50 transition-transform duration-300',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-accent shadow-glow">
              <Dumbbell className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-display text-sm font-bold">Limbodi Admin</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Dashboard</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group}>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-4 mb-2">
                {groupLabels[group]}
              </p>
              <div className="space-y-1">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center gap-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                      isActive(item.href)
                        ? 'gradient-accent text-white shadow-glow'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-accent text-white text-[10px] font-bold px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowUpRight className="h-4 w-4" />
            View Website
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
