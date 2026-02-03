import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBoxOpen, FaChartLine, FaComments, FaTrash, FaUser, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

export default function AdminDashboard() {
  const location = useLocation(); 
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

  return (
    <div style={{ display: 'flex', minHeight: '80vh', gap: '20px', color: 'white', animation: 'fadeIn 0.5s ease' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: '#1a1a1a', borderRadius: '15px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px', height: 'fit-content', border: '1px solid #333' }}>
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '10px' }}>
           <h3 style={{ margin: 0 }}>Panel Maestro 🛡️</h3>
           <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#666' }}>BikeSeller Enterprise</p>
        </div>
        <MenuButton icon={<FaChartLine />} label="Operaciones" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <MenuButton icon={<FaBoxOpen />} label="Inventario" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <MenuButton icon={<FaComments />} label="Soporte" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, background: '#1a1a1a', borderRadius: '15px', padding: '30px', border: '1px solid #333' }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'chat' && <SupportTab />}
      </div>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---

function MenuButton({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isActive ? '#3b82f6' : 'transparent', border: isActive ? '1px solid #2563eb' : '1px solid transparent', color: isActive ? 'white' : '#aaa', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: isActive ? '600' : 'normal', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}>
      {icon} {label}
    </button>
  );
}

// 1. PESTAÑA RESUMEN (CON CONTROL DE ESTADO DE PEDIDOS)
function OverviewTab() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, pending: 0, count: 0 });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3003/orders'); // Puerto 3003 (Orders)
      const data = res.data;
      setOrders(data);

      const revenue = data.reduce((acc, order) => acc + (order.total || 0), 0);
      const pendingCount = data.filter(o => o.status !== 'delivered').length;
      
      setStats({ totalRevenue: revenue, pending: pendingCount, count: data.length });
    } catch (error) {
      console.error("Error cargando órdenes", error);
    }
  };

  // CAMBIAR ESTADO DE LA ORDEN
  const handleStatusChange = async (orderId, newStatus) => {
      try {
          await axios.patch(`http://localhost:3003/orders/${orderId}/status`, { status: newStatus });
          setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
          alert(`✅ Estado actualizado a: ${newStatus.toUpperCase()}`);
      } catch (error) {
          alert("❌ Error actualizando estado");
      }
  };

  const statusOptions = [
      { value: 'paid', label: '1. Pagado (Confirmado)' },
      { value: 'assembling', label: '2. En Ensamblaje' },
      { value: 'shipped', label: '3. Enviado (En Avión)' },
      { value: 'local', label: '4. Reparto Local' },
      { value: 'delivered', label: '5. Entregado' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <h2 style={{ marginTop: 0 }}>📊 Control de Operaciones</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{background:'#222', padding:'20px', borderRadius:'10px', borderLeft:'4px solid #22c55e'}}>
          <div style={{color:'#aaa'}}>Ingresos Reales</div>
          <div style={{fontSize:'2rem', fontWeight:'bold'}}>${stats.totalRevenue}</div>
        </div>
        <div style={{background:'#222', padding:'20px', borderRadius:'10px', borderLeft:'4px solid #facc15'}}>
          <div style={{color:'#aaa'}}>Pedidos Activos</div>
          <div style={{fontSize:'2rem', fontWeight:'bold'}}>{stats.pending}</div>
        </div>
      </div>

      <h3>📦 Gestión de Pedidos</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#222', borderRadius: '8px' }}>
        <thead style={{ background: '#333', color: '#ccc' }}>
          <tr>
            <th style={{padding:'12px'}}>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado Actual</th>
            <th>Acción (Mover Barra)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{padding:'12px', fontSize:'0.8rem', fontFamily:'monospace'}}>#{order._id.slice(-6)}</td>
              <td>
                  <div>{order.customer?.name}</div>
                  <div style={{fontSize:'0.7rem', color:'#888'}}>{order.customer?.email}</div>
              </td>
              <td>${order.total}</td>
              <td>
                  <span style={{ 
                      background: order.status === 'delivered' ? '#22c55e20' : '#facc1520', 
                      color: order.status === 'delivered' ? '#22c55e' : '#facc15',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight:'bold'
                  }}>
                      {order.status.toUpperCase()}
                  </span>
              </td>
              <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ background: '#111', color: 'white', border: '1px solid #444', padding: '5px', borderRadius: '5px', cursor:'pointer' }}
                  >
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 2. PESTAÑA PRODUCTOS (CRUD COMPLETO)
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', basePrice: '', imageUrl: '', category: 'BMX' });
  const [jsonConfig, setJsonConfig] = useState(''); 

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3002/catalog'); // Puerto 3002 (Catalog)
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(!confirm("⚠️ ¿Eliminar producto permanentemente?")) return;
    try {
        await axios.delete(`http://localhost:3002/catalog/${id}`);
        fetchProducts();
    } catch (err) { alert("Error al eliminar"); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    let finalCustomization = [];
    
    if (!jsonConfig || jsonConfig.trim() === '') {
        if (confirm("⚠️ ¿Cargar plantilla 3D por defecto?")) {
            finalCustomization = [
              { "partName": "Color del Cuadro", "options": [{ "name": "Negro Mate", "colorCode": "#1a1a1a", "extraPrice": 0 }, { "name": "Rojo Neón", "colorCode": "#ff0055", "extraPrice": 150 }] },
              { "partName": "Tipo de Llantas", "options": [{ "name": "Rayos Clásicos", "colorCode": "#333", "extraPrice": 0 }, { "name": "Aero Disc Sólido", "colorCode": "#ffd700", "extraPrice": 1200 }] }
            ];
        }
    } else {
        try { finalCustomization = JSON.parse(jsonConfig); } 
        catch (error) { alert("JSON Inválido"); return; }
    }

    try {
      await axios.post('http://localhost:3002/catalog', { ...form, basePrice: Number(form.basePrice), customizationOptions: finalCustomization });
      alert("✅ Producto creado");
      fetchProducts();
      setForm({ name: '', description: '', basePrice: '', imageUrl: '', category: 'BMX' });
      setJsonConfig('');
    } catch (err) { alert("Error de conexión"); }
  };

  return (
    <div>
      <h2 style={{marginTop:0}}>🚲 Inventario</h2>
      <div style={{ background: '#222', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3 style={{marginTop:0, color:'#3b82f6'}}>Agregar Producto</h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input required placeholder="Nombre Modelo" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={inputStyle} />
          <input required placeholder="Precio ($)" type="number" value={form.basePrice} onChange={e=>setForm({...form, basePrice:e.target.value})} style={inputStyle} />
          <input required placeholder="URL Imagen" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} style={{...inputStyle, gridColumn: 'span 2'}} />
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{color:'#aaa', fontSize:'0.8rem'}}>Configuración 3D (JSON)</label>
            <textarea value={jsonConfig} onChange={e => setJsonConfig(e.target.value)} placeholder='[Pegar JSON aquí o dejar vacío para auto-plantilla]' style={{ ...inputStyle, height: '80px', fontFamily: 'monospace', color: '#aaffaa', background:'#111' }} />
          </div>
          <button type="submit" style={{ gridColumn: 'span 2', background: '#22c55e', color: 'black', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>PUBLICAR</button>
        </form>
      </div>
      <div>
        {products.map(prod => (
          <div key={prod._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '10px 15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #3b82f6' }}>
            <div><div style={{ fontWeight: 'bold' }}>{prod.name}</div><div style={{ fontSize: '0.8rem', color: '#888' }}>${prod.basePrice}</div></div>
            <button onClick={() => handleDelete(prod._id)} style={{ background: '#333', border: '1px solid #ef4444', color: '#ef4444', padding:'8px', borderRadius:'5px', cursor: 'pointer' }}><FaTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { background: '#111', border: '1px solid #444', color: 'white', padding: '10px', borderRadius: '5px' };

// 3. PESTAÑA SOPORTE (UI CHAT)
function SupportTab() {
  const [selectedChat, setSelectedChat] = useState(1);
  const chats = [
    { id: 1, user: "Juan Pérez", msg: "Hola, ¿cuándo llega mi pedido?" },
    { id: 2, user: "María Lopez", msg: "Tengo duda con el color rojo..." }
  ];

  return (
    <div style={{ display: 'flex', height: '500px', gap: '20px' }}>
      <div style={{ width: '250px', borderRight: '1px solid #333', paddingRight: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Tickets</h3>
        {chats.map(c => (
            <div key={c.id} onClick={()=>setSelectedChat(c.id)} style={{padding:'15px', background:selectedChat===c.id?'#3b82f6':'#222', borderRadius:'10px', marginBottom:'10px', cursor:'pointer'}}>
                <div style={{fontWeight:'bold'}}>{c.user}</div>
                <div style={{fontSize:'0.8rem', opacity:0.7}}>{c.msg}</div>
            </div>
        ))}
      </div>
      <div style={{ flex: 1, background:'#111', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' }}>
          Interfaz de Chat (Conectar WebSocket en Fase 2)
      </div>
    </div>
  );
}