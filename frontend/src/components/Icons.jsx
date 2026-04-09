// Centralized SVG icon components.
// All icons accept: size (number, default varies), color (string, default varies).

export function FlameIcon({ size = 20, color = '#BFA56A', filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill={filled ? color : 'none'} stroke={filled ? 'none' : color}
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function CheckIcon({ size = 20, color = '#BFA56A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChatIcon({ size = 20, color = '#BFA56A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

export function CalendarIcon({ size = 20, color = '#BFA56A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function HomeIcon({ size = 22, color = '#969B92' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

export function ChartIcon({ size = 22, color = '#969B92' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <rect x="3"  y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7"  width="4" height="14" rx="1" />
      <rect x="17" y="3"  width="4" height="18" rx="1" />
    </svg>
  );
}

export function UserIcon({ size = 22, color = '#969B92' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function ScienceIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M9 3v7l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 21 19l-4-9V3" />
      <path d="M9 12h6" />
    </svg>
  );
}

export function BulbIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21h6M10 21v-1a5 5 0 1 1 4 0v1" />
      <path d="M9.5 14.5A5 5 0 0 1 9 12" />
    </svg>
  );
}

export function LeafIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 5.3-1 10-4 12.5C13.5 16 12 17 11 20z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function HeartIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function SearchIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function TagIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function SunIcon({ size = 16, color = '#969B92' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function MoonIcon({ size = 16, color = '#969B92' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function BookIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c0-1.1.9-2 2-2h7v16H4a2 2 0 0 1-2-2V6z" />
      <path d="M22 6c0-1.1-.9-2-2-2h-7v16h7a2 2 0 0 0 2-2V6z" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

export function ChipIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M7 9H5M7 12H5M7 15H5M17 9h2M17 12h2M17 15h2M9 7V5M12 7V5M15 7V5M9 17v2M12 17v2M15 17v2" />
    </svg>
  );
}

export function PaletteIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2v-.5c0-.28-.22-.5-.5-.5H12c-2.76 0-5-2.24-5-5C7 7.92 9.24 5 12 5c4.42 0 8 2.91 8 6.5 0 2.49-1.79 4.5-4 4.5-1.1 0-2-.9-2-2 0-.55-.45-1-1-1s-1 .45-1 1v2.5" />
      <circle cx="8.5" cy="11.5" r="1" fill={color} stroke="none" />
      <circle cx="10.5" cy="8" r="1" fill={color} stroke="none" />
      <circle cx="14.5" cy="8" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function ThinkIcon({ size = 20, color = '#8B6F47' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5.5-4 6.8V18H9v-2.2C6.5 14.5 5 12 5 9a7 7 0 0 1 7-7z" />
      <line x1="9" y1="21" x2="15" y2="21" />
      <circle cx="12" cy="9" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

export function LogoutIcon({ size = 18, color = '#C05050' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
