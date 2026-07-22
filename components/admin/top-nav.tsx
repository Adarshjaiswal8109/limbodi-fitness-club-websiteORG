'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';

export function AdminTopNav({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const router = useRouter();
  const { admin, signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      } catch { /* ignore */ }
    };
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('read', false);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const initials = (admin?.full_name || admin?.email || 'A')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] px-5 md:px-8 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input
            type="search"
            placeholder="Search..."
            className="rounded-full border border-black/10 bg-white pl-9 pr-4 h-9 w-64 text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold px-1">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-12 w-80 rounded-3xl border border-black/[0.06] bg-white shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-black/[0.06]">
                  <p className="font-semibold text-sm">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className={cn('flex gap-3 p-4 border-b border-black/[0.04] hover:bg-secondary/30 transition-colors', !n.read && 'bg-accent/5')}>
                        <span className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', n.read ? 'bg-black/20' : 'bg-accent')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{n.title}</p>
                          {n.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {new Date(n.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No notifications yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full hover:bg-black/5 transition-colors p-1 pr-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-accent text-white text-xs font-bold">
              {initials}
            </span>
            <span className="hidden sm:block text-sm font-medium max-w-32 truncate">
              {admin?.full_name || 'Admin'}
            </span>
            <ChevronDown className="h-4 w-4 text-black/40 hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-12 w-56 rounded-2xl border border-black/[0.06] bg-white shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-black/[0.06]">
                  <p className="font-semibold text-sm truncate">{admin?.full_name || 'Administrator'}</p>
                  <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
                  <span className="inline-block mt-2 rounded-full bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {admin?.role || 'admin'}
                  </span>
                </div>
                <div className="p-2">
                  <a href="/admin/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-black/5 transition-colors">
                    <User className="h-4 w-4" /> Profile
                  </a>
                  <a href="/admin/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-black/5 transition-colors">
                    <Settings className="h-4 w-4" /> Settings
                  </a>
                  <button onClick={async () => { await signOut(); router.replace('/admin/login'); }} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
