'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Search, Trash2, Download, Eye, X, Image as ImageIcon,
  FileText, Video, File, Folder, ChevronRight, Loader2, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/components/admin/form-system';
import type { MediaAsset } from '@/lib/types';

const BUCKETS = [
  { id: 'website-assets', label: 'Website Assets', icon: ImageIcon },
  { id: 'trainer-images', label: 'Trainer Images', icon: ImageIcon },
  { id: 'gallery-images', label: 'Gallery Images', icon: ImageIcon },
  { id: 'blog-images', label: 'Blog Images', icon: ImageIcon },
  { id: 'facility-images', label: 'Facility Images', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'documents', label: 'Documents', icon: FileText },
];

function getFileIcon(mimeType?: string) {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType === 'application/pdf') return FileText;
  return File;
}

function formatBytes(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileManager() {
  const { showToast, Toast } = useToast();
  const [activeBucket, setActiveBucket] = useState('website-assets');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('bucket', activeBucket)
        .ilike('name', `%${search}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [activeBucket, search]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from(activeBucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(activeBucket)
          .getPublicUrl(filePath);

        let width: number | undefined;
        let height: number | undefined;
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
          width = img.naturalWidth;
          height = img.naturalHeight;
        }

        const { error: dbError } = await supabase.from('media_library').insert({
          name: file.name,
          url: publicUrl,
          thumbnail_url: file.type.startsWith('image/') ? publicUrl : null,
          bucket: activeBucket,
          folder: '/',
          mime_type: file.type,
          size_bytes: file.size,
          width,
          height,
        });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);
      showToast(`${files.length} file(s) uploaded successfully`);
      loadAssets();
    } catch (err: any) {
      showToast(err?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    try {
      const filePath = asset.url.split(`/${asset.bucket}/`)[1];
      if (filePath) {
        await supabase.storage.from(activeBucket).remove([filePath]);
      }
      await supabase.from('media_library').delete().eq('id', asset.id);
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      showToast('File deleted');
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const handleBulkDelete = async () => {
    const toDelete = assets.filter(a => selected.has(a.id));
    try {
      for (const asset of toDelete) {
        const filePath = asset.url.split(`/${asset.bucket}/`)[1];
        if (filePath) await supabase.storage.from(activeBucket).remove([filePath]);
      }
      await supabase.from('media_library').delete().in('id', Array.from(selected));
      setAssets(prev => prev.filter(a => !selected.has(a.id)));
      setSelected(new Set());
      showToast(`${toDelete.length} files deleted`);
    } catch {
      showToast('Bulk delete failed', 'error');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <Toast />

      {/* Bucket tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {BUCKETS.map((bucket) => (
          <button
            key={bucket.id}
            onClick={() => { setActiveBucket(bucket.id); setSelected(new Set()); }}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
              activeBucket === bucket.id
                ? 'gradient-accent text-white shadow-glow'
                : 'bg-white border border-black/10 text-black/60 hover:bg-black/5'
            )}
          >
            <bucket.icon className="h-4 w-4" />
            {bucket.label}
          </button>
        ))}
      </div>

      {/* Search + Upload */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-full border border-black/10 bg-white pl-9 pr-4 h-10 text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full gradient-accent text-white px-5 h-10 text-sm font-semibold hover:shadow-glow transition-all disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-3"
          >
            <span className="text-sm font-semibold text-red-700">{selected.size} selected</span>
            <button onClick={handleBulkDelete} className="ml-auto flex items-center gap-1.5 rounded-full bg-red-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-600 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())} className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/20 transition-colors">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        className={cn(
          'rounded-3xl border-2 border-dashed p-8 text-center transition-all',
          dragOver ? 'border-accent bg-accent/5' : 'border-black/10 bg-white'
        )}
      >
        <Upload className={cn('h-10 w-10 mx-auto mb-3', dragOver ? 'text-accent' : 'text-black/20')} />
        <p className="text-sm text-muted-foreground">
          Drag &amp; drop files here, or click <button onClick={() => fileInputRef.current?.click()} className="text-accent font-semibold hover:underline">browse</button>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">Supports multiple file upload</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square shimmer rounded-2xl" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No files in this bucket yet. Upload some files to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => {
            const Icon = getFileIcon(asset.mime_type);
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'group relative rounded-2xl border border-black/[0.06] bg-white overflow-hidden cursor-pointer transition-all',
                  selected.has(asset.id) && 'ring-2 ring-accent'
                )}
                onClick={() => toggleSelect(asset.id)}
              >
                <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden">
                  {asset.mime_type?.startsWith('image/') ? (
                    <img src={asset.url} alt={asset.alt_text || asset.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <Icon className="h-10 w-10 text-black/30" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{asset.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatBytes(asset.size_bytes)}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewAsset(asset); }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(asset); }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {selected.has(asset.id) && (
                  <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreviewAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-3xl bg-white p-6 max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold truncate">{previewAsset.name}</h3>
                <button onClick={() => setPreviewAsset(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {previewAsset.mime_type?.startsWith('image/') ? (
                <img src={previewAsset.url} alt={previewAsset.alt_text || previewAsset.name} className="w-full rounded-2xl mb-4" />
              ) : previewAsset.mime_type?.startsWith('video/') ? (
                <video src={previewAsset.url} controls className="w-full rounded-2xl mb-4" />
              ) : (
                <div className="flex items-center justify-center h-48 bg-secondary/30 rounded-2xl mb-4">
                  <File className="h-12 w-12 text-black/30" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Type:</span> {previewAsset.mime_type || 'N/A'}</div>
                <div><span className="text-muted-foreground">Size:</span> {formatBytes(previewAsset.size_bytes)}</div>
                {previewAsset.width && <div><span className="text-muted-foreground">Dimensions:</span> {previewAsset.width}×{previewAsset.height}</div>}
                <div><span className="text-muted-foreground">Bucket:</span> {previewAsset.bucket}</div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">URL:</span>
                  <input readOnly value={previewAsset.url} className="w-full mt-1 rounded-xl border border-black/10 px-3 py-2 text-xs" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <a href={previewAsset.url} download className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold hover:bg-black/10 transition-colors">
                  <Download className="h-4 w-4" /> Download
                </a>
                <button onClick={() => handleDelete(previewAsset)} className="ml-auto inline-flex items-center gap-2 rounded-full bg-red-500 text-white px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
