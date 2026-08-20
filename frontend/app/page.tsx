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
  Zap,
  RotateCw,
  Sparkles,
  FileStack,
  Crop,
  Layers,
  Headphones,
  Video
} from 'lucide-react';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { setPendingFiles } from '@/lib/pending-files';

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

  const pdfTools = [
    { title: 'Compress PDF', desc: 'Reduce PDF file size while maintaining high quality', icon: Minimize2, href: '/compress-pdf', badge: 'Popular' },
    { title: 'Merge PDF', desc: 'Combine multiple PDF documents into one single file', icon: Merge, href: '/merge-pdf' },
    { title: 'Split PDF', desc: 'Separate PDF pages into individual documents', icon: Split, href: '/split-pdf' },
    { title: 'PDF to JPG', desc: 'Convert PDF pages into high-resolution JPG images', icon: ImageIcon, href: '/pdf-to-jpg' },
    { title: 'JPG to PDF', desc: 'Convert images into a unified PDF document', icon: FileText, href: '/jpg-to-pdf' },
    { title: 'Protect PDF', desc: 'Encrypt your PDF files with password protection', icon: Lock, href: '/protect-pdf' },
    { title: 'Rotate PDF', desc: 'Turn PDF pages 90, 180, or 270 degrees', icon: RotateCw, href: '/rotate-pdf' },
    { title: 'Remove PDF Metadata', desc: 'Strip author, title, and tracking tags from PDFs', icon: Shield, href: '/remove-pdf-metadata' },
  ];

  const imageTools = [
    { title: 'Compress Image', desc: 'Shrink JPG, PNG, WebP, HEIC size without losing quality', icon: Minimize2, href: '/compress-image', badge: 'Popular' },
    { title: 'Resize Image', desc: 'Change dimensions for Instagram, LinkedIn, or Web', icon: Layers, href: '/resize-image' },
    { title: 'Crop Image', desc: 'Crop rectangular regions from images', icon: Crop, href: '/crop-image' },
    { title: 'JPG to WebP', desc: 'Convert JPG photos to modern WebP format', icon: Sparkles, href: '/jpg-to-webp' },
    { title: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to standard JPG', icon: RotateCw, href: '/heic-to-jpg' },
    { title: 'Image to PDF', desc: 'Convert images into a clean PDF document', icon: FileStack, href: '/jpg-to-pdf' },
    { title: 'Remove Image Metadata', desc: 'Strip EXIF, GPS, and camera data from photos', icon: Shield, href: '/remove-image-metadata' },
  ];

  const mediaTools = [
    { title: 'Video to Audio', desc: 'Extract high-quality MP3, WAV, or AAC audio from video files', icon: Headphones, href: '/video-to-audio', badge: 'NEW' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Engine 2.0
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
            What do you want to do with your file?
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Solve any PDF, image, or video conversion task in seconds. Ultra-fast, private, and simple.
          </p>

          {/* Quick Upload Dropzone */}
          <div className="max-w-3xl mx-auto">
            <FileDropzone
              accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,.avi,.mkv,.webm,.flv,.wmv"
              multiple={true}
              files={droppedFiles}
              onFilesSelected={handleFilesDropped}
              onRemoveFile={(idx) => setDroppedFiles(droppedFiles.filter((_, i) => i !== idx))}
            />
          </div>

          {/* Key Value Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-medium text-gray-500 dark:text-gray-400 pt-4">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Sub-second Processing</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> Automatic File Deletion</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-blue-500" /> Zero Quality Loss</span>
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section id="pdf-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Tools</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Compress, merge, split, and edit PDFs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfTools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                Open Tool <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Image Tools Section */}
      <section id="image-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Image Tools</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Compress, resize, crop, and convert images</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageTools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                Open Tool <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Media Tools Section */}
      <section id="media-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Media & Audio Tools</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Extract audio, convert video formats, and optimize sound tracks</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaTools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                Open Tool <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
