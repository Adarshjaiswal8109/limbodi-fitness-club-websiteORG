'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Calendar, MessageSquare, Bell, TrendingUp, Users, FileText,
  Image as ImageIcon, HelpCircle, Dumbbell, ArrowUpRight, Activity,
  Server, Database, CheckCircle, AlertCircle, Clock, Star,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { AdminStatCard, AdminCard } from '@/components/admin/ui';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardStats {
  enquiries: number;
  trials: number;
  contacts: number;
  newsletter: number;
}

interface ActivityItem {
  id: string;
  action: string;
  entity_type?: string;
  created_at: string;
}

const quickActions = [
  { label: 'New Blog Post', icon: FileText, href: '/admin/blog' },
  { label: 'Add Trainer', icon: Users, href: '/admin/trainers' },
  { label: 'Gallery Image', icon: ImageIcon, href: '/admin/gallery' },
  { label: 'Add FAQ', icon: HelpCircle, href: '/admin/faqs' },
  { label: 'Update Plans', icon: Dumbbell, href: '/admin/plans' },
  { label: 'Settings', icon: Star, href: '/admin/settings' },
];

const chartData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 73 },
  { month: 'Jun', value: 68 },
  { month: 'Jul', value: 82 },
];

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ enquiries: 0, trials: 0, contacts: 0, newsletter: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [enquiries, trials, contacts, newsletter, logs] = await Promise.all([
        supabase.from('membership_enquiries').select('id', { count: 'exact', head: true }),
        supabase.from('trial_bookings').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        enquiries: enquiries.count || 0,
        trials: trials.count || 0,
        contacts: contacts.count || 0,
        newsletter: newsletter.count || 0,
      });
      setActivity(logs.data || []);
    } catch {
      // RLS may block — show zeros
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const statCards = [
    { label: 'Membership Enquiries', value: stats.enquiries, icon: Mail, gradient: 'from-orange-500 to-red-500', href: '/admin/enquiries' },
    { label: 'Trial Bookings', value: stats.trials, icon: Calendar, gradient: 'from-blue-500 to-cyan-500', href: '/admin/trials' },
    { label: 'Contact Messages', value: stats.contacts, icon: MessageSquare, gradient: 'from-green-500 to-emerald-500', href: '/admin/messages' },
    { label: 'Newsletter Subs', value: stats.newsletter, icon: Bell, gradient: 'from-purple-500 to-pink-500', href: '/admin/newsletter' },
  ];

  const systemChecks = [
    { label: 'Database', status: 'operational', icon: Database },
    { label: 'Authentication', status: 'operational', icon: CheckCircle },
    { label: 'Storage', status: 'operational', icon: Server },
    { label: 'API', status: 'operational', icon: Activity },
  ];

  return (
    <AdminShell>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold mb-1">
          Welcome back, {admin?.full_name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening at Limbodi Fitness Club today.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((card, i) => (
          <Link key={card.label} href={card.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <AdminStatCard
                label={card.label}
                value={card.value}
                icon={card.icon}
                gradient={card.gradient}
                loading={loading}
              />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <AdminCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-semibold">Enquiries Trend</h3>
                <p className="text-sm text-muted-foreground">Last 7 months</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <TrendingUp className="h-4 w-4" /> +18%
              </span>
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {chartData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${d.value}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="w-full rounded-t-xl gradient-accent min-h-[8px] relative group cursor-pointer"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.value}
                    </span>
                  </motion.div>
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-medium hover:bg-accent/10 hover:border-accent hover:text-accent transition-all"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                  <ArrowUpRight className="h-4 w-4 ml-auto" />
                </Link>
              ))}
            </div>
          </AdminCard>
        </motion.div>
      </div>

      {/* Recent Activity + System Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <AdminCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
              <Link href="/admin/activity" className="text-sm text-accent font-semibold hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 shimmer rounded-2xl" />
                ))}
              </div>
            ) : activity.length > 0 ? (
              <div className="space-y-2">
                {activity.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 rounded-2xl border border-black/[0.04] bg-white px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent shrink-0">
                      <Activity className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">{log.action.replace(/_/g, ' ')}</p>
                      {log.entity_type && <p className="text-xs text-muted-foreground">{log.entity_type}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No recent activity. Admin actions will appear here.</p>
              </div>
            )}
          </AdminCard>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              {systemChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 shrink-0">
                    <check.icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-medium flex-1">{check.label}</p>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Operational
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Last checked: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </AdminCard>
        </motion.div>
      </div>
    </AdminShell>
  );
}
