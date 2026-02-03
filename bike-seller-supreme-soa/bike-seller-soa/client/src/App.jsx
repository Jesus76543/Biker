import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FaShoppingCart, FaBox, FaChartPie, FaComments, FaStore, FaTruck } from 'react-icons/fa';

// Contexto
import { CartProvider, useCart } from './context/CartContext';

// Páginas
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Tracking from './pages/Tracking'; // <--- 1. IMPORTANTE: Importamos Tracking

// --- PROTECTED ROUTE (Si no tienes el archivo aparte, úsala aquí mismo) ---
// Si ya tienes el archivo 'components/ProtectedRoute', descomenta la siguiente línea y borra esta función const:
// import { ProtectedRoute } from './components/ProtectedRoute';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  
  return children;
};

const GOOGLE_CLIENT_ID = "359488177080-mutcirrnd5aaovhcrg4en7etgei2hkk4.apps.googleusercontent.com";

// --- NAVBAR ---
function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart(); 
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role'); 
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
    window.location.reload();
  };

  const goToAdminTab = (tabName) => {
    navigate('/admin', { state: { tab: tabName } });
  };

  const navbarStyle = role === 'admin' ? {
    padding: '15px 40px',
    background: '#0f172a',
    borderBottom: '2px solid #facc15',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
  } : {
    padding: '15px 40px',
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #333',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 100
  };

  return (
    <nav style={navbarStyle}>
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        {role === 'admin' ? (
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white', letterSpacing: '1px', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'10px' }}>
            🛡️ Panel <span style={{ color: '#facc15' }}>Maestro</span>
          </div>
        ) : (
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', letterSpacing: '-1px' }}>
            🚴‍♂️ BikeSeller <span style={{ color: '#22c55e' }}>Supreme</span>
          </div>
        )}
      </Link>

      {/* ENLACES */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {token ? (
          <>
            {role === 'admin' ? (
              <>
                <button onClick={() => goToAdminTab('overview')} style={adminLinkStyle}><FaChartPie /> Resumen</button>
                <button onClick={() => goToAdminTab('products')} style={adminLinkStyle}><FaBox /> Productos</button>
                <button onClick={() => goToAdminTab('chat')} style={adminLinkStyle}><FaComments /> Soporte</button>
                <div style={{width:'1px', height:'20px', background:'#444', margin:'0 10px'}}></div>
                <Link to="/catalog" style={{ color: '#94a3b8', textDecoration: 'none', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'5px' }}>
                  <FaStore /> Ver Tienda
                </Link>
              </>
            ) : (
              <>
                <Link to="/" style={{ color: '#ccc', textDecoration: 'none', fontWeight: '500' }}>Inicio</Link>
                <Link to="/catalog" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Catálogo</Link>
                {/* Agregué enlace directo al tracking por si acaso */}
                <Link to="/tracking" style={{ color: '#ccc', textDecoration: 'none', fontWeight: '500', display:'flex', alignItems:'center', gap:'5px' }}><FaTruck/> Rastreo</Link>
                <Link to="/chat" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Soporte</Link>
                
                <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <FaShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                      {cart.length}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* PERFIL */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: '15px', paddingLeft: '20px', borderLeft: '1px solid #444' }}>
              <div style={{textAlign: 'right', lineHeight: '1.2'}}>
                <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>{username || 'Usuario'}</div>
                <div style={{ color: role === 'admin' ? '#facc15' : '#666', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{role}</div>
              </div>
              <button onClick={handleLogout} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                Salir
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ background: '#3b82f6', color: 'white', padding: '10px 25px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

const adminLinkStyle = { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '5px', transition: 'background 0.2s', fontWeight: '500' };

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', background: '#121212', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <Navbar />
            <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* 2. IMPORTANTE: LA RUTA QUE FALTABA */}
                <Route path="/tracking" element={<Tracking />} />

                {/* Rutas Protegidas */}
                <Route path="/catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                
                {/* Ruta Admin */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;