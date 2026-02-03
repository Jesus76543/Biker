import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'; // <--- AGREGAMOS useNavigate
import axios from 'axios';
import { FaBox, FaTruck, FaPlane, FaCheckCircle, FaMapMarkerAlt, FaSpinner, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const navigate = useNavigate(); // Para cambiar la URL al buscar
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false); // Empezamos en false
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState(''); // Para el input de búsqueda

  const statusMap = { 'paid': 1, 'assembling': 2, 'shipped': 3, 'local': 4, 'delivered': 5 };

  useEffect(() => {
    if (orderId) {
        setLoading(true);
        fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id) => {
      try {
          setError('');
          const res = await axios.get(`http://localhost:3003/orders/${id}`);
          setOrder(res.data);
      } catch (err) {
          console.error("Error:", err);
          setError('No encontramos ese pedido. Verifica el ID.');
          setOrder(null);
      } finally {
          setLoading(false);
      }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if(manualId.trim()) {
        navigate(`/tracking?id=${manualId}`); // Actualiza la URL y dispara el useEffect
    }
  };

  // ESTILOS
  const containerStyle = { padding: '40px', maxWidth: '800px', margin: '0 auto', color: 'white', animation: 'fadeIn 0.5s' };
  const centerStyle = { textAlign: 'center', padding: '80px 20px', color: 'white' };
  const inputStyle = { padding: '12px', borderRadius: '5px 0 0 5px', border: 'none', width: '250px', outline: 'none', background: '#222', color: 'white', border: '1px solid #444' };
  const btnStyle = { padding: '12px 20px', borderRadius: '0 5px 5px 0', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 'bold' };

  // --- 1. PANTALLA DE CARGA ---
  if (loading) return (
      <div style={centerStyle}>
          <FaSpinner className="spin" size={40} color="#3b82f6"/>
          <h3 style={{marginTop:'20px'}}>Conectando con satélite...</h3>
      </div>
  );

  // --- 2. SI NO HAY ORDEN (O HUBO ERROR) -> MOSTRAR BUSCADOR ---
  if (!order) return (
      <div style={centerStyle}>
          {error ? <FaExclamationTriangle size={50} color="#ef4444"/> : <FaSearch size={50} color="#3b82f6"/> }
          
          <h2 style={{ marginBottom: '10px' }}>{error || "Rastrea tu Pedido"}</h2>
          <p style={{ color: '#aaa', marginBottom: '30px' }}>Ingresa el ID que recibiste en tu correo</p>
          
          <form onSubmit={handleManualSearch} style={{ display: 'flex', justifyContent: 'center' }}>
              <input 
                  placeholder="Ej: 65b8..." 
                  value={manualId} 
                  onChange={e => setManualId(e.target.value)} 
                  style={inputStyle}
              />
              <button type="submit" style={btnStyle}>Buscar</button>
          </form>

          <br/><br/>
          <Link to="/" style={{color:'#666', textDecoration:'none', fontSize:'0.9rem'}}>Volver al inicio</Link>
      </div>
  );

  // --- 3. PANTALLA DE ÉXITO (Solo si "order" existe) ---
  const currentStep = statusMap[order.status] || 1;
  const steps = [
    { id: 1, label: "Confirmado", icon: <FaCheckCircle /> },
    { id: 2, label: "Ensamble", icon: <FaBox /> },
    { id: 3, label: "Enviado", icon: <FaPlane /> },
    { id: 4, label: "Reparto", icon: <FaTruck /> },
    { id: 5, label: "Entregado", icon: <FaMapMarkerAlt /> },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0 }}>Rastreo Satelital</h1>
            <div style={{ color: '#888', fontFamily: 'monospace', marginTop: '5px' }}>ID: {order._id}</div>
          </div>
          <Link to="/tracking" onClick={() => setOrder(null)} style={{ background: '#333', padding: '8px 15px', borderRadius: '5px', color: 'white', textDecoration: 'none', fontSize: '0.8rem' }}>🔍 Buscar otro</Link>
      </div>

      <div style={{ position: 'relative', marginLeft: '20px' }}>
        <div style={{ position: 'absolute', left: '29px', top: '0', bottom: '0', width: '2px', background: '#333' }}></div>
        <div style={{ position: 'absolute', left: '29px', top: '0', width: '2px', background: '#22c55e', height: `${(currentStep - 1) * 25}%`, transition:'height 1s ease' }}></div>

        {steps.map((step) => {
          const isCompleted = step.id <= currentStep;
          const isCurrent = step.id === currentStep;
          return (
            <div key={step.id} style={{ display: 'flex', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: isCompleted ? '#22c55e' : '#1a1a1a', border: isCurrent ? '4px solid rgba(34, 197, 94, 0.4)' : '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: isCompleted?'black':'#555', boxShadow: isCurrent ? '0 0 15px #22c55e' : 'none' }}>
                {step.icon}
              </div>
              <div style={{ marginLeft: '20px', paddingTop:'10px' }}>
                <h3 style={{ margin: 0, color: isCompleted?'white':'#666' }}>{step.label}</h3>
                {isCurrent && <div style={{color:'#3b82f6', fontSize:'0.9rem', marginTop:'5px'}}>📍 Estado Actual</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}