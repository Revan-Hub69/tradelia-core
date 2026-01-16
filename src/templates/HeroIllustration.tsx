'use client';

import { useEffect, useState } from 'react';

export const HeroIllustration = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="relative h-[420px] w-full max-w-[480px] md:h-[480px]"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 rounded-3xl transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          opacity: stage >= 2 ? 1 : 0,
        }}
      />

      {/* 3D Book Container */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 transition-all duration-1000 ease-out"
        style={{
          transform: `translateX(-50%) translateY(${stage >= 2 ? '20%' : '-50%'}) rotateX(${stage >= 1 ? '60deg' : '0deg'})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book base/spine */}
        <div
          className="relative transition-all duration-700"
          style={{
            width: '200px',
            height: '8px',
            background: 'linear-gradient(90deg, #1e40af, #3b82f6, #1e40af)',
            borderRadius: '4px',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
            opacity: stage >= 1 ? 1 : 0,
          }}
        />

        {/* Left page */}
        <div
          className="absolute left-0 top-0 origin-right transition-all duration-1000 ease-out"
          style={{
            width: '100px',
            height: '140px',
            transform: `rotateY(${stage >= 2 ? '-75deg' : '0deg'}) translateZ(4px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="size-full rounded-l-lg border border-blue-500/30"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4) 0%, rgba(59, 130, 246, 0.2) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            {/* Page lines */}
            <div className="flex flex-col gap-2 p-4 pt-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-px rounded-full bg-blue-400/30"
                  style={{ width: `${85 - i * 10}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right page */}
        <div
          className="absolute right-0 top-0 origin-left transition-all duration-1000 ease-out"
          style={{
            width: '100px',
            height: '140px',
            transform: `rotateY(${stage >= 2 ? '75deg' : '0deg'}) translateZ(4px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="size-full rounded-r-lg border border-blue-500/30"
            style={{
              background: 'linear-gradient(225deg, rgba(30, 64, 175, 0.4) 0%, rgba(59, 130, 246, 0.2) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            <div className="flex flex-col gap-2 p-4 pt-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="ml-auto h-px rounded-full bg-blue-400/30"
                  style={{ width: `${85 - i * 10}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Light beam from book */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-1000"
          style={{
            width: stage >= 2 ? '60px' : '0px',
            height: stage >= 2 ? '200px' : '0px',
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0) 80%)',
            filter: 'blur(20px)',
            transform: 'translateY(-100%) rotateX(-60deg)',
            opacity: stage >= 2 ? 1 : 0,
          }}
        />
      </div>

      {/* Universe Network - emerges from book */}
      <svg
        viewBox="0 0 480 300"
        className="absolute left-0 top-0 size-full transition-all duration-1000"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
          </linearGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cryptoGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Network lines */}
        <g stroke="url(#lineGrad)" strokeWidth="1" fill="none">
          {/* Main vertical */}
          <path d="M240 280 L240 60" strokeOpacity="0.5" />
          {/* Branches */}
          <path d="M240 280 Q180 220 100 160" strokeOpacity="0.4" />
          <path d="M240 280 Q300 220 380 160" strokeOpacity="0.4" />
          <path d="M240 280 Q200 200 140 100" strokeOpacity="0.35" />
          <path d="M240 280 Q280 200 340 100" strokeOpacity="0.35" />
          {/* Cross connections */}
          <path d="M100 160 Q120 130 140 100" strokeOpacity="0.3" />
          <path d="M380 160 Q360 130 340 100" strokeOpacity="0.3" />
          <path d="M140 100 Q190 70 240 60" strokeOpacity="0.3" />
          <path d="M340 100 Q290 70 240 60" strokeOpacity="0.3" />
          <path d="M100 160 Q70 120 60 80" strokeOpacity="0.25" />
          <path d="M380 160 Q410 120 420 80" strokeOpacity="0.25" />
          <path d="M60 80 Q150 50 240 40" strokeOpacity="0.2" />
          <path d="M420 80 Q330 50 240 40" strokeOpacity="0.2" />
          <path d="M240 60 L240 40" strokeOpacity="0.3" />
        </g>

        {/* Network nodes with glow */}
        <g filter="url(#nodeGlow)">
          <circle cx="240" cy="60" r="5" fill="#3B82F6" />
          <circle cx="240" cy="40" r="4" fill="#06B6D4" />
          <circle cx="100" cy="160" r="4" fill="#3B82F6" fillOpacity="0.8" />
          <circle cx="380" cy="160" r="4" fill="#3B82F6" fillOpacity="0.8" />
          <circle cx="140" cy="100" r="3.5" fill="#60A5FA" fillOpacity="0.7" />
          <circle cx="340" cy="100" r="3.5" fill="#60A5FA" fillOpacity="0.7" />
          <circle cx="60" cy="80" r="3" fill="#06B6D4" fillOpacity="0.6" />
          <circle cx="420" cy="80" r="3" fill="#06B6D4" fillOpacity="0.6" />
        </g>

        {/* Animated crypto symbols */}
        {stage >= 3 && (
          <>
            {/* Bitcoin */}
            <g filter="url(#cryptoGlow)">
              <circle r="16" fill="#F59E0B">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path="M240,280 Q240,170 240,60 Q190,50 140,100 Q120,80 60,80 Q150,60 240,40"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </circle>
              <text
                fontSize="14"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path="M240,280 Q240,170 240,60 Q190,50 140,100 Q120,80 60,80 Q150,60 240,40"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
                ₿
              </text>
            </g>

            {/* Ethereum */}
            <g filter="url(#cryptoGlow)">
              <circle r="14" fill="#627EEA">
                <animateMotion
                  dur="10s"
                  repeatCount="indefinite"
                  path="M240,280 Q180,220 100,160 Q80,120 60,80 Q100,100 140,100 Q170,80 240,60"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </circle>
              <text
                fontSize="12"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                <animateMotion
                  dur="10s"
                  repeatCount="indefinite"
                  path="M240,280 Q180,220 100,160 Q80,120 60,80 Q100,100 140,100 Q170,80 240,60"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
                Ξ
              </text>
            </g>

            {/* Solana/USDC */}
            <g filter="url(#cryptoGlow)">
              <circle r="12" fill="#14F195">
                <animateMotion
                  dur="12s"
                  repeatCount="indefinite"
                  path="M240,280 Q300,220 380,160 Q400,120 420,80 Q380,100 340,100 Q310,80 240,60"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </circle>
              <text
                fontSize="10"
                fill="#000"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                <animateMotion
                  dur="12s"
                  repeatCount="indefinite"
                  path="M240,280 Q300,220 380,160 Q400,120 420,80 Q380,100 340,100 Q310,80 240,60"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
                ◎
              </text>
            </g>

            {/* Small particles */}
            <circle r="4" fill="#8B5CF6" fillOpacity="0.8" filter="url(#nodeGlow)">
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path="M240,60 Q290,50 340,100 Q290,80 240,60 Q190,50 140,100 Q190,80 240,60"
              />
            </circle>
            <circle r="3" fill="#EC4899" fillOpacity="0.7" filter="url(#nodeGlow)">
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M100,160 Q130,130 140,100 Q170,80 240,60 Q170,80 140,100 Q130,130 100,160"
              />
            </circle>
            <circle r="3" fill="#06B6D4" fillOpacity="0.7" filter="url(#nodeGlow)">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M380,160 Q350,130 340,100 Q310,80 240,60 Q310,80 340,100 Q350,130 380,160"
              />
            </circle>
          </>
        )}

        {/* Ambient particles */}
        <g opacity={stage >= 3 ? 0.6 : 0} style={{ transition: 'opacity 1s' }}>
          <circle cx="30" cy="50" r="1.5" fill="#3B82F6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="450" cy="40" r="1" fill="#06B6D4">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="200" r="1.5" fill="#8B5CF6">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="430" cy="220" r="1" fill="#EC4899">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* Floating orbs for premium feel */}
      <div
        className="absolute -left-10 top-10 size-32 rounded-full transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: stage >= 2 ? 1 : 0,
          animation: stage >= 2 ? 'float 6s ease-in-out infinite' : 'none',
        }}
      />
      <div
        className="absolute -right-10 top-20 size-24 rounded-full transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          opacity: stage >= 2 ? 1 : 0,
          animation: stage >= 2 ? 'float 8s ease-in-out infinite reverse' : 'none',
        }}
      />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
        `}
      </style>
    </div>
  );
};
