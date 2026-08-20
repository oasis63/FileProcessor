import { ImageResponse } from 'next/og';

export const alt = 'FileProcessor — free PDF, image, and video tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#111213',
          color: '#eeeff1',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: '#2F5D6A',
              borderRadius: 6,
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 600 }}>FileProcessor</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
            Free PDF, image, and video tools
          </div>
          <div style={{ fontSize: 24, color: '#9aa0a6' }}>
            Compress, convert, merge, extract. No account. Files deleted after 60 minutes.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
