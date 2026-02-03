import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  // 1. Si no hay token, fuera (al login)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay roles específicos requeridos (ej: solo admin) y no lo tienes
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Te manda al inicio
  }

  // 3. Si todo bien, muestra la página
  return children;
};