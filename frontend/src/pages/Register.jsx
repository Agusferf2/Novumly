import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../../assets/Logo.png';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const { token } = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await login(token);
      navigate('/today');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-[420px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-center mb-2">
          <img src={logo} alt="Teachly" className="w-18 h-18 object-contain" />
          <h1 className="font-title text-[42px] font-semibold text-[#2F2F2F] leading-none tracking-[-0.015em] self-end">
            Teachly
          </h1>
        </div>
        <p className="text-center text-[#6B7280] text-base font-normal leading-[1.4] mb-8">Creá tu cuenta y empezá a aprender</p>

        {/* Card */}
        <div className="bg-white rounded-[16px] px-6 py-8 shadow-[0_2px_20px_rgba(47,47,47,0.07)]">
          <h2 className="font-title text-[28px] font-semibold text-[#2F2F2F] text-center leading-snug tracking-[-0.01em] mb-1">Crear cuenta</h2>
          <div className="w-8 h-[2px] bg-[#BFA56A] mx-auto mb-6 rounded-full opacity-70" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1.5 uppercase tracking-[0.04em]">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-[#F4F1EA] border border-[rgba(47,47,47,0.12)] rounded-2xl text-[#2F2F2F] text-[17px] leading-[1.5] placeholder-[#969B92] focus:outline-none focus:border-[#BFA56A] transition-colors duration-150"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1.5 uppercase tracking-[0.04em]">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-12 px-4 bg-[#F4F1EA] border border-[rgba(47,47,47,0.12)] rounded-2xl text-[#2F2F2F] text-[17px] leading-[1.5] placeholder-[#969B92] focus:outline-none focus:border-[#BFA56A] transition-colors duration-150"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1.5 uppercase tracking-[0.04em]">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full h-12 px-4 bg-[#F4F1EA] border border-[rgba(47,47,47,0.12)] rounded-2xl text-[#2F2F2F] text-[17px] leading-[1.5] placeholder-[#969B92] focus:outline-none focus:border-[#BFA56A] transition-colors duration-150"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="bg-[rgba(155,64,64,0.07)] text-[#7A3535] text-sm px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#969B92] text-white font-medium rounded-2xl text-[17px] leading-none disabled:opacity-50 transition-opacity duration-150 mt-1"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[15px] text-[#6B7280]">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-[#BFA56A] font-medium underline-offset-2 hover:underline transition-all duration-150">
            Ingresá
          </Link>
        </p>
      </div>
    </div>
  );
}
