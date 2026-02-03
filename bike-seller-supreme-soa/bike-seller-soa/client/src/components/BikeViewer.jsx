import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Center, Float, Environment } from '@react-three/drei';

// --- 1. COMPONENTES FÍSICOS (ACCESORIOS Y RUEDAS) ---

// Accesorio: Luz LED Delantera (Nueva Geometría)
function FrontLight() {
  return (
    <group position={[1.15, 0.9, 0]} rotation={[0, 0, -0.35]}>
      {/* Soporte */}
      <mesh position={[-0.05, -0.05, 0]} rotation={[0,0,1.57]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Carcasa del foco */}
      <mesh rotation={[0, 0, 1.57]}>
        <cylinderGeometry args={[0.07, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      {/* Lente brillante (Emissive) */}
      <mesh position={[0.065, 0, 0]} rotation={[0, 0, 1.57]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Rayos de la rueda (Tu versión mejorada)
function Spokes() {
  const spokes = [];
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const x = Math.cos(angle) * 0.4;
    const y = Math.sin(angle) * 0.4;
    spokes.push(
      <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
        <cylinderGeometry args={[0.008, 0.008, 0.8, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
      </mesh>
    );
  }
  return <group>{spokes}</group>;
}

// Rueda Inteligente (Con lógica de Disco vs Rayos)
function Wheel({ position, rimColor, type }) {
  const isAeroDisc = type?.includes('Aero Disc'); // Detectamos si es disco

  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Neumático exterior gordo (Siempre igual) */}
      <mesh>
        <torusGeometry args={[0.8, 0.15, 20, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      
      {/* Textura del neumático */}
      <mesh>
        <torusGeometry args={[0.8, 0.13, 16, 28]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.98} />
      </mesh>
      
      {/* RENDERIZADO CONDICIONAL: ¿DISCO O RAYOS? */}
      {isAeroDisc ? (
        // OPCIÓN A: DISCO AERO SÓLIDO
        <group>
            {/* El Disco Sólido */}
            <mesh rotation={[1.57, 0, 0]}>
                <cylinderGeometry args={[0.72, 0.72, 0.04, 32]} />
                <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Detalle central del disco */}
            <mesh rotation={[1.57, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.06, 32]} />
                <meshStandardMaterial color="#222" metalness={0.5} />
            </mesh>
        </group>
      ) : (
        // OPCIÓN B: TUS RUEDAS CLÁSICAS DE RAYOS (Tu código original)
        <group>
            {/* Llanta metálica exterior (Aro) */}
            <mesh>
                <torusGeometry args={[0.7, 0.06, 20, 32]} />
                <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Llanta interior */}
            <mesh>
                <torusGeometry args={[0.65, 0.03, 16, 28]} />
                <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Discos del buje */}
            <mesh position={[0, 0, 0.12]}><cylinderGeometry args={[0.15, 0.15, 0.02, 24]} /><meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[0, 0, -0.12]}><cylinderGeometry args={[0.15, 0.15, 0.02, 24]} /><meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} /></mesh>
            {/* Buje central */}
            <mesh><cylinderGeometry args={[0.08, 0.08, 0.28, 16]} /><meshStandardMaterial color="#444" metalness={0.95} roughness={0.05} /></mesh>
            {/* Tapas */}
            <mesh position={[0, 0, 0.14]}><cylinderGeometry args={[0.09, 0.09, 0.01, 16]} /><meshStandardMaterial color="#555" metalness={0.95} roughness={0.05} /></mesh>
            <mesh position={[0, 0, -0.14]}><cylinderGeometry args={[0.09, 0.09, 0.01, 16]} /><meshStandardMaterial color="#555" metalness={0.95} roughness={0.05} /></mesh>
            
            {/* Rayos */}
            <Spokes />
        </group>
      )}
    </group>
  );
}

// --- 2. EL ENSAMBLAJE DE LA BMX (TU GEOMETRÍA + LÓGICA NUEVA) ---
function ProBMX({ config }) {
  const groupRef = useRef();
  
  // Colores y Opciones Dinámicas
  const frameColor = config['Color del Cuadro']?.colorCode || '#ef4444';
  const rimColor = config['Tipo de Llantas']?.colorCode || '#111'; // Antes era 'Llantas', ahora soporta 'Tipo de Llantas'
  
  // LÓGICA NUEVA: Leemos nombres para activar piezas físicas
  const rimType = config['Tipo de Llantas']?.name || config['Llantas']?.name; 
  const hasLight = config['Accesorios']?.name === 'Faro LED Delantero';

  // Animación suave
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(groupRef.current) {
        groupRef.current.rotation.y = Math.sin(t / 8) / 6;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.7, 0]} scale={1.05}>
      
      {/* === NUEVO: ACCESORIO LUZ (Condicional) === */}
      {hasLight && <FrontLight />}

      {/* === CUADRO (FRAME) - (Tu código original intacto) === */}
      <group>
        <mesh position={[0.5, 0.35, 0]} rotation={[0, 0, 0.75]}><cylinderGeometry args={[0.065, 0.07, 1.5, 16]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[0.35, 0.95, 0]} rotation={[0, 0, 1.57]}><cylinderGeometry args={[0.055, 0.055, 1.7, 16]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[-0.45, 0.6, 0]} rotation={[0, 0, -0.15]}><cylinderGeometry args={[0.06, 0.06, 1.5, 16]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[1.15, 0.85, 0]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.075, 0.075, 0.45, 16]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        {/* Vainas Traseras */}
        <mesh position={[-1.0, 0.55, 0.09]} rotation={[0.08, -0.15, -0.85]}><cylinderGeometry args={[0.032, 0.032, 1.35, 12]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[-1.0, 0.55, -0.09]} rotation={[-0.08, 0.15, -0.85]}><cylinderGeometry args={[0.032, 0.032, 1.35, 12]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[-0.92, -0.05, 0.09]} rotation={[0.05, -0.08, 1.57]}><cylinderGeometry args={[0.038, 0.038, 1.15, 12]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[-0.92, -0.05, -0.09]} rotation={[-0.05, 0.08, 1.57]}><cylinderGeometry args={[0.038, 0.038, 1.15, 12]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[-1.55, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.24, 12]} /><meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} /></mesh>
      </group>

      {/* === HORQUILLA Y MANUBRIO (Tu código original) === */}
      <group position={[1.15, 0.65, 0]} rotation={[0, 0, -0.35]}>
         <mesh position={[0, -0.05, 0]}><boxGeometry args={[0.13, 0.09, 0.28]} /><meshStandardMaterial color="#0f0f0f" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[0, -0.65, 0.12]}><cylinderGeometry args={[0.042, 0.038, 1.3, 12]} /><meshStandardMaterial color="#0f0f0f" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[0, -0.65, -0.12]}><cylinderGeometry args={[0.042, 0.038, 1.3, 12]} /><meshStandardMaterial color="#0f0f0f" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[0, -1.25, 0.12]}><boxGeometry args={[0.08, 0.06, 0.04]} /><meshStandardMaterial color="#0f0f0f" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[0, -1.25, -0.12]}><boxGeometry args={[0.08, 0.06, 0.04]} /><meshStandardMaterial color="#0f0f0f" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.052, 0.052, 0.28, 12]} /><meshStandardMaterial color="#0a0a0a" metalness={0.92} roughness={0.08} /></mesh>
         <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.058, 0.058, 0.12, 12]} /><meshStandardMaterial color="#0a0a0a" metalness={0.92} roughness={0.08} /></mesh>
         {/* Manubrio */}
         <mesh position={[0, 0.44, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.042, 0.042, 0.9, 12]} /><meshStandardMaterial color="#0a0a0a" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[-0.08, 0.56, 0.45]} rotation={[0.32, 0, -0.18]}><cylinderGeometry args={[0.042, 0.042, 0.32, 12]} /><meshStandardMaterial color="#0a0a0a" metalness={0.88} roughness={0.12} /></mesh>
         <mesh position={[-0.08, 0.56, -0.45]} rotation={[-0.32, 0, 0.18]}><cylinderGeometry args={[0.042, 0.042, 0.32, 12]} /><meshStandardMaterial color="#0a0a0a" metalness={0.88} roughness={0.12} /></mesh>
         {/* Puños */}
         <mesh position={[-0.15, 0.72, 0.45]} rotation={[0.32, 0, -0.18]}><cylinderGeometry args={[0.05, 0.05, 0.24, 12]} /><meshStandardMaterial color="#1a1a1a" roughness={0.88} /></mesh>
         <mesh position={[-0.15, 0.72, -0.45]} rotation={[-0.32, 0, 0.18]}><cylinderGeometry args={[0.05, 0.05, 0.24, 12]} /><meshStandardMaterial color="#1a1a1a" roughness={0.88} /></mesh>
      </group>

      {/* === SILLÍN (Tu código original) === */}
      <group position={[-0.5, 1.35, 0]}>
         <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.032, 0.032, 0.35, 12]} /><meshStandardMaterial color="#2a2a2a" metalness={0.82} roughness={0.18} /></mesh>
         <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.042, 0.042, 0.07, 12]} /><meshStandardMaterial color="#0f0f0f" metalness={0.92} roughness={0.08} /></mesh>
         <mesh rotation={[0, 0, 1.57]} rotation-x={-0.05}><boxGeometry args={[0.08, 0.48, 0.3]} /><meshStandardMaterial color="#0f0f0f" roughness={0.5} /></mesh>
         <mesh position={[0, 0.05, 0]} rotation={[0, 0, 1.57]} rotation-x={-0.05}><boxGeometry args={[0.065, 0.45, 0.27]} /><meshStandardMaterial color="#1a1a1a" roughness={0.75} /></mesh>
      </group>

      {/* === PEDALIER (Tu código original) === */}
      <group position={[-0.42, -0.05, 0]}>
         <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.075, 0.075, 0.38, 16]} /><meshStandardMaterial color="#2a2a2a" metalness={0.92} roughness={0.08} /></mesh>
         <mesh position={[0, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.22, 0.016, 18, 44]} /><meshStandardMaterial color="#3a3a3a" metalness={0.92} roughness={0.08} /></mesh>
         <mesh position={[0, -0.06, 0.23]} rotation={[0.38, 0, 0]}><cylinderGeometry args={[0.037, 0.037, 0.58, 10]} /><meshStandardMaterial color="#0f0f0f" metalness={0.78} roughness={0.22} /></mesh>
         <mesh position={[0, -0.54, 0.28]}><boxGeometry args={[0.19, 0.042, 0.3]} /><meshStandardMaterial color="#0a0a0a" roughness={0.55} /></mesh>
         <mesh position={[0, -0.06, -0.23]} rotation={[-0.38, 0, Math.PI]}><cylinderGeometry args={[0.037, 0.037, 0.58, 10]} /><meshStandardMaterial color="#0f0f0f" metalness={0.78} roughness={0.22} /></mesh>
         <mesh position={[0, 0.42, -0.28]}><boxGeometry args={[0.19, 0.042, 0.3]} /><meshStandardMaterial color="#0a0a0a" roughness={0.55} /></mesh>
      </group>

      {/* === RUEDAS INTELIGENTES (AQUÍ ESTÁ LA MAGIA) === */}
      {/* Pasamos el "rimColor" y el "type" (para saber si es disco o rayo) */}
      <Wheel position={[-1.55, -0.15, 0]} rimColor={rimColor} type={rimType} /> 
      <Wheel position={[1.6, -0.15, 0]} rimColor={rimColor} type={rimType} />

    </group>
  );
}

// --- 3. VISOR PRINCIPAL (LÓGICA) ---
export default function BikeViewer({ product, onAddToCart }) {
  const [configuration, setConfiguration] = useState({});
  const [totalPrice, setTotalPrice] = useState(product?.basePrice || 0);

  useEffect(() => {
    if (!product?.customizationOptions) return;
    const initialConfig = {};
    let initialExtra = 0;
    product.customizationOptions.forEach(part => {
      if (part.options?.[0]) {
        initialConfig[part.partName] = part.options[0];
        initialExtra += part.options[0].extraPrice || 0;
      }
    });
    setConfiguration(initialConfig);
    setTotalPrice(product.basePrice + initialExtra);
  }, [product]);

  const handleOptionSelect = (partName, option) => {
    const newConfig = { ...configuration, [partName]: option };
    setConfiguration(newConfig);
    let newTotal = product.basePrice;
    Object.values(newConfig).forEach(opt => newTotal += (opt.extraPrice || 0));
    setTotalPrice(newTotal);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'white' }}>
      
      {/* LIENZO 3D */}
      <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #2a2a2a 0%, #0a0a0a 100%)', borderRadius: '15px 15px 0 0', overflow: 'hidden' }}>
        <Canvas shadows camera={{ position: [0, 1.2, 4.5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <spotLight position={[0, 10, 0]} intensity={0.3} angle={0.3} />
          
          <Float floatIntensity={0.15} rotationIntensity={0.1} speed={1.5}>
            <Center>
              <ProBMX config={configuration} />
            </Center>
          </Float>
          
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} minDistance={3} maxDistance={7} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} />
          <Environment preset="sunset" />
        </Canvas>

        {/* Etiqueta Precio */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '30px', border: '1px solid #444' }}>
          <span style={{ fontSize: '0.8rem', color: '#aaa' }}>PRECIO FINAL</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4ade80' }}>${totalPrice}</div>
        </div>
      </div>

      {/* CONTROLES */}
      <div style={{ background: '#222', padding: '20px', borderRadius: '0 0 15px 15px', borderTop: '1px solid #333' }}>
        <h3 style={{ marginTop: 0 }}>Configura: <span style={{color:'#3b82f6'}}>{product?.name}</span></h3>
        
        {(!product?.customizationOptions?.length) ? (
           <p style={{color:'#666'}}>Sin opciones disponibles.</p>
        ) : (
           <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {product.customizationOptions.map((part) => (
              <div key={part.partName}>
                <div style={{ fontSize:'0.75rem', color:'#888', marginBottom:'5px', textTransform:'uppercase' }}>{part.partName}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {part.options.map((opt) => {
                    const isActive = configuration[part.partName]?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleOptionSelect(part.partName, opt)}
                        style={{
                          background: isActive ? '#3b82f6' : '#333',
                          border: isActive ? '2px solid white' : '1px solid #444',
                          padding: '8px 12px', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        {opt.colorCode && <div style={{width:12, height:12, borderRadius:'50%', background:opt.colorCode}}></div>}
                        {opt.name}
                        {opt.extraPrice > 0 && <span style={{fontSize:'0.75rem', color:'#4ade80'}}>+${opt.extraPrice}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
           </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <button 
            onClick={() => onAddToCart({ ...product, finalPrice: totalPrice, selectedOptions: configuration })}
            style={{ background: '#22c55e', color: 'black', padding: '12px 40px', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize:'1rem' }}
          >
            Agregar al Carrito - ${totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
}