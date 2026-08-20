'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Image as ImageIcon,
  Minimize2,
  Merge,
  Split,
  Lock,
  ArrowRight,
  Shield,
  Clock,
  RotateCw,
  Repeat,
  FileStack,
  Crop,
  Layers,
  Headphones,
  type LucideIcon,
} from 'lucide-react';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { setPendingFiles } from '@/lib/pending-files';

type ToolCardData = {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
};

function ToolCard({ tool }: { tool: ToolCardData }) {
  return (
    <Link
      href={tool.href}
      className="group p-5 rounded-md border border-paper-line dark:border-night-border bg-paper-raised dark:bg-night-raised hover:border-brand-600 flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <tool.icon className="w-5 h-5 text-brand-700 dark:text-brand-400" />
          {tool.badge && (
            <span className="text-[10px] uppercase tracking-widest font-semibold text-ink-faint">
              {tool.badge}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink dark:text-paper group-hover:text-brand-700 dark:group-hover:text-brand-300">
            {tool.title}
          </h3>
          <p className="text-sm text-ink-muted dark:text-paper/60 mt-1 leading-relaxed">{tool.desc}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center text-xs font-semibold text-brand-700 dark:text-brand-400">
        Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleFilesDropped = (files: File[]) => {
    setDroppedFiles(files);
    if (files.length > 0) {
      const first = files[0];
      setPendingFiles(files);
      if (first.type.includes('pdf') || first.name.toLowerCase().endsWith('.pdf')) {
        router.push('/compress-pdf');
      } else if (first.type.includes('video') || /\.(mp4|mov|avi|mkv|webm|flv|wmv|3gp)$/i.test(first.name)) {
        router.push('/video-to-audio');
      } else if (/\.(heic|heif)$/i.test(first.name)) {
        router.push('/heic-to-jpg');
      } else {
        router.push('/compress-image');
      }
    }
  };

  const pdfTools: ToolCardData[] = [
    { title: 'Compress PDF', desc: 'Reduce PDF file size while keeping text readable', icon: Minimize2, href: '/compress-pdf', badge: 'Often used' },
    { title: 'Merge PDF', desc: 'Combine several PDFs into one document', icon: Merge, href: '/merge-pdf' },
    { title: 'Split PDF', desc: 'Separate pages into individual files', icon: Split, href: '/split-pdf' },
    { title: 'PDF to JPG', desc: 'Export pages as JPEG images', icon: ImageIcon, href: '/pdf-to-jpg' },
    { title: 'JPG to PDF', desc: 'Turn photos into a single PDF', icon: FileText, href: '/jpg-to-pdf' },
    { title: 'Protect PDF', desc: 'Encrypt a PDF with a password', icon: Lock, href: '/protect-pdf' },
    { title: 'Rotate PDF', desc: 'Turn pages 90, 180, or 270 degrees', icon: RotateCw, href: '/rotate-pdf' },
    { title: 'Remove PDF Metadata', desc: 'Strip author and title fields', icon: Shield, href: '/remove-pdf-metadata' },
  ];

  const imageTools: ToolCardData[] = [
    { title: 'Compress Image', desc: 'Shrink JPG, PNG, WebP, and HEIC files', icon: Minimize2, href: '/compress-image', badge: 'Often used' },
    { title: 'Resize Image', desc: 'Change dimensions for web or social posts', icon: Layers, href: '/resize-image' },
    { title: 'Crop Image', desc: 'Cut a rectangular region from a photo', icon: Crop, href: '/crop-image' },
    { title: 'JPG to WebP', desc: 'Convert JPEG photos to WebP', icon: Repeat, href: '/jpg-to-webp' },
    { title: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to JPEG', icon: RotateCw, href: '/heic-to-jpg' },
    { title: 'Image to PDF', desc: 'Place images on PDF pages', icon: FileStack, href: '/jpg-to-pdf' },
    { title: 'Remove Image Metadata', desc: 'Strip EXIF and GPS tags', icon: Shield, href: '/remove-image-metadata' },
  ];

  const mediaTools: ToolCardData[] = [
    { title: 'Video to Audio', desc: 'Extract MP3, WAV, or AAC from a video', icon: Headphones, href: '/video-to-audio' },
  ];

  return (
    <div className="space-y-16 pb-20">
      <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 border-b border-paper-line dark:border-night-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-ink-faint">
            Local-style tools · files deleted after one hour
          </p>

          <h1 className="font-display text-4xl sm:text-[3.25rem] font-semibold tracking-tight text-ink dark:text-paper max-w-3xl mx-auto leading-[1.15]">
            What do you want to do with your file?
          </h1>

          <p className="text-lg text-ink-muted dark:text-paper/70 max-w-xl mx-auto">
            Compress, convert, merge, or extract — without creating an account.
          </p>

          <div className="max-w-3xl mx-auto text-left">
            <FileDropzone
              accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,.avi,.mkv,.webm,.flv,.wmv"
              multiple={true}
              files={droppedFiles}
              onFilesSelected={handleFilesDropped}
              onRemoveFile={(idx) => setDroppedFiles(droppedFiles.filter((_, i) => i !== idx))}
            />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-sm text-ink-muted dark:text-paper/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" /> Typical jobs finish in seconds
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-600" /> Automatic deletion after 60 minutes
            </span>
          </div>
        </div>
      </section>

      <section id="pdf-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-paper-line dark:border-night-border pb-3">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-faint">
            Documents
          </p>
          <h2 className="font-display text-3xl text-ink dark:text-paper mt-1">PDF tools</h2>
          <p className="text-sm text-ink-muted dark:text-paper/60 mt-1">Compress, merge, split, rotate, and protect PDFs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section id="image-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-paper-line dark:border-night-border pb-3">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-faint">
            Photos
          </p>
          <h2 className="font-display text-3xl text-ink dark:text-paper mt-1">Image tools</h2>
          <p className="text-sm text-ink-muted dark:text-paper/60 mt-1">Compress, resize, crop, and convert images</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section id="media-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-paper-line dark:border-night-border pb-3">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-faint">
            Sound
          </p>
          <h2 className="font-display text-3xl text-ink dark:text-paper mt-1">Media tools</h2>
          <p className="text-sm text-ink-muted dark:text-paper/60 mt-1">Pull audio out of a video file</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
