import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Brand primary: teal #0f766e — must match Logo.tsx fill-primary
const PRIMARY = '#0f766e';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
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
            top: 9,
            left: 7,
            width: 18,
            height: 3,
            borderRadius: 2,
            background: 'white',
          }}
        />
        {/* T — vertical bar */}
        <div
          style={{
            position: 'absolute',
            top: 9,
            left: 14.5,
            width: 3,
            height: 14,
            borderRadius: 2,
            background: 'white',
          }}
        />
        {/* Accent dot — white/60 */}
        <div
          style={{
            position: 'absolute',
            top: 7,
            right: 6,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
