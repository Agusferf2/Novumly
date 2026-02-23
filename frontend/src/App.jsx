import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Today from './pages/Today.jsx';
import Progress from './pages/Progress.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/',         element: <Navigate to="/today" replace /> },
  { path: '/login',    element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/today',
    element: <ProtectedRoute><Today /></ProtectedRoute>,
  },
  {
    path: '/progress',
    element: <ProtectedRoute><Progress /></ProtectedRoute>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
