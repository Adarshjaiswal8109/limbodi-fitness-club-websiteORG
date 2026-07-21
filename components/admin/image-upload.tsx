'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase-client';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  accept?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = 'website-assets',
  accept = 'image/*',
  label,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [bucket, onChange]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isVideo = accept.includes('video');
  const Icon = isVideo ? ImageIcon : ImageIcon;

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value ? (
        <div className="relative group rounded-2xl border border-black/10 bg-white overflow-hidden">
          {isVideo ? (
            <video src={value} controls className="w-full h-40 object-cover" />
          ) : (
            <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          )}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
              title="Replace"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-red-500 hover:text-white transition-colors"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2 bg-secondary/30">
            <p className="text-xs text-muted-foreground truncate">{value.split('/').pop()}</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all',
            dragOver ? 'border-accent bg-accent/5' : 'border-black/10 bg-white hover:border-accent/50 hover:bg-accent/5'
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-accent animate-spin mb-2" />
          ) : (
            <Icon className="h-8 w-8 text-black/30 mb-2" />
          )}
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Uploading...' : `Click to upload or drag & drop`}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {isVideo ? 'MP4, WebM up to 100MB' : 'PNG, JPG, WebP up to 10MB'}
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
