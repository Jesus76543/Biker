import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  
  // Estado para saber si estamos en modo Login o Registro
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario (Local)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const endpoint = isRegistering ? '/register' : '/login';
    const payload = isRegistering 
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

    try {
      const res = await axios.post(`http://localhost:3001${endpoint}`, payload);

      if (isRegistering) {
        // Si se registró con éxito, cambiamos a modo login
        setSuccessMsg(res.data.message);
        setIsRegistering(false); // Volver al login para que entre
        setFormData({ username: '', email: '', password: '' });
      } else {
        // Si es login, guardamos y redirigimos
        const { token, role, username } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user_role', role);
        localStorage.setItem('username', username);
        
        if (role === 'admin') navigate('/admin');
        else navigate('/catalog');
        
        window.location.reload();
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error de conexión con el servidor");
    }
  };

  // Manejar Login con Google (Ahora conecta al Backend Real)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const res = await axios.post('http://localhost:3001/google-login', {
            token: credentialResponse.credential
        });

        const { token, role, username } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user_role', role);
        localStorage.setItem('username', username);

        if (role === 'admin') navigate('/admin');
        else navigate('/catalog');

        window.location.reload();
    } catch (err) {
        console.error("Error Google Backend:", err);
        setError("Error al autenticar con Google en el servidor.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', color: 'white', animation: 'fadeIn 0.5s' }}>
      <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '15px', width: '380px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        
        <h2 style={{ marginBottom: '10px' }}>
            {isRegistering ? 'Crear Cuenta' : 'Bienvenido'}
        </h2>
        <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>
            {isRegistering ? 'Únete a BikeSeller Supreme' : 'Inicia sesión para continuar'}
        </p>
        
        {/* Mensajes de feedback */}
        {error && <div style={{background:'#ef444420', color:'#ef4444', padding:'10px', borderRadius:'5px', marginBottom:'15px', fontSize:'0.85rem'}}>{error}</div>}
        {successMsg && <div style={{background:'#22c55e20', color:'#22c55e', padding:'10px', borderRadius:'5px', marginBottom:'15px', fontSize:'0.85rem'}}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Campo Nombre (Solo visible en Registro) */}
          {isRegistering && (
            <input 
              name="username"
              type="text" 
              placeholder="Nombre de Usuario" 
              value={formData.username}
              onChange={handleChange}
              style={inputStyle} 
              required
            />
          )}

          <input 
            name="email"
            type="email" 
            placeholder="Correo electrónico" 
            value={formData.email}
            onChange={handleChange}
            style={inputStyle} 
            required
          />
          <input 
            name="password"
            type="password" 
            placeholder="Contraseña" 
            value={formData.password}
            onChange={handleChange}
            style={inputStyle} 
            required
          />
          
          <button type="submit" style={{ padding: '12px', background: isRegistering ? '#22c55e' : '#3b82f6', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', transition: '0.3s' }}>
            {isRegistering ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        {/* Separador */}
        <div style={{ display:'flex', alignItems:'center', margin:'25px 0' }}>
            <div style={{flex:1, height:'1px', background:'#333'}}></div>
            <span style={{padding:'0 10px', color:'#666', fontSize:'0.8rem'}}>O continúa con</span>
            <div style={{flex:1, height:'1px', background:'#333'}}></div>
        </div>

        {/* Botón Google */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
              text={isRegistering ? "signup_with" : "signin_with"}
            />
        </div>

        {/* Switch Login/Registro */}
        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #333', fontSize: '0.9rem', color: '#aaa' }}>
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta aún?'}
            <button 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setSuccessMsg('');
                }} 
                style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
            >
                {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
            </button>
        </div>

      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: 'white', outline: 'none', fontSize: '0.95rem' };