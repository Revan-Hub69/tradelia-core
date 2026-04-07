import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const PRIMARY = '#0f766e';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: PRIMARY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* T — horizontal bar */}
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 38,
            width: 104,
            height: 16,
            borderRadius: 8,
            background: 'white',
          }}
        />
        {/* T — vertical bar */}
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 82,
            width: 16,
            height: 76,
            borderRadius: 8,
            background: 'white',
          }}
        />
        {/* Accent dot — white/60 */}
        <div
          style={{
            position: 'absolute',
            top: 38,
            right: 38,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
