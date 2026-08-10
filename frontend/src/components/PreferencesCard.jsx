import { useState } from 'react';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CheckIcon,
  ScienceIcon, LeafIcon,
  BookIcon, ChipIcon, PaletteIcon, HeartIcon, SearchIcon, TagIcon,
} from './Icons.jsx';

const PREFERENCES = [
  { key: 'historia',   Icon: BookIcon,    label: 'Historia' },
  { key: 'ciencia',    Icon: ScienceIcon, label: 'Ciencia' },
  { key: 'tecnologia', Icon: ChipIcon,    label: 'Tecnología' },
  { key: 'medicina',   Icon: HeartIcon,   label: 'Medicina' },
  { key: 'arte',       Icon: PaletteIcon, label: 'Arte y Cultura' },
  { key: 'naturaleza', Icon: LeafIcon,    label: 'Naturaleza' },
  { key: 'conceptos',  Icon: SearchIcon,  label: 'Conceptos' },
];

const MAX_INTERESTS = 5;
const PRESET_KEYS = new Set(PREFERENCES.map(p => p.key));

export default function PreferencesCard() {
  const { user, refreshUser } = useAuth();

  const [isEditing,        setIsEditing]        = useState(false);
  const [selected,         setSelected]         = useState(() => user?.interests ?? []);
  const [saving,           setSaving]           = useState(false);
  const [saveError,        setSaveError]        = useState(null);
  const [savedOk,          setSavedOk]          = useState(false);
  const [customInput,      setCustomInput]      = useState('');
  const [validating,       setValidating]       = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const customCategories = selected.filter(k => !PRESET_KEYS.has(k));
  const atLimit = selected.length >= MAX_INTERESTS;

  function toggleCategory(key) {
    setSelected(prev => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev;
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  }

  async function handleValidate() {
    const raw = customInput.trim();
    if (!raw) return;
    setValidating(true);
    setValidationResult(null);
    try {
      const data = await apiFetch('/api/me/validate-category', {
        method: 'POST',
        body: JSON.stringify({ name: raw }),
      });
      setValidationResult(data);
      if (data.valid) {
        const name = (data.label && data.label !== 'null') ? data.label : raw;
        const current = user?.interests ?? [];
        if (!current.includes(name)) {
          setSaving(true);
          try {
            await apiFetch('/api/me', {
              method: 'PATCH',
              body: JSON.stringify({ interests: [...current, name] }),
            });
            await refreshUser();
            setSelected(prev => [...prev, name]);
            setCustomInput('');
            setSavedOk(true);
          } catch {
            setSaveError('No se pudo agregar. Intentá de nuevo.');
          } finally {
            setSaving(false);
          }
        }
      }
    } catch {
      setValidationResult({ valid: false, reason: 'Error al evaluar. Intentá de nuevo.' });
    } finally {
      setValidating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await apiFetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({ interests: selected }),
      });
      await refreshUser();
      setIsEditing(false);
      setSavedOk(true);
      setCustomInput('');
      setValidationResult(null);
    } catch {
      setSaveError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  function startEditing() {
    setIsEditing(true);
    setSelected(user?.interests ?? []);
    setSaveError(null);
  }

  return (
    <div className="bg-white dark:bg-[#252220] rounded-2xl px-5 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2F2F2F] dark:text-[#EDE9E1]">Preferencias</p>
          {isEditing && (
            <p className="text-xs text-[#969B92] mt-0.5">Elegí al menos 1 categoría</p>
          )}
        </div>
        <button
          onClick={isEditing ? handleSave : startEditing}
          disabled={saving}
          className="text-xs font-medium text-[#BFA56A] disabled:opacity-50 min-h-[44px] px-1"
        >
          {isEditing ? (saving ? 'Guardando...' : 'Guardar') : 'Editar'}
        </button>
      </div>

      {/* Vista normal */}
      {!isEditing && (
        <div className="space-y-0">
          {PREFERENCES.filter(({ key }) => user?.interests?.includes(key)).map(({ key, Icon, label }, i, arr) => (
            <div key={key} className={`flex items-center justify-between py-3 ${
              i < arr.length - 1 || customCategories.length > 0
                ? 'border-b border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]' : ''
            }`}>
              <div className="flex items-center gap-3">
                <Icon />
                <span className="text-sm text-[#2F2F2F] dark:text-[#EDE9E1]">{label}</span>
              </div>
              <CheckIcon />
            </div>
          ))}
          {customCategories.map((cat, i) => (
            <div key={cat} className={`flex items-center justify-between py-3 ${
              i < customCategories.length - 1
                ? 'border-b border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]' : ''
            }`}>
              <div className="flex items-center gap-3">
                <TagIcon />
                <span className="text-sm text-[#2F2F2F] dark:text-[#EDE9E1]">{cat}</span>
              </div>
              <CheckIcon />
            </div>
          ))}
          {(user?.interests?.length ?? 0) === 0 && (
            <p className="text-xs text-[#969B92] py-2">Sin categorías seleccionadas.</p>
          )}
        </div>
      )}

      {/* Modo edición */}
      {isEditing && (
        <div className="space-y-3">
          <div className="space-y-0">
            {PREFERENCES.filter(({ key }) => selected.includes(key)).map(({ key, Icon, label }, i, arr) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={`w-full flex items-center justify-between py-3 text-left ${
                  i < arr.length - 1 || customCategories.length > 0
                    ? 'border-b border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon />
                  <span className="text-sm text-[#2F2F2F] dark:text-[#EDE9E1]">{label}</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-[rgba(47,47,47,0.07)] dark:bg-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#969B92] text-sm leading-none">×</span>
              </button>
            ))}
            {customCategories.map(cat => (
              <div key={cat} className="flex items-center justify-between py-3 border-t border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                  <TagIcon />
                  <span className="text-sm text-[#2F2F2F] dark:text-[#EDE9E1]">{cat}</span>
                </div>
                <button
                  onClick={() => setSelected(prev => {
                    const next = prev.filter(k => k !== cat);
                    return next.length === 0 ? prev : next;
                  })}
                  className="w-6 h-6 rounded-full bg-[rgba(47,47,47,0.07)] dark:bg-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#969B92] text-sm leading-none"
                >×</button>
              </div>
            ))}
          </div>

          {PREFERENCES.filter(({ key }) => !selected.includes(key)).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {PREFERENCES.filter(({ key }) => !selected.includes(key)).map(({ key, Icon, label }) => (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  disabled={atLimit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)] text-xs text-[#969B92] disabled:opacity-30 transition-opacity"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input categoría personalizada */}
      <div className="space-y-2 pt-2 border-t border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#969B92]">¿Querés algo más específico?</p>
          <p className={`text-xs tabular-nums ${atLimit ? 'text-[#C05050]' : 'text-[#C4BFB6] dark:text-[#5A5550]'}`}>
            {selected.length}/{MAX_INTERESTS}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={e => { setCustomInput(e.target.value); setValidationResult(null); }}
            onKeyDown={e => e.key === 'Enter' && !validating && handleValidate()}
            placeholder="Ej: Historia Argentina, Astronomía..."
            maxLength={60}
            className="flex-1 h-10 px-3 bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)] rounded-xl text-sm text-[#2F2F2F] dark:text-[#EDE9E1] placeholder-[#C4BFB6] focus:outline-none focus:border-[#BFA56A] transition-colors"
          />
          <button
            onClick={handleValidate}
            disabled={!customInput.trim() || validating || atLimit}
            className="h-10 px-3 bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)] rounded-xl text-xs text-[#969B92] disabled:opacity-40 transition-opacity whitespace-nowrap"
          >
            {validating ? 'Evaluando...' : 'Evaluar'}
          </button>
        </div>

        {validationResult && (
          <div className={`rounded-xl px-3 py-2.5 text-xs space-y-1 ${
            validationResult.unclear
              ? 'bg-[rgba(150,155,146,0.10)] text-[#969B92]'
              : validationResult.valid
                ? 'bg-[rgba(191,165,106,0.10)] text-[#8A7040]'
                : 'bg-[rgba(155,64,64,0.07)] text-[#7A3535]'
          }`}>
            <p>
              {validationResult.unclear ? '?' : validationResult.valid ? '✓' : '✗'}{' '}
              {validationResult.reason}
            </p>
            {validationResult.valid && validationResult.label && validationResult.label !== 'null' && (
              <p className="text-[#BFA56A]">Guardado como: <span className="font-medium">{validationResult.label}</span></p>
            )}
            {!validationResult.unclear && !validationResult.valid && validationResult.suggestion && validationResult.suggestion !== 'null' && (
              <p className="text-[#969B92]">Sugerencia: {validationResult.suggestion}</p>
            )}
          </div>
        )}
      </div>

      {saveError && <p className="text-xs text-[#C05050]">{saveError}</p>}

      {!isEditing && savedOk && (
        <p className="text-xs text-[#BFA56A]">Tus preferencias se aplicarán a partir de mañana.</p>
      )}

      {!isEditing && !savedOk && (user?.interests?.length ?? 0) === 0 && (
        <p className="text-xs text-[#969B92]">Tocá "Editar" para elegir tus categorías.</p>
      )}
    </div>
  );
}
