'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { siteConfig } from '@/lib/site-config';
import type { SiteSettings } from '@/lib/types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        if (mounted && data) setSettings(data as SiteSettings);
      } catch {
        // ignore — use fallback
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const business = {
    name: settings?.business_name || siteConfig.business.name,
    tagline: settings?.brand_tagline || siteConfig.business.tagline,
    phone: settings?.phone || siteConfig.business.phone,
    phoneRaw: (settings?.phone || siteConfig.business.phoneRaw).replace(/\s/g, ''),
    email: settings?.email || siteConfig.business.email,
    address: settings?.address || siteConfig.business.address,
    addressShort: (settings?.address || siteConfig.business.addressShort).split(',').slice(0, 3).join(','),
    mapsLink: settings?.google_maps_link || siteConfig.business.mapsLink,
    mapsEmbed: siteConfig.business.mapsEmbed,
    hours: {
      monSat: settings?.business_hours?.mon_sat || siteConfig.business.hours.monSat,
      sunday: settings?.business_hours?.sunday || siteConfig.business.hours.sunday,
    },
    whatsapp: settings?.whatsapp_number || '',
  };

  const social = {
    instagram: settings?.social_links?.instagram || siteConfig.social.instagram,
    facebook: settings?.social_links?.facebook || siteConfig.social.facebook,
    youtube: settings?.social_links?.youtube || siteConfig.social.youtube,
    linkedin: settings?.social_links?.linkedin || siteConfig.social.linkedin,
    twitter: settings?.social_links?.twitter || siteConfig.social.twitter,
  };

  const stats = {
    members: settings?.hero_stats?.members || siteConfig.stats.members,
    trainers: settings?.hero_stats?.trainers || siteConfig.stats.trainers,
    classes: settings?.hero_stats?.classes || siteConfig.stats.classes,
    years: settings?.hero_stats?.years || siteConfig.stats.years,
  };

  const rating = {
    value: settings?.google_rating || siteConfig.rating.value,
    count: settings?.google_review_count || siteConfig.rating.count,
  };

  const seo = {
    title: settings?.seo_meta_title || siteConfig.seo.title,
    description: settings?.seo_meta_description || siteConfig.seo.description,
  };

  const banners = {
    announcementEnabled: settings?.announcement_bar_enabled || false,
    announcementText: settings?.announcement_bar_text || '',
    announcementLink: settings?.announcement_bar_link || '',
    promoEnabled: settings?.promotional_banner_enabled || false,
    promoText: settings?.promotional_banner_text || '',
    promoLink: settings?.promotional_banner_link || '',
  };

  const branding = {
    logoUrl: settings?.logo_url || '',
    faviconUrl: settings?.favicon_url || '',
    bannerImage: settings?.homepage_banner_image || '',
    copyright: settings?.copyright_text || `© ${new Date().getFullYear()} ${business.name}. All rights reserved.`,
  };

  return { settings, loading, business, social, stats, rating, seo, banners, branding };
}
