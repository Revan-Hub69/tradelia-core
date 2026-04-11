import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

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
