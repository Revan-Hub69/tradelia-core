'use client';

import { useEffect, useRef } from 'react';

export const HeroIllustration = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Trigger animation on mount
    const svg = svgRef.current;
    if (svg) {
      svg.classList.add('animate-in');
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 400"
      className="hero-illustration h-auto w-full max-w-lg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Styles for animation */}
      <style>
        {`
          .hero-illustration path,
          .hero-illustration circle,
          .hero-illustration line,
          .hero-illustration polyline {
            stroke: currentColor;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
          }
          
          .hero-illustration .wireframe {
            stroke: hsl(var(--primary) / 0.3);
            stroke-width: 0.5;
          }
          
          .hero-illustration .book {
            stroke: hsl(var(--primary));
            stroke-width: 2;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          
          .hero-illustration .crypto {
            stroke: hsl(var(--primary));
            stroke-width: 1.5;
            stroke-dasharray: 500;
            stroke-dashoffset: 500;
          }
          
          .hero-illustration .glow {
            stroke: hsl(var(--primary) / 0.5);
            stroke-width: 1;
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
          }
          
          .hero-illustration .node {
            fill: hsl(var(--primary));
            opacity: 0;
          }
          
          /* Animations */
          .hero-illustration.animate-in .book {
            animation: draw 1.5s ease-out forwards;
          }
          
          .hero-illustration.animate-in .crypto {
            animation: draw 1s ease-out 0.8s forwards;
          }
          
          .hero-illustration.animate-in .glow {
            animation: draw 1.2s ease-out 0.5s forwards;
          }
          
          .hero-illustration.animate-in .node {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .hero-illustration.animate-in .node:nth-child(1) { animation-delay: 1.2s; }
          .hero-illustration.animate-in .node:nth-child(2) { animation-delay: 1.4s; }
          .hero-illustration.animate-in .node:nth-child(3) { animation-delay: 1.6s; }
          .hero-illustration.animate-in .node:nth-child(4) { animation-delay: 1.8s; }
          .hero-illustration.animate-in .node:nth-child(5) { animation-delay: 2.0s; }
          
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          
          /* Respect reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .hero-illustration .book,
            .hero-illustration .crypto,
            .hero-illustration .glow {
              stroke-dasharray: none;
              stroke-dashoffset: 0;
              animation: none;
            }
            .hero-illustration .node {
              opacity: 1;
              animation: none;
            }
          }
        `}
      </style>

      {/* Background wireframe grid */}
      <g className="wireframe">
        {/* Radial lines from center */}
        <line x1="250" y1="200" x2="100" y2="50" />
        <line x1="250" y1="200" x2="400" y2="50" />
        <line x1="250" y1="200" x2="50" y2="200" />
        <line x1="250" y1="200" x2="450" y2="200" />
        <line x1="250" y1="200" x2="100" y2="350" />
        <line x1="250" y1="200" x2="400" y2="350" />
        <line x1="250" y1="200" x2="250" y2="50" />
        <line x1="250" y1="200" x2="250" y2="350" />
        
        {/* Concentric circles */}
        <circle cx="250" cy="200" r="60" />
        <circle cx="250" cy="200" r="120" />
        <circle cx="250" cy="200" r="180" />
      </g>

      {/* Book - opens from center */}
      <g className="book">
        {/* Left page */}
        <path d="M250 140 L250 280 Q200 270 150 280 L150 140 Q200 130 250 140" />
        {/* Right page */}
        <path d="M250 140 L250 280 Q300 270 350 280 L350 140 Q300 130 250 140" />
        {/* Spine */}
        <line x1="250" y1="130" x2="250" y2="290" />
        {/* Page lines left */}
        <line x1="170" y1="160" x2="230" y2="155" />
        <line x1="170" y1="180" x2="230" y2="175" />
        <line x1="170" y1="200" x2="230" y2="195" />
        <line x1="170" y1="220" x2="230" y2="215" />
        {/* Page lines right */}
        <line x1="270" y1="155" x2="330" y2="160" />
        <line x1="270" y1="175" x2="330" y2="180" />
        <line x1="270" y1="195" x2="330" y2="200" />
        <line x1="270" y1="215" x2="330" y2="220" />
      </g>

      {/* Expanding glow/rays from book */}
      <g className="glow">
        <path d="M250 120 Q250 80 200 50" />
        <path d="M250 120 Q250 80 300 50" />
        <path d="M250 120 Q280 90 350 70" />
        <path d="M250 120 Q220 90 150 70" />
        <path d="M150 200 Q100 200 60 180" />
        <path d="M350 200 Q400 200 440 180" />
      </g>

      {/* Crypto symbols floating - Bitcoin */}
      <g className="crypto">
        {/* Bitcoin at top */}
        <g transform="translate(200, 40)">
          <circle cx="0" cy="0" r="20" />
          <path d="M-5 -12 L-5 12 M5 -12 L5 12" />
          <path d="M-8 -6 L8 -6 Q12 -6 12 -2 Q12 2 8 2 L-8 2" />
          <path d="M-8 2 L8 2 Q14 2 14 6 Q14 10 8 10 L-8 10" />
        </g>
        
        {/* Ethereum at top right */}
        <g transform="translate(350, 60)">
          <circle cx="0" cy="0" r="18" />
          <path d="M0 -10 L8 0 L0 4 L-8 0 Z" />
          <path d="M0 4 L8 0 L0 10 L-8 0 Z" />
        </g>
        
        {/* Generic coin left */}
        <g transform="translate(80, 150)">
          <circle cx="0" cy="0" r="15" />
          <circle cx="0" cy="0" r="10" />
        </g>
        
        {/* USDC style right */}
        <g transform="translate(420, 160)">
          <circle cx="0" cy="0" r="16" />
          <path d="M-4 -6 Q-8 -6 -8 0 Q-8 6 -4 6" />
          <path d="M4 -6 Q8 -6 8 0 Q8 6 4 6" />
        </g>
        
        {/* Small coin bottom */}
        <g transform="translate(300, 350)">
          <circle cx="0" cy="0" r="12" />
          <line x1="-6" y1="0" x2="6" y2="0" />
          <line x1="0" y1="-6" x2="0" y2="6" />
        </g>
      </g>

      {/* Connection nodes */}
      <g>
        <circle className="node" cx="200" cy="40" r="4" />
        <circle className="node" cx="350" cy="60" r="4" />
        <circle className="node" cx="80" cy="150" r="3" />
        <circle className="node" cx="420" cy="160" r="3" />
        <circle className="node" cx="300" cy="350" r="3" />
      </g>

      {/* Connection lines between nodes */}
      <g className="glow">
        <line x1="200" y1="60" x2="250" y2="130" />
        <line x1="350" y1="78" x2="300" y2="130" />
        <line x1="95" y1="150" x2="150" y2="180" />
        <line x1="404" y1="160" x2="350" y2="180" />
        <line x1="300" y1="338" x2="280" y2="290" />
      </g>
    </svg>
  );
};
