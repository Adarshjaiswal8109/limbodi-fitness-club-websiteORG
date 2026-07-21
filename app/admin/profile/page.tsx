'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Mail, Save, Loader2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { AdminCard, AdminSectionHeader, AdminBadge } from '@/components/admin/ui';
import { FormInput, FormActions, FormSuccess, useToast } from '@/components/admin/form-system';
import { ChangePasswordForm } from '@/components/admin/change-password-form';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
  const { admin, updateProfile } = useAuth();
  const { showToast, Toast } = useToast();
  const [fullName, setFullName] = useState(admin?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(admin?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const { error } = await updateProfile({ full_name: fullName, avatar_url: avatarUrl });
    setSaving(false);
    if (error) {
      showToast('Failed to update profile', 'error');
    } else {
      setSuccess(true);
      showToast('Profile updated successfully');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const initials = (fullName || admin?.email || 'A')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AdminShell>
      <Toast />
      <AdminSectionHeader
        title="Profile & Security"
        description="Manage your admin account and security settings"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <AdminCard>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full gradient-accent text-white text-2xl font-bold mb-4">
                {initials}
              </span>
              <h3 className="font-display text-lg font-bold">{fullName || 'Administrator'}</h3>
              <p className="text-sm text-muted-foreground">{admin?.email}</p>
              <div className="mt-3">
                <AdminBadge variant="info">{admin?.role || 'admin'}</AdminBadge>
              </div>
              <div className="mt-6 w-full pt-6 border-t border-black/[0.06] space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium truncate">{admin?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium capitalize">{admin?.role || 'admin'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="font-medium">{admin?.created_at ? new Date(admin.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </AdminCard>
        </motion.div>

        {/* Edit Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-6">Edit Profile</h3>
            {success && <div className="mb-4"><FormSuccess message="Profile updated successfully" onClose={() => setSuccess(false)} /></div>}
            <div className="space-y-5">
              <FormInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
              <FormInput
                label="Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                hint="Paste an image URL for your profile avatar"
              />
              <FormActions
                onSubmit={handleSave}
                submitLabel="Save Profile"
                submitting={saving}
              />
            </div>
          </AdminCard>

          {/* Change Password */}
          <div className="mt-6">
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Change Password</h3>
              <ChangePasswordForm />
            </AdminCard>
          </div>
        </motion.div>
      </div>
    </AdminShell>
  );
}
