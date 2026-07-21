'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Check, Upload, Globe, Phone, Mail, MapPin, Clock, Share2, Image as ImageIcon, FileText, Settings as SettingsIcon, Bell } from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { AdminCard, AdminSectionHeader } from '@/components/admin/ui';
import { FormInput, FormTextarea, FormToggle, FormActions, FormSuccess, FormErrorBanner, useToast } from '@/components/admin/form-system';
import { ImageUpload } from '@/components/admin/image-upload';
import { supabase } from '@/lib/supabase-client';
import type { SiteSettings } from '@/lib/types';

const TABS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'brand', label: 'Brand', icon: ImageIcon },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'social', label: 'Social', icon: Share2 },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'banners', label: 'Banners', icon: Bell },
  { id: 'legal', label: 'Legal', icon: FileText },
  { id: 'maintenance', label: 'Maintenance', icon: SettingsIcon },
];

export default function SettingsPage() {
  const { showToast, Toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      if (data) setSettings(data as SiteSettings);
    } catch (err: any) {
      setError(err?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const { id, created_at, updated_at, ...content } = settings;
      const { error } = await supabase.from('site_settings').update({ ...content, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error) throw error;
      setSuccess(true);
      showToast('Settings saved successfully');
      setTimeout(() => setSuccess(false), 3000);
      loadSettings();
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateSocial = (platform: string, value: string) => {
    setSettings(prev => prev ? { ...prev, social_links: { ...prev.social_links, [platform]: value } } : null);
  };

  const updateBusinessHours = (key: string, value: string) => {
    setSettings(prev => prev ? { ...prev, business_hours: { ...prev.business_hours, [key]: value } } : null);
  };

  const updateHeroStats = (key: string, value: string) => {
    setSettings(prev => prev ? { ...prev, hero_stats: { ...prev.hero_stats, [key]: value } } : null);
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminShell>
    );
  }

  if (!settings) {
    return (
      <AdminShell>
        <AdminCard>
          <p className="text-muted-foreground">Failed to load settings. Please try again.</p>
        </AdminCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Toast />
      <AdminSectionHeader
        title="Website Settings"
        description="Manage all website content, branding, and configuration"
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'gradient-accent text-white shadow-glow'
                : 'bg-white border border-black/10 text-black/60 hover:bg-black/5'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4"><FormErrorBanner message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><FormSuccess message="Settings saved successfully" onClose={() => setSuccess(false)} /></div>}

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeTab === 'general' && (
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-6">General Information</h3>
            <div className="space-y-5">
              <FormInput
                label="Website Name"
                value={settings.business_name}
                onChange={(e) => update('business_name', e.target.value)}
              />
              <FormInput
                label="Brand Tagline"
                value={settings.brand_tagline || ''}
                onChange={(e) => update('brand_tagline', e.target.value)}
                hint="Short catchy phrase shown in headers"
              />
              <FormTextarea
                label="Brand Description"
                value={settings.brand_description || ''}
                onChange={(e) => update('brand_description', e.target.value)}
                rows={3}
              />
              <FormInput
                label="Copyright Text"
                value={settings.copyright_text}
                onChange={(e) => update('copyright_text', e.target.value)}
              />
            </div>
          </AdminCard>
        )}

        {activeTab === 'brand' && (
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-6">Brand Assets</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-black/70 mb-1.5 block">Website Logo</label>
                <ImageUpload
                  value={settings.logo_url || ''}
                  onChange={(url) => update('logo_url', url)}
                  bucket="website-assets"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-black/70 mb-1.5 block">Favicon</label>
                <ImageUpload
                  value={settings.favicon_url || ''}
                  onChange={(url) => update('favicon_url', url)}
                  bucket="website-assets"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-black/70 mb-1.5 block">Homepage Banner Image</label>
                <ImageUpload
                  value={settings.homepage_banner_image || ''}
                  onChange={(url) => update('homepage_banner_image', url)}
                  bucket="website-assets"
                  accept="image/*"
                />
              </div>
            </div>
          </AdminCard>
        )}

        {activeTab === 'contact' && (
          <>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Business Contact</h3>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput label="Phone Number" value={settings.phone} onChange={(e) => update('phone', e.target.value)} />
                  <FormInput label="WhatsApp Number" value={settings.whatsapp_number || ''} onChange={(e) => update('whatsapp_number', e.target.value)} />
                </div>
                <FormInput label="Email Address" type="email" value={settings.email} onChange={(e) => update('email', e.target.value)} />
                <FormTextarea label="Business Address" value={settings.address} onChange={(e) => update('address', e.target.value)} rows={2} />
                <FormInput label="Google Maps Link" value={settings.google_maps_link} onChange={(e) => update('google_maps_link', e.target.value)} />
              </div>
            </AdminCard>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Business Hours</h3>
              <div className="space-y-4">
                <FormInput label="Monday - Saturday" value={settings.business_hours?.mon_sat || ''} onChange={(e) => updateBusinessHours('mon_sat', e.target.value)} />
                <FormInput label="Sunday" value={settings.business_hours?.sunday || ''} onChange={(e) => updateBusinessHours('sunday', e.target.value)} />
              </div>
            </AdminCard>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Homepage Stats</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormInput label="Members" value={settings.hero_stats?.members || ''} onChange={(e) => updateHeroStats('members', e.target.value)} />
                <FormInput label="Trainers" value={settings.hero_stats?.trainers || ''} onChange={(e) => updateHeroStats('trainers', e.target.value)} />
                <FormInput label="Classes" value={settings.hero_stats?.classes || ''} onChange={(e) => updateHeroStats('classes', e.target.value)} />
                <FormInput label="Years" value={settings.hero_stats?.years || ''} onChange={(e) => updateHeroStats('years', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <FormInput label="Google Rating" value={settings.google_rating} onChange={(e) => update('google_rating', e.target.value)} />
                <FormInput label="Review Count" value={settings.google_review_count} onChange={(e) => update('google_review_count', e.target.value)} />
              </div>
            </AdminCard>
          </>
        )}

        {activeTab === 'social' && (
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-6">Social Media Links</h3>
            <div className="space-y-5">
              <FormInput label="Instagram" value={settings.social_links?.instagram || ''} onChange={(e) => updateSocial('instagram', e.target.value)} placeholder="https://instagram.com/..." />
              <FormInput label="Facebook" value={settings.social_links?.facebook || ''} onChange={(e) => updateSocial('facebook', e.target.value)} placeholder="https://facebook.com/..." />
              <FormInput label="YouTube" value={settings.social_links?.youtube || ''} onChange={(e) => updateSocial('youtube', e.target.value)} placeholder="https://youtube.com/..." />
              <FormInput label="LinkedIn" value={settings.social_links?.linkedin || ''} onChange={(e) => updateSocial('linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
              <FormInput label="Twitter / X" value={settings.social_links?.twitter || ''} onChange={(e) => updateSocial('twitter', e.target.value)} placeholder="https://twitter.com/..." />
            </div>
          </AdminCard>
        )}

        {activeTab === 'seo' && (
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-6">SEO Default Settings</h3>
            <div className="space-y-5">
              <FormInput label="Default Meta Title" value={settings.seo_meta_title} onChange={(e) => update('seo_meta_title', e.target.value)} />
              <FormTextarea label="Default Meta Description" value={settings.seo_meta_description} onChange={(e) => update('seo_meta_description', e.target.value)} rows={3} />
            </div>
          </AdminCard>
        )}

        {activeTab === 'banners' && (
          <>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Announcement Bar</h3>
              <div className="space-y-5">
                <FormToggle
                  label="Enable Announcement Bar"
                  description="Show a scrolling announcement bar at the top of the website"
                  checked={settings.announcement_bar_enabled}
                  onChange={(v) => update('announcement_bar_enabled', v)}
                />
                <FormInput label="Announcement Text" value={settings.announcement_bar_text || ''} onChange={(e) => update('announcement_bar_text', e.target.value)} />
                <FormInput label="Announcement Link" value={settings.announcement_bar_link || ''} onChange={(e) => update('announcement_bar_link', e.target.value)} placeholder="https://..." />
              </div>
            </AdminCard>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Promotional Banner</h3>
              <div className="space-y-5">
                <FormToggle
                  label="Enable Promotional Banner"
                  description="Show a promotional banner on the homepage"
                  checked={settings.promotional_banner_enabled}
                  onChange={(v) => update('promotional_banner_enabled', v)}
                />
                <FormInput label="Promotional Text" value={settings.promotional_banner_text || ''} onChange={(e) => update('promotional_banner_text', e.target.value)} />
                <FormInput label="Promotional Link" value={settings.promotional_banner_link || ''} onChange={(e) => update('promotional_banner_link', e.target.value)} placeholder="https://..." />
              </div>
            </AdminCard>
          </>
        )}

        {activeTab === 'legal' && (
          <>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Privacy Policy</h3>
              <FormTextarea
                label="Privacy Policy Content"
                value={settings.privacy_policy || ''}
                onChange={(e) => update('privacy_policy', e.target.value)}
                rows={8}
                hint="Supports plain text. HTML rendering will be available in Phase 2."
              />
            </AdminCard>
            <AdminCard>
              <h3 className="font-display text-lg font-semibold mb-6">Terms &amp; Conditions</h3>
              <FormTextarea
                label="Terms & Conditions Content"
                value={settings.terms_conditions || ''}
                onChange={(e) => update('terms_conditions', e.target.value)}
                rows={8}
                hint="Supports plain text. HTML rendering will be available in Phase 2."
              />
            </AdminCard>
          </>
        )}

        {activeTab === 'maintenance' && (
          <AdminCard>
            <h3 className="font-display text-lg font-semibold mb-6">Maintenance Mode</h3>
            <div className="space-y-5">
              <FormToggle
                label="Enable Maintenance Mode"
                description="When enabled, visitors see a maintenance page instead of the website"
                checked={settings.maintenance_mode}
                onChange={(v) => update('maintenance_mode', v)}
              />
              <FormTextarea
                label="Maintenance Message"
                value={settings.maintenance_message || ''}
                onChange={(e) => update('maintenance_message', e.target.value)}
                rows={3}
                placeholder="We'll be back soon!"
              />
            </div>
          </AdminCard>
        )}

        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full gradient-accent text-white px-6 h-12 text-sm font-semibold shadow-glow hover:shadow-2xl transition-all disabled:opacity-60"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Settings</>}
          </button>
        </div>
      </motion.div>
    </AdminShell>
  );
}
