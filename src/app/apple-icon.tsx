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
          background: '#0d0f12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="120"
          height="130"
          viewBox="0 0 48 52"
          fill="none"
        >
          <polygon
            points="24,4 2,48 46,48"
            stroke="#07C99A"
            stroke-width="3.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            fill="none"
          />
          <polygon
            points="24,4 2,48 46,48"
            fill="#07C99A"
            opacity="0.07"
          />
          <line
            x1="16" y1="32" x2="32" y2="32"
            stroke="#07C99A"
            stroke-width="2.5"
            stroke-linecap="round"
            opacity="0.7"
          />
          <circle cx="24" cy="4" r="3.5" fill="#07C99A" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
