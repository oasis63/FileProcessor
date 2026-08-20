'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileStack, Image, FileText, Moon, Sun, Menu, X, Zap, Video, Headphones } from 'lucide-react';

export function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            FileProcessor
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="/#pdf-tools" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
            <FileText className="w-4 h-4" /> PDF Tools
          </Link>
          <Link href="/#image-tools" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Image className="w-4 h-4" /> Image Tools
          </Link>
          <Link href="/#media-tools" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 transition-colors">
            <Video className="w-4 h-4 text-purple-500" /> Media Tools
          </Link>
          <Link href="/video-to-audio" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-2 transition-colors bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/50">
            <Headphones className="w-4 h-4 text-purple-500" /> Video to Audio
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link
            href="/compress-pdf"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pt-2 pb-6 space-y-3">
          <Link href="/#pdf-tools" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">
            PDF Tools
          </Link>
          <Link href="/#image-tools" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">
            Image Tools
          </Link>
          <Link href="/#media-tools" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 text-purple-600 dark:text-purple-400">
            Media & Audio Tools
          </Link>
          <Link href="/video-to-audio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-purple-600 dark:text-purple-400">
            Video to Audio Converter
          </Link>
          <Link href="/compress-pdf" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">
            Compress PDF
          </Link>
          <Link href="/compress-image" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">
            Compress Image
          </Link>
        </div>
      )}
    </header>
  );
}
