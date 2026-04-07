import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#1D4ED8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 40,
            width: 100,
            height: 16,
            borderRadius: 8,
            background: 'white',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 82,
            width: 16,
            height: 72,
            borderRadius: 8,
            background: 'white',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 42,
            right: 38,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#059669',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
