import { Link } from 'react-router-dom';
import { FaArrowRight, FaShippingFast, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function Home() {
  return (
    <div style={{ color: 'white', animation: 'fadeIn 1s ease-in' }}>
      
      {/* Banner Principal */}
      <div style={{ 
        height: '500px', 
        background: 'linear-gradient(to right, #000000, rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1599818826725-78082989b524?q=80&w=1920&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        marginBottom: '60px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span style={{ color: '#22c55e', fontWeight: 'bold', letterSpacing: '2px' }}>NUEVA COLECCIÓN 2026</span>
          <h1 style={{ fontSize: '4.5rem', margin: '10px 0', lineHeight: '1' }}>DOMINA<br/>LA CALLE.</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '30px' }}>
            Personaliza tu BMX con tecnología 3D en tiempo real. Componentes profesionales, envíos internacionales y soporte experto.
          </p>
          <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 40px', background: '#22c55e', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', transition: 'transform 0.2s' }}>
            VER CATÁLOGO <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Características */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
        <FeatureCard icon={<FaShippingFast size={30} color="#3b82f6"/>} title="Envío Global" text="Llegamos a donde estés" />
        <FeatureCard icon={<FaShieldAlt size={30} color="#22c55e"/>} title="Garantía Extendida" text="1 año de protección total" />
        <FeatureCard icon={<FaHeadset size={30} color="#facc15"/>} title="Soporte VIP" text="Chat directo con mecánicos" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '15px', width: '280px', textAlign: 'center', border: '1px solid #333', transition: '0.3s' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
        {icon}
      </div>
      <h3 style={{ margin: '10px 0' }}>{title}</h3>
      <p style={{ color: '#888' }}>{text}</p>
    </div>
  );
}