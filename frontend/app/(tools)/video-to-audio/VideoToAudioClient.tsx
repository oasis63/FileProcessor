'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Music, Sliders, Zap, Clock } from 'lucide-react';

export function VideoToAudioClient() {
  const optionsComponent = (
    options: Record<string, any>,
    setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>
  ) => {
    const selectedFormat = options.outputFormat || 'mp3';
    const selectedBitrate = options.bitrate || '192k';

    const formats = [
      { id: 'mp3', label: 'MP3', desc: 'Universal audio format' },
      { id: 'wav', label: 'WAV', desc: 'Uncompressed audio' },
      { id: 'aac', label: 'AAC', desc: 'High efficiency codec' },
      { id: 'm4a', label: 'M4A', desc: 'Apple audio format' },
      { id: 'flac', label: 'FLAC', desc: 'Lossless audio' },
      { id: 'ogg', label: 'OGG', desc: 'Open web audio' },
    ];

    const bitrates = [
      { id: '128k', label: '128 kbps', desc: 'Speech / Voice' },
      { id: '192k', label: '192 kbps', desc: 'Recommended' },
      { id: '320k', label: '320 kbps', desc: 'Studio Quality' },
      { id: 'copy', label: 'Direct Stream Copy', desc: 'Ultra Fast (No Re-encode)' },
    ];

    return (
      <div className="space-y-6 text-sm">
        {/* Output Format Selector */}
        <div className="space-y-3">
          <label className="font-semibold text-gray-800 dark:text-gray-200 text-xs flex items-center gap-1.5">
            <Music className="w-4 h-4 text-blue-500" /> Audio Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {formats.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setOptions({ ...options, outputFormat: fmt.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedFormat === fmt.id
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <p className="text-xs font-bold">{fmt.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{fmt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Quality / Bitrate Selector */}
        {selectedFormat !== 'wav' && selectedFormat !== 'flac' && (
          <div className="space-y-3 pt-2">
            <label className="font-semibold text-gray-800 dark:text-gray-200 text-xs flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-500" /> Audio Quality / Bitrate
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {bitrates.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setOptions({ ...options, bitrate: b.id })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedBitrate === b.id
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">{b.label}</p>
                    {b.id === 'copy' && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{b.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp Audio Clipping (Optional) */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="font-semibold text-gray-800 dark:text-gray-200 text-xs flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-500" /> Trim Audio Clip (Optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                Start Time (HH:MM:SS)
              </label>
              <input
                type="text"
                placeholder="00:00:00"
                value={options.startTime || ''}
                onChange={(e) => setOptions({ ...options, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                End Time (HH:MM:SS)
              </label>
              <input
                type="text"
                placeholder="00:02:30"
                value={options.endTime || ''}
                onChange={(e) => setOptions({ ...options, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="video-to-audio"
      title="Video to Audio Converter"
      description="Extract high-quality audio tracks or MP3s from your video files instantly."
      accept=".mp4,.mov,.avi,.mkv,.webm,.flv,.wmv,.3gp,video/*"
      optionsComponent={optionsComponent}
      initialOptions={{ outputFormat: 'mp3', bitrate: '192k' }}
      seoContent={{
        howItWorks: [
          { step: 'Select Video', text: 'Upload your video file (MP4, MOV, MKV, AVI, WEBM, FLV).' },
          { step: 'Choose Options', text: 'Select output format (MP3, WAV, AAC) and desired bitrate.' },
          { step: 'Download Audio', text: 'Save your extracted audio track instantly to your device.' },
        ],
        faqs: [
          {
            q: 'Can I extract audio without losing sound quality?',
            a: 'Yes! Select 320 kbps for high bitrate encoding, or choose WAV/FLAC for completely uncompressed, studio-quality sound.',
          },
          {
            q: 'What is Direct Stream Copy mode?',
            a: 'Direct Stream Copy extracts the existing audio track directly out of the video file container without re-encoding, finishing in milliseconds with zero quality loss.',
          },
          {
            q: 'Is my uploaded video secure?',
            a: 'All files are processed in isolated memory and automatically destroyed within 60 minutes.',
          },
        ],
      }}
    />
  );
}
