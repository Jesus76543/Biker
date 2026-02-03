import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaCircle, FaHeadset } from 'react-icons/fa';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! Bienvenido a BikeSeller Support. 🚴‍♂️", sender: 'bot', time: '10:00 AM' },
    { id: 2, text: "¿En qué podemos ayudarte hoy?", sender: 'bot', time: '10:00 AM' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Referencia para el auto-scroll
  const messagesEndRef = useRef(null);

  // Función para bajar el scroll automáticamente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulación de respuesta del Bot
  const handleBotResponse = (userText) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let botText = "Gracias por escribirnos. Un agente humano te atenderá en breve.";
      
      // Respuestas "Inteligentes" simples
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('precio') || lowerText.includes('costo')) {
        botText = "Nuestros precios varían según la personalización. La BMX base comienza en $4000.";
      } else if (lowerText.includes('envio') || lowerText.includes('entreg')) {
        botText = "Realizamos envíos a todo el mundo. El tiempo estimado es de 3-5 días hábiles. ✈️";
      } else if (lowerText.includes('hola') || lowerText.includes('buenos')) {
        botText = "¡Hola! ¿Estás buscando armar una bici nueva?";
      }

      const newMsg = {
        id: Date.now(),
        text: botText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newMsg]);
      setIsTyping(false);
    }, 1500); // Tarda 1.5 segundos en "pensar"
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const textSent = input;
    setInput('');
    
    // Disparar respuesta del bot
    handleBotResponse(textSent);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '85vh', paddingTop: '20px' }}>
      
      {/* CONTENEDOR PRINCIPAL DEL CHAT */}
      <div style={{ 
        width: '100%', maxWidth: '600px', 
        background: '#1a1a1a', 
        borderRadius: '20px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
        display: 'flex', flexDirection: 'column', 
        overflow: 'hidden', border: '1px solid #333' 
      }}>

        {/* 1. HEADER */}
        <div style={{ 
          padding: '20px', background: '#222', borderBottom: '1px solid #333', 
          display: 'flex', alignItems: 'center', gap: '15px' 
        }}>
          <div style={{ 
            width: '50px', height: '50px', background: '#3b82f6', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white', position: 'relative' 
          }}>
            <FaHeadset />
            {/* Puntito verde de "En línea" */}
            <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', border: '2px solid #222' }}></div>
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'white' }}>Soporte Técnico</h3>
            <span style={{ fontSize: '0.8rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaCircle size={8} /> En línea ahora
            </span>
          </div>
        </div>

        {/* 2. ÁREA DE MENSAJES */}
        <div style={{ 
          flex: 1, padding: '20px', overflowY: 'auto', 
          display: 'flex', flexDirection: 'column', gap: '15px', 
          backgroundImage: 'radial-gradient(#2a2a2a 1px, transparent 1px)', backgroundSize: '20px 20px' 
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              display: 'flex', 
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
            }}>
              {/* Avatar Bot */}
              {msg.sender === 'bot' && (
                <div style={{ width: '35px', height: '35px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#aaa' }}>
                  <FaRobot />
                </div>
              )}

              {/* Burbuja de Texto */}
              <div style={{ 
                maxWidth: '70%', 
                padding: '12px 16px', 
                borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0', 
                background: msg.sender === 'user' ? '#3b82f6' : '#2a2a2a', 
                color: 'white', 
                border: msg.sender === 'bot' ? '1px solid #444' : 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                <div style={{ lineHeight: '1.4' }}>{msg.text}</div>
                <div style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#666', marginTop: '5px', textAlign: 'right' }}>
                  {msg.time}
                </div>
              </div>

              {/* Avatar User */}
              {msg.sender === 'user' && (
                <div style={{ width: '35px', height: '35px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', color: 'white' }}>
                  <FaUser />
                </div>
              )}
            </div>
          ))}

          {/* Animación "Escribiendo..." */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '45px' }}>
              <div style={{ background: '#2a2a2a', padding: '10px 15px', borderRadius: '20px', border: '1px solid #444' }}>
                <span style={{ color: '#aaa', fontSize: '0.8rem', fontStyle: 'italic' }}>Escribiendo... ✍️</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT AREA */}
        <form onSubmit={handleSend} style={{ 
          padding: '20px', background: '#222', borderTop: '1px solid #333', 
          display: 'flex', gap: '10px' 
        }}>
          <input 
            type="text" 
            placeholder="Escribe tu mensaje..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ 
              flex: 1, padding: '15px', borderRadius: '50px', border: 'none', 
              background: '#333', color: 'white', outline: 'none', fontSize: '1rem' 
            }}
          />
          <button type="submit" style={{ 
            width: '50px', height: '50px', borderRadius: '50%', border: 'none', 
            background: input.trim() ? '#22c55e' : '#444', 
            color: 'white', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            transition: 'background 0.3s'
          }}>
            <FaPaperPlane />
          </button>
        </form>

      </div>
    </div>
  );
}