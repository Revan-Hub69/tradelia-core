import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#1D4ED8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* T horizontal bar */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 7,
            width: 18,
            height: 3,
            borderRadius: 2,
            background: 'white',
          }}
        />
        {/* T vertical bar */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 14.5,
            width: 3,
            height: 13,
            borderRadius: 2,
            background: 'white',
          }}
        />
        {/* Green dot */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 7,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#059669',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
