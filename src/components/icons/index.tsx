import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function FaLogo({ size = 32, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Diamond shape */}
      <polygon
        points="32,4 58,24 32,60 6,24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner facets */}
      <line x1="6" y1="24" x2="58" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="4" x2="19" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="4" x2="45" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19" y1="24" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" />
      <line x1="45" y1="24" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" />
      {/* Sparkle */}
      <circle cx="32" cy="22" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function DiamondIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="6,3 18,3 22,9 12,22 2,9" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="6" y1="3" x2="9" y2="9" />
      <line x1="18" y1="3" x2="15" y2="9" />
      <line x1="9" y1="9" x2="12" y2="22" />
      <line x1="15" y1="9" x2="12" y2="22" />
    </svg>
  );
}

export function RingIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <ellipse cx="12" cy="14" rx="7" ry="7" />
      <path d="M9 7 Q12 2 15 7" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
      <line x1="10" y1="5.5" x2="8" y2="3" />
      <line x1="14" y1="5.5" x2="16" y2="3" />
    </svg>
  );
}

export function NecklaceIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8 2 Q4 6 4 12 Q4 18 12 20 Q20 18 20 12 Q20 6 16 2" />
      <circle cx="12" cy="19" r="2.5" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
      <path d="M10 17.5 L9 18" />
      <path d="M14 17.5 L15 18" />
    </svg>
  );
}

export function EarringIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="3" r="2" />
      <line x1="12" y1="5" x2="12" y2="10" />
      <path d="M8 10 L12 14 L16 10" />
      <path d="M8 10 L12 18 L16 10" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function BraceletIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <ellipse cx="12" cy="12" rx="9" ry="9" />
      <ellipse cx="12" cy="12" rx="6.5" ry="6.5" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="3" cy="12" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="21" cy="12" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="21" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function CrownIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 18 L3 10 L8 14 L12 6 L16 14 L21 10 L21 18 Z" />
      <line x1="3" y1="20" x2="21" y2="20" />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="6" r="1.2" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}
