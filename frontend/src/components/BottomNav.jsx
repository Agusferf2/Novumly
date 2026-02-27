import { useLocation, useNavigate } from 'react-router-dom';

function HomeIcon({ active }) {
  const c = active ? '#BFA56A' : '#969B92';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function ChartIcon({ active }) {
  const c = active ? '#BFA56A' : '#969B92';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3"  y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7"  width="4" height="14" rx="1" />
      <rect x="17" y="3"  width="4" height="18" rx="1" />
    </svg>
  );
}

function UserIcon({ active }) {
  const c = active ? '#BFA56A' : '#969B92';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/today',    label: 'Hoy',     Icon: HomeIcon  },
    { path: '/progress', label: 'Progreso', Icon: ChartIcon },
    { path: '/profile',  label: 'Perfil',   Icon: UserIcon  },
  ];

  return (
    <nav className="flex-shrink-0 bg-white border-t border-[rgba(47,47,47,0.08)] flex">
      {tabs.map(({ path, label }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2
                       text-xs font-medium transition-colors"
            style={{ color: active ? '#BFA56A' : '#969B92' }}
          >
            <Icon active={active} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
