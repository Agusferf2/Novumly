import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../../assets/Logo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await apiFetch('/api/auth/login', {
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
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#1A1814] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-[420px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-2">
          <img src={logo} alt="Teachly" className="w-18 h-18 object-contain" />
          <h1 className="font-title text-[42px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-none tracking-[-0.015em] self-end ">
            Teachly
          </h1>
        </div>
        <p className="text-center text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-[1.4] mb-8">
          Aprendé algo nuevo cada día
        </p>

        {/* Card */}
        <div className="bg-white dark:bg-[#252220] rounded-[16px] px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.18)]">
          {' '}
          <h2 className="font-title text-[28px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] text-center leading-snug tracking-[-0.01em] mb-1">
            Iniciar sesión
          </h2>
          <div className="w-8 h-[2px] bg-[#BFA56A] mx-auto mb-6 rounded-full opacity-70" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1.5 uppercase tracking-[0.04em]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)] rounded-2xl text-[#2F2F2F] dark:text-[#EDE9E1] text-[17px] leading-[1.5] placeholder-[#969B92] focus:outline-none focus:border-[#BFA56A] transition-colors duration-150"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1.5 uppercase tracking-[0.04em]">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)] rounded-2xl text-[#2F2F2F] dark:text-[#EDE9E1] text-[17px] leading-[1.5] placeholder-[#969B92] focus:outline-none focus:border-[#BFA56A] transition-colors duration-150"
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
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[15px] text-[#6B7280] dark:text-[#9CA3AF]">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="text-[#BFA56A] font-medium underline-offset-2 hover:underline transition-all duration-150"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
