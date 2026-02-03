import React, { useState, useEffect } from 'react'; 
import { useCart } from '../context/CartContext'; 
import { FaTrash, FaGlobeAmericas } from 'react-icons/fa'; // Simplifiqué los iconos
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // 1. AQUI ESTA EL CAMBIO IMPORTANTE: Agregamos 'email'
  const [paymentForm, setPaymentForm] = useState({
      cardName: '',
      email: '', // <--- ¡ESTO FALTABA!
      cardNumber: '',
      expDate: '',
      cvc: ''
  });

  // Si ya inició sesión, autocompletamos el nombre (Opcional)
  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if(savedName) setPaymentForm(prev => ({...prev, cardName: savedName}));
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.basePrice || 0), 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
        const orderData = {
            customer: {
                name: paymentForm.cardName || "Cliente Invitado",
                // 2. AQUI ESTA EL OTRO CAMBIO: Usamos el email del formulario
                email: paymentForm.email, 
                address: "Dirección de envío simulada",
                paymentMethod: "Credit Card (Stripe Sim)"
            },
            items: cart,
            total: total
        };

        // Enviamos al Microservicio de Órdenes
        const response = await axios.post('http://localhost:3003/orders', orderData);

        setTimeout(() => {
            setProcessing(false);
            setShowPayment(false);
            clearCart(); 
            
            // Confirmación visual
            alert(`✅ ¡Pago Aprobado!\n📧 Recibo enviado a: ${paymentForm.email}\nID: ${response.data._id}`);
        }, 2000);

    } catch (error) {
        console.error("Error procesando el pago:", error);
        setProcessing(false);
        alert("❌ Error al procesar. Revisa que Order y Notification service estén prendidos.");
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        <h2>Tu carrito está vacío 😔</h2>
        <Link to="/catalog" style={{ color: '#3b82f6', textDecoration: 'none' }}>Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s', color: 'white' }}>
      <h1 style={{ borderBottom: '1px solid #333', paddingBottom: '20px' }}>🛒 Tu Carrito ({cart.length})</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' }}>
        
        {/* LISTA DE ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ background: '#1a1a1a', padding: '15px', borderRadius: '10px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #333' }}>
              <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '8px', overflow: 'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.name}</h3>
                {item.selectedOptions && (
                    <div style={{ display:'flex', gap:'10px', fontSize:'0.8rem', color:'#aaa', flexWrap:'wrap' }}>
                        {Object.entries(item.selectedOptions).map(([part, opt]) => (
                            <span key={part} style={{ background:'#333', padding:'2px 8px', borderRadius:'4px' }}>{opt.name}</span>
                        ))}
                    </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '10px' }}>${item.basePrice}</div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN */}
        <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '15px', height: 'fit-content', border: '1px solid #333' }}>
          <h3 style={{ marginTop: 0 }}>Resumen</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#aaa' }}>
            <span>Total</span><span>${total}</span>
          </div>
          <button onClick={() => setShowPayment(true)} style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '15px', borderRadius: '50px', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Proceder al Pago
          </button>
        </div>
      </div>

      {/* MODAL DE PAGO */}
      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#121212', width: '400px', borderRadius: '20px', border: '1px solid #333', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px' }}><FaGlobeAmericas color="#3b82f6"/> Pago Seguro</span>
                <button onClick={() => setShowPayment(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handlePayment}>
                {/* 3. AQUI ESTA EL INPUT DE EMAIL QUE FALTABA */}
                <label style={{fontSize:'0.8rem', color:'#aaa', marginBottom:'5px', display:'block'}}>Correo para recibir confirmación:</label>
                <input 
                    required 
                    type="email" 
                    placeholder="tu_correo@gmail.com" 
                    value={paymentForm.email} 
                    onChange={e => setPaymentForm({...paymentForm, email: e.target.value})} 
                    style={inputStyle} 
                />
                
                <div style={{height:'10px'}}></div>

                <input required placeholder="Nombre en la tarjeta" value={paymentForm.cardName} onChange={e => setPaymentForm({...paymentForm, cardName: e.target.value})} style={inputStyle} />
                <input required placeholder="0000 0000 0000 0000" maxLength="19" style={{...inputStyle, marginTop: '10px'}} />
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input required placeholder="MM/YY" maxLength="5" style={inputStyle} />
                    <input required type="password" placeholder="CVC" maxLength="3" style={inputStyle} />
                </div>

                <button type="submit" disabled={processing} style={{ width: '100%', marginTop: '20px', background: processing ? '#555' : '#22c55e', color: 'black', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: processing ? 'wait' : 'pointer' }}>
                    {processing ? 'Procesando...' : `Pagar $${total}`}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', background: '#222', border: '1px solid #444', color: 'white', padding: '12px', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };