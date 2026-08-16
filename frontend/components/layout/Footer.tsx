import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Lock, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">FileProcessor</span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              The fastest and easiest place on the internet to solve any PDF or image problem. Built with privacy-first principles.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-emerald-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> SSL Encrypted</span>
              <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Auto-Delete</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">PDF Utilities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/compress-pdf" className="hover:text-blue-600 dark:hover:text-blue-400">Compress PDF</Link></li>
              <li><Link href="/merge-pdf" className="hover:text-blue-600 dark:hover:text-blue-400">Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="hover:text-blue-600 dark:hover:text-blue-400">Split PDF</Link></li>
              <li><Link href="/pdf-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400">PDF to JPG</Link></li>
              <li><Link href="/jpg-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400">JPG to PDF</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Image Utilities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/compress-image" className="hover:text-blue-600 dark:hover:text-blue-400">Compress Image</Link></li>
              <li><Link href="/resize-image" className="hover:text-blue-600 dark:hover:text-blue-400">Resize Image</Link></li>
              <li><Link href="/crop-image" className="hover:text-blue-600 dark:hover:text-blue-400">Crop Image</Link></li>
              <li><Link href="/jpg-to-webp" className="hover:text-blue-600 dark:hover:text-blue-400">JPG to WebP</Link></li>
              <li><Link href="/heic-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400">HEIC to JPG</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Platform & Security</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-500" /> High-Speed Go Engine</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
              <li><span>API Documentation</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FileProcessor Inc. All rights reserved. Files are processed securely and deleted automatically.
        </div>
      </div>
    </footer>
  );
}
