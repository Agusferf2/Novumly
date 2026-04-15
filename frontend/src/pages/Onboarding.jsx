import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ScienceIcon, LeafIcon,
  BookIcon, ChipIcon, PaletteIcon, HeartIcon, SearchIcon,
} from '../components/Icons.jsx';

const CATEGORIES = [
  { key: 'historia',   Icon: BookIcon,    label: 'Historia',       desc: 'Eventos que cambiaron el mundo' },
  { key: 'ciencia',    Icon: ScienceIcon, label: 'Ciencia',        desc: 'Descubrimientos y fenómenos' },
  { key: 'tecnologia', Icon: ChipIcon,    label: 'Tecnología',     desc: 'Innovación e inventos' },
  { key: 'medicina',   Icon: HeartIcon,   label: 'Medicina',       desc: 'Salud y cuerpo humano' },
  { key: 'arte',       Icon: PaletteIcon, label: 'Arte y Cultura', desc: 'Creatividad y expresión' },
  { key: 'naturaleza', Icon: LeafIcon,    label: 'Naturaleza',     desc: 'Planeta y ecosistemas' },
  { key: 'conceptos',  Icon: SearchIcon,  label: 'Conceptos',      desc: 'Palabras con trasfondo fascinante' },
];

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Guard: si ya tiene categorías no debería estar acá
  if (user?.interests?.length > 0) {
    navigate('/today', { replace: true });
    return null;
  }

  const [selected, setSelected] = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);

  const displayName = user?.email
    ? user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '';

  function toggleCategory(key) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  async function handleStart() {
    if (selected.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({ interests: selected }),
      });
      await refreshUser();
      navigate('/today', { replace: true });
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
      setSaving(false);
    }
  }

  function handleSkip() {
    navigate('/today', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#1A1814] flex flex-col max-w-[420px] mx-auto px-5 py-8">

      {/* Header */}
      <div className="flex-shrink-0 mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-[#252220] shadow-sm mb-4">
          <span className="text-2xl">🧠</span>
        </div>
        <h1 className="font-title text-[28px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-tight mb-2">
          {displayName ? `Hola, ${displayName}` : '¡Bienvenido/a!'}
        </h1>
        <p className="text-[15px] text-[#969B92] leading-snug">
          Elegí los temas que más te interesan.<br />
          Tu primer tema del día será sobre esto.
        </p>
      </div>

      {/* Category grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 mb-6">
        {CATEGORIES.map(({ key, Icon, label, desc }) => {
          const isSelected = selected.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                isSelected
                  ? 'border-[#BFA56A] bg-[rgba(191,165,106,0.08)] dark:bg-[rgba(191,165,106,0.08)]'
                  : 'border-transparent bg-white dark:bg-[#252220]'
              }`}
            >
              {/* Check indicator */}
              <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 ${
                isSelected
                  ? 'bg-[#BFA56A]'
                  : 'border border-[rgba(47,47,47,0.15)] dark:border-[rgba(255,255,255,0.15)]'
              }`}>
                {isSelected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <div className={`p-2 rounded-xl transition-colors ${
                isSelected
                  ? 'bg-[rgba(191,165,106,0.15)]'
                  : 'bg-[#F4F1EA] dark:bg-[#1A1814]'
              }`}>
                <Icon size={20} />
              </div>

              <div>
                <p className={`text-sm font-semibold leading-tight mb-0.5 ${
                  isSelected ? 'text-[#2F2F2F] dark:text-[#EDE9E1]' : 'text-[#2F2F2F] dark:text-[#EDE9E1]'
                }`}>{label}</p>
                <p className="text-xs text-[#969B92] leading-tight">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Counter */}
      {selected.length > 0 && (
        <p className="text-center text-xs text-[#BFA56A] mb-3 font-medium">
          {selected.length} {selected.length === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
        </p>
      )}

      {error && (
        <p className="text-center text-xs text-[#C05050] mb-3">{error}</p>
      )}

      {/* CTA */}
      <div className="flex-shrink-0 space-y-3 pb-2">
        <button
          onClick={handleStart}
          disabled={selected.length === 0 || saving}
          className="w-full h-13 py-3.5 bg-[#BFA56A] disabled:bg-[#D4C9AA] text-white font-semibold text-[17px] rounded-2xl transition-all duration-150 disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Empezar a aprender →'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 text-[15px] text-[#969B92] font-medium"
        >
          Elegir después
        </button>
      </div>

    </div>
  );
}
