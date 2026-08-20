'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Image, Video, Moon, Sun, Menu, X } from 'lucide-react';
import { BrandLockup } from './BrandMark';

export function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (typeof document !== 'undefined') {
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const navClass =
    'text-sm font-medium text-ink-muted dark:text-paper/70 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-2';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-paper-line dark:border-night-border bg-paper dark:bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <BrandLockup />

        <nav className="hidden md:flex items-center space-x-7">
          <Link href="/#pdf-tools" className={navClass}>
            <FileText className="w-4 h-4" /> PDF
          </Link>
          <Link href="/#image-tools" className={navClass}>
            <Image className="w-4 h-4" /> Images
          </Link>
          <Link href="/#media-tools" className={navClass}>
            <Video className="w-4 h-4" /> Media
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md border border-paper-line dark:border-night-border text-ink-muted dark:text-paper/70 hover:bg-paper-muted dark:hover:bg-night-raised"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/compress-pdf"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 rounded-md"
          >
            Open a tool
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-ink-muted dark:text-paper/70 hover:bg-paper-muted dark:hover:bg-night-raised"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-paper-line dark:border-night-border bg-paper dark:bg-night px-4 pt-2 pb-5 space-y-2">
          <Link href="/#pdf-tools" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium">
            PDF tools
          </Link>
          <Link href="/#image-tools" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium">
            Image tools
          </Link>
          <Link href="/#media-tools" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium">
            Media tools
          </Link>
        </div>
      )}
    </header>
  );
}
