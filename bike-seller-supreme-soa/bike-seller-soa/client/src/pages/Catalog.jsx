import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import BikeViewer from '../components/BikeViewer';
import { FaCube, FaCartPlus } from 'react-icons/fa'; // Asegúrate de tener react-icons

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Cargar productos del Backend
    axios.get('http://localhost:3000/catalog')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Función para guardar el producto configurado
  const handleAddToCartConfigured = (configuredProduct) => {
    // Creamos un item único para el carrito
    const cartItem = {
        _id: configuredProduct._id, // Mismo ID base
        name: `${configuredProduct.name} (Custom)`, // Nombre especial
        basePrice: configuredProduct.finalPrice, // ¡Precio actualizado!
        imageUrl: configuredProduct.imageUrl,
        // Guardamos qué opciones eligió por si queremos mostrarlo en el carrito luego
        selectedOptions: configuredProduct.selectedOptions 
    };

    addToCart(cartItem);
    setSelectedProduct(null); // Cerramos modal
    alert(`✅ ¡${configuredProduct.name} configurada añadida al carrito!`);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <h1 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '15px' }}>🔥 Catálogo 2026</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {products.map(prod => (
          <div key={prod._id} style={{ background: '#1e1e1e', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'transform 0.2s', border: '1px solid #333' }}>
            
            {/* Imagen del Producto */}
            <div style={{ height: '220px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <img 
                 src={prod.imageUrl || "https://us.sourcebmx.com/cdn/shop/files/ed2ae665-fec4-45fd-ab4f-3ffbf5c032df.jpg?v=1748945415"} 
                 alt={prod.name} 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
               />
               <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem' }}>
                 {prod.category}
               </span>
            </div>

            <div style={{ padding: '20px', color: 'white' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>{prod.name}</h3>
              <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.4' }}>{prod.description || "Sin descripción disponible."}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>${prod.basePrice}</span>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Botón Ver 3D / Configurar */}
                  <button 
                    onClick={() => setSelectedProduct(prod)}
                    style={{ background: '#333', color: 'white', border: '1px solid #555', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    title="Configurar en 3D"
                  >
                    <FaCube /> 3D
                  </button>

                  {/* Botón Añadir Rápido */}
                  <button 
                    onClick={() => { addToCart(prod); alert("Producto añadido"); }}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <FaCartPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL CONFIGURADOR 3D --- */}
      {selectedProduct && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ 
            width: '95%', maxWidth: '1100px', height: '90vh', 
            background: '#1a1a1a', borderRadius: '20px', 
            position: 'relative', display: 'flex', flexDirection: 'column', 
            boxShadow: '0 0 50px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}>
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ 
                position: 'absolute', top: '20px', right: '20px', 
                background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', 
                fontSize: '20px', width: '40px', height: '40px', borderRadius: '50%',
                cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            {/* Componente Configurador */}
            <BikeViewer 
              product={selectedProduct} 
              onAddToCart={handleAddToCartConfigured} 
            />
            
          </div>
        </div>
      )}
    </div>
  );
}