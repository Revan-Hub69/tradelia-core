import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Delta mark V2 — dark bg, teal gradient outline + benchmark bar
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#0d0f12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="22"
          height="24"
          viewBox="0 0 48 52"
          fill="none"
        >
          {/* Delta outline — teal solid (no gradient in OG) */}
          <polygon
            points="24,4 2,48 46,48"
            stroke="#07C99A"
            stroke-width="4"
            stroke-linejoin="round"
            stroke-linecap="round"
            fill="none"
          />
          {/* Benchmark bar */}
          <line
            x1="16" y1="32" x2="32" y2="32"
            stroke="#07C99A"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.7"
          />
          {/* Top dot */}
          <circle cx="24" cy="4" r="4" fill="#07C99A" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
