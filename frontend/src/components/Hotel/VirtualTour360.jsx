import React, { Suspense, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { X, RotateCcw, Info, Sparkles } from 'lucide-react';

// Pre-packaged 360 degree panoramic room view helper
function PanoramaSphere({ url }) {
  // Load texture
  const texture = useLoader(THREE.TextureLoader, url);
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      {/* Scale x: -1 is crucial to render texture on the inside of the sphere */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Fallback in case of slow connection or texture load fail
function FallbackRoom() {
  return (
    <mesh>
      <boxGeometry args={[30, 30, 30]} />
      <meshStandardMaterial color="#0e0e11" side={THREE.BackSide} roughness={0.3} metalness={0.1} />
      <gridHelper args={[30, 30, '#d4a359', '#3f3f46']} position={[0, -14.9, 0]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#d4a359" />
      
      {/* Visual room markers / luxury pillars */}
      <mesh position={[-10, 0, -10]}><cylinderGeometry args={[0.5, 0.5, 30]} /><meshStandardMaterial color="#d4a359" metalness={0.8} roughness={0.1} /></mesh>
      <mesh position={[10, 0, -10]}><cylinderGeometry args={[0.5, 0.5, 30]} /><meshStandardMaterial color="#d4a359" metalness={0.8} roughness={0.1} /></mesh>
      <mesh position={[0, 0, 14.5]}><boxGeometry args={[10, 8, 0.2]} /><meshBasicMaterial color="rgba(212, 163, 89, 0.1)" transparent opacity={0.6} /></mesh>
    </mesh>
  );
}

const VirtualTour360 = ({ isOpen, onClose, hotelName, imageUrl }) => {
  const [loadError] = useState(false);

  if (!isOpen) return null;

  // Using a rich Unsplash hotel interior panorama or fallback to a gorgeous procedural 3D box
  const panoramaUrl = imageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80';

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(7, 7, 8, 0.92)',
        backdropFilter: 'blur(15px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '80vh',
          borderRadius: '24px',
          border: '1px solid rgba(212, 163, 89, 0.35)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header bar */}
        <div 
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(212, 163, 89, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(14, 14, 17, 0.95)',
            zIndex: 10
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={16} color="var(--accent)" className="animate-pulse" />
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                3D VIRTUAL TOUR EXPERIENCES
              </span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {hotelName || 'Luxury Resort Suite'}
            </h3>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(212, 163, 89, 0.08)',
                border: '1px solid rgba(212, 163, 89, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.2)'}
              onMouseOut={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.08)'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 3D Viewport */}
        <div style={{ flex: 1, position: 'relative', width: '100%', backgroundColor: '#020202' }}>
          
          {/* Overlay UI Controls info */}
          <div 
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              zIndex: 5,
              background: 'rgba(14, 14, 17, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(212, 163, 89, 0.25)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'none',
              maxWidth: '320px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Info size={16} color="var(--accent)" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Nhấn giữ và kéo chuột để xoay 360°, cuộn chuột để phóng to/thu nhỏ phòng nghỉ.
            </span>
          </div>

          <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
            <Suspense fallback={<FallbackRoom />}>
              {!loadError ? (
                <PanoramaSphere 
                  url={panoramaUrl} 
                />
              ) : (
                <FallbackRoom />
              )}
            </Suspense>
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              reverseOrbit={true}
              rotateSpeed={-0.4}
              dampingFactor={0.05}
              enableDamping={true}
              maxDistance={100}
              minDistance={10}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour360;
