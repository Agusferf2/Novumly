import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, ChartIcon, UserIcon } from './Icons.jsx';

const TABS = [
  { path: '/today',    label: 'Hoy',     Icon: HomeIcon  },
  { path: '/progress', label: 'Progreso', Icon: ChartIcon },
  { path: '/profile',  label: 'Perfil',   Icon: UserIcon  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="flex-shrink-0 bg-white dark:bg-[#252220] border-t border-[rgba(47,47,47,0.08)] dark:border-[rgba(255,255,255,0.08)] flex">
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2
                       text-xs font-medium transition-colors"
            style={{ color: active ? '#BFA56A' : '#969B92' }}
          >
            <Icon color={active ? '#BFA56A' : '#969B92'} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
