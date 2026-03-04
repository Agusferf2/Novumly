import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FlameIcon, ChatIcon, CalendarIcon, CheckIcon } from '../components/Icons.jsx';
import logo from '../../assets/Logo.png';
import character from '../../assets/Novumly_character.png';

const FEATURES = [
  { icon: <FlameIcon size={15} />,    label: 'Racha diaria' },
  { icon: <ChatIcon size={15} />,     label: 'Preguntas con IA' },
  { icon: <CalendarIcon size={15} />, label: 'Seguí tu progreso' },
];

export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#1A1814]" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/today" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#1A1814] flex flex-col max-w-[420px] mx-auto px-5">

      {/* Header */}
      <header className="flex items-center justify-center pt-8 pb-1">
        <img src={logo} alt="" className="w-15 h-15 object-contain" />
        <span className="font-title text-[36px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-none self-end">
          Novumly.
        </span>
      </header>

      {/* Hero */}
      <div className="flex flex-col gap-4 pt-1 pb-2">

        <h1 className="font-title text-[30px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-tight tracking-[-0.02em] text-center">
          Aprende algo nuevo cada día
        </h1>

        {/* Mini topic card — mockup ilustrativo */}
        <div className="w-full bg-white dark:bg-[#252220] rounded-2xl p-5 shadow-[0_4px_28px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.35)] border border-[rgba(47,47,47,0.05)] dark:border-[rgba(255,255,255,0.05)]">

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#BFA56A] bg-[rgba(191,165,106,0.15)] px-2.5 py-0.5 rounded-full">
                Hoy
              </span>
              <span className="text-[11px] text-[#9CA3AF]">Ciencia · 2 min</span>
            </div>
            <div className="flex items-center gap-1">
              <FlameIcon size={13} filled />
              <span className="text-[12px] font-semibold text-[#BFA56A]">7</span>
            </div>
          </div>

          <h3 className="text-[16px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-snug mb-3">
            ¿Por qué el cielo es azul?
          </h3>

          <div className="space-y-2 mb-4">
            <div className="h-2.5 bg-[rgba(47,47,47,0.07)] dark:bg-[rgba(255,255,255,0.07)] rounded-full" />
            <div className="h-2.5 bg-[rgba(47,47,47,0.07)] dark:bg-[rgba(255,255,255,0.07)] rounded-full w-[85%]" />
            <div className="h-2.5 bg-[rgba(47,47,47,0.07)] dark:bg-[rgba(255,255,255,0.07)] rounded-full w-[60%]" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    i <= 3
                      ? 'bg-[rgba(191,165,106,0.2)]'
                      : 'bg-[rgba(47,47,47,0.06)] dark:bg-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  {i <= 3 && <CheckIcon size={10} />}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-[#9CA3AF] font-medium">3 preguntas hoy</span>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex justify-center gap-2 flex-wrap">
          {FEATURES.map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-[13px] text-[#6B7280] dark:text-[#9CA3AF] bg-[rgba(47,47,47,0.06)] dark:bg-[rgba(255,255,255,0.06)] px-3.5 py-2 rounded-full"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[rgba(47,47,47,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
        <div className="w-2 h-2 rounded-full bg-[#BFA56A] opacity-50" />
        <div className="flex-1 h-px bg-[rgba(47,47,47,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
      </div>

      {/* Bottom — character + CTAs */}
      <div className="flex flex-col items-center pb-10">
        <img
          src={character}
          alt=""
          className="w-[300px] object-contain select-none pointer-events-none"
        />
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate('/register')}
            className="w-full h-14 bg-[#BFA56A] text-white font-semibold rounded-2xl text-[17px] active:opacity-80 transition-opacity"
          >
            Empieza a aprender
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full h-14 border border-[rgba(47,47,47,0.15)] dark:border-[rgba(255,255,255,0.15)] text-[#2F2F2F] dark:text-[#EDE9E1] font-medium rounded-2xl text-[17px] active:opacity-70 transition-opacity"
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
