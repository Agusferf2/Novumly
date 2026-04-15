import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Loader from './components/Loader.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Today from './pages/Today.jsx';
import Progress from './pages/Progress.jsx';
import TopicByDate from './pages/TopicByDate.jsx';
import Profile from './pages/Profile.jsx';
import Onboarding from './pages/Onboarding.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#1A1814] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/',         element: <Landing /> },
  { path: '/login',    element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/onboarding',
    element: <ProtectedRoute><Onboarding /></ProtectedRoute>,
  },
  {
    path: '/today',
    element: <ProtectedRoute><Today /></ProtectedRoute>,
  },
  {
    path: '/progress',
    element: <ProtectedRoute><Progress /></ProtectedRoute>,
  },
  {
    path: '/topic/:date',
    element: <ProtectedRoute><TopicByDate /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
