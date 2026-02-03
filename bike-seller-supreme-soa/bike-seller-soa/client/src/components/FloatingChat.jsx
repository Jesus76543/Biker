// FloatingChat.jsx
import { useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      
      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div style={{ width: '300px', height: '400px', background: '#1a1a1a', borderRadius: '15px', border: '1px solid #333', marginBottom: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
          <div style={{ background: '#3b82f6', padding: '15px', color: 'white', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Soporte 24/7</span>
            <FaTimes onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ flex: 1, padding: '15px', color: '#ccc', fontSize: '0.9rem' }}>
            <p>👋 ¡Hola! ¿En qué podemos ayudarte con tu BMX?</p>
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #333' }}>
            <input placeholder="Escribe aquí..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#333', color: 'white' }} />
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', background: '#22c55e', border: 'none', 
          color: 'black', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <FaComments />
      </button>
    </div>
  );
}