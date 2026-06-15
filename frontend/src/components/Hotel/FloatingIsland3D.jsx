import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Thành phần Mô hình 3D khu nghỉ dưỡng nâng cao
function LuxuryResortIsland() {
  const groupRef = useRef();
  const yachtRef = useRef();
  const cloud1Ref = useRef();
  const cloud2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // 1. TƯƠNG TÁC LƯỚT CUỘN TRANG (Scroll Interaction)
    // Đọc trực tiếp vị trí cuộn trang để xoay mô hình (không kích hoạt React re-render, cực kỳ mượt mà)
    const scrollY = window.scrollY || 0;
    
    // Tốc độ xoay tự động chậm + Gia tăng tốc độ xoay khi cuộn trang
    const targetYRotation = t * 0.06 + scrollY * 0.003;
    // Độ nghiêng (tilt) nhẹ của mô hình theo cuộn trang
    const targetXRotation = scrollY * 0.0006 + (state.pointer.y * 0.08); // Kết hợp cả góc nhìn chuột dọc
    const targetYPointerRotation = targetYRotation + (state.pointer.x * 0.15); // Kết hợp góc nhìn chuột ngang
    
    // Interpolation (lerp) giúp chuyển động cực kỳ êm ái
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYPointerRotation, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetXRotation, 0.05);
    
    // Hiệu ứng bồng bềnh (floating) tự nhiên theo thời gian
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.1 - 0.2;

    // 2. Chuyển động của du thuyền xung quanh đảo
    if (yachtRef.current) {
      const angle = t * 0.12; // Tốc độ di chuyển
      yachtRef.current.position.x = Math.cos(angle) * 3.0;
      yachtRef.current.position.z = Math.sin(angle) * 3.0;
      yachtRef.current.rotation.y = -angle + Math.PI; // Xoay du thuyền theo hướng đi
      // Du thuyền nhấp nhô nhẹ trên sóng nước
      yachtRef.current.position.y = 0.05 + Math.sin(t * 2) * 0.015;
    }

    // 3. Chuyển động các đám mây
    if (cloud1Ref.current) {
      cloud1Ref.current.position.x = Math.sin(t * 0.1) * 3.5;
    }
    if (cloud2Ref.current) {
      cloud2Ref.current.position.x = Math.cos(t * 0.08 + 1) * 4.0;
    }
  });

  return (
    <group ref={groupRef}>
      
      {/* 🌊 Mặt Nước Biển Trong Suốt Bao Quanh Đảo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[3.8, 3.8, 0.05, 32]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.35} 
          roughness={0.1} 
          metalness={0.6}
        />
      </mesh>

      {/* 🏝️ Đất Cỏ Xanh Tròn */}
      <mesh receiveShadow cast position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.3, 0.4, 32]} />
        <meshStandardMaterial color="#059669" roughness={0.7} />
      </mesh>

      {/* 🪵 Tầng Đất Cát / Bờ biển bao quanh */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[2.26, 2.36, 0.35, 32]} />
        <meshStandardMaterial color="#eab308" roughness={0.9} />
      </mesh>
      
      {/* ⛰️ Bệ Đá Dưới Đáy Đảo (Nhìn nghệ thuật hơn) */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.0, 1.8, 0.3, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* 🏨 BIỆT THỰ LUXURY HIỆN ĐẠI (Tổ hợp hình khối kiến trúc sang trọng) */}
      <group position={[-0.2, 0.2, 0]}>
        {/* Tầng trệt (Concrete base) */}
        <mesh cast position={[-0.3, 0.3, 0]}>
          <boxGeometry args={[1.5, 0.6, 1.1]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        
        {/* Cửa kính lớn tầng trệt */}
        <mesh position={[-0.3, 0.3, 0.56]}>
          <boxGeometry args={[1.1, 0.4, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Tầng lầu (Gỗ & Kim loại đen sang trọng - Đặt lệch góc nghệ thuật) */}
        <mesh cast position={[-0.5, 0.85, 0.1]}>
          <boxGeometry args={[1.0, 0.5, 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        
        {/* Ban công kính tầng lầu */}
        <mesh position={[-0.1, 0.7, 0.4]}>
          <boxGeometry args={[0.7, 0.2, 0.02]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} roughness={0.1} />
        </mesh>

        {/* Mái đón nhô ra (Modern Flat Roof Canopy) */}
        <mesh cast position={[-0.5, 1.12, 0.1]}>
          <boxGeometry args={[1.2, 0.05, 1.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        
        {/* Boong gỗ trước nhà (Wood Deck) */}
        <mesh position={[0.6, 0.03, 0.1]}>
          <boxGeometry args={[1.2, 0.04, 1.2]} />
          <meshStandardMaterial color="#854d0e" roughness={0.8} />
        </mesh>

        {/* Bể bơi vô cực trên boong gỗ */}
        <mesh position={[0.7, 0.051, 0.1]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshStandardMaterial color="#0891b2" roughness={0.05} metalness={0.8} />
        </mesh>

        {/* Viền đá bể bơi */}
        <mesh position={[0.7, 0.045, 0.1]}>
          <boxGeometry args={[1.0, 0.01, 1.0]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>

        {/* Ghế tắm nắng nhỏ (Sunbed) */}
        <mesh position={[0.3, 0.1, 0.4]} rotation={[0, -Math.PI/6, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.35]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Ô che nắng bãi biển (Beach Umbrella) */}
        <group position={[0.3, 0.05, -0.4]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <coneGeometry args={[0.25, 0.15, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* 🌴 CÂY DỪA NHIỆT ĐỚI CHI TIẾT HƠN (Được uốn cong nhẹ) */}
      <group position={[-1.2, 0.2, -0.9]} scale={0.95}>
        {/* Thân cây dừa được ghép bởi nhiều khối uốn cong */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0.02, 0.55, 0]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.07, 0.08, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0.08, 0.9, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.05, 0.07, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        
        {/* Tán lá dừa ghép tầng xòe */}
        <group position={[0.15, 1.1, 0]} scale={0.95}>
          <mesh rotation={[0.2, 0, 0.2]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#047857" roughness={0.6} />
          </mesh>
          <mesh position={[0.1, 0, 0.1]} rotation={[-0.2, 0, -0.2]}>
            <sphereGeometry args={[0.28, 8, 8]} />
            <meshStandardMaterial color="#065f46" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Cây dừa phụ nhỏ hơn */}
      <group position={[-0.8, 0.2, -1.3]} scale={0.7} rotation={[0, Math.PI/3, 0]}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.05]}>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[-0.02, 0.55, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.05, 0.07, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <group position={[-0.1, 0.75, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#047857" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ⛵ DU THUYỀN MINI DI CHUYỂN QUANH ĐẢO */}
      <group ref={yachtRef} scale={0.35}>
        {/* Thân du thuyền */}
        <mesh cast>
          <boxGeometry args={[0.8, 0.25, 0.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Mũi thuyền nhọn (Côn) */}
        <mesh cast position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.4, 4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Kính lái tàu */}
        <mesh position={[-0.1, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.18, 0.3]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.6} roughness={0.05} />
        </mesh>
        {/* Mái che cabin */}
        <mesh position={[-0.12, 0.3, 0]}>
          <boxGeometry args={[0.4, 0.03, 0.32]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* ☁️ ĐÁM MÂY LƠ LỬNG TRONG KHÔNG TRUNG */}
      <group ref={cloud1Ref} position={[-2, 1.8, 1.5]} scale={0.4}>
        <mesh><sphereGeometry args={[0.6, 12, 12]} /><meshStandardMaterial color="#ffffff" opacity={0.8} transparent roughness={1} /></mesh>
        <mesh position={[0.4, 0.1, 0]}><sphereGeometry args={[0.45, 12, 12]} /><meshStandardMaterial color="#ffffff" opacity={0.8} transparent roughness={1} /></mesh>
        <mesh position={[-0.3, -0.05, 0]}><sphereGeometry args={[0.4, 12, 12]} /><meshStandardMaterial color="#ffffff" opacity={0.8} transparent roughness={1} /></mesh>
      </group>

      <group ref={cloud2Ref} position={[2, 2.0, -1.8]} scale={0.3}>
        <mesh><sphereGeometry args={[0.6, 12, 12]} /><meshStandardMaterial color="#ffffff" opacity={0.8} transparent roughness={1} /></mesh>
        <mesh position={[-0.4, 0.05, 0]}><sphereGeometry args={[0.45, 12, 12]} /><meshStandardMaterial color="#ffffff" opacity={0.8} transparent roughness={1} /></mesh>
      </group>

    </group>
  );
}

export default function FloatingIsland3D() {
  return (
    <div style={{ width: '100%', height: '480px', cursor: 'grab', position: 'relative' }}>
      
      {/* HUD Hướng dẫn tương tác sang trọng */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--border-color)',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          pointerEvents: 'none',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          zIndex: 5,
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px'
        }}
      >
        ✨ Cuộn trang để tự động xoay đảo • Giữ chuột & kéo để khám phá
      </div>
      
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 3.0, 6.0]} fov={45} />
        
        {/* Hệ thống ánh sáng điện ảnh (Cinematic Lighting) */}
        <ambientLight intensity={1.4} />
        
        <directionalLight 
          position={[6, 10, 5]} 
          intensity={2.2} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0001}
        />
        
        <pointLight position={[-6, 6, -6]} intensity={0.6} color="#38bdf8" />
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#fcd34d" />
        
        <LuxuryResortIsland />
        
        <OrbitControls 
          enableZoom={true} 
          minDistance={3.8} 
          maxDistance={8.5} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Giới hạn góc nghiêng để không đi xuống đáy đảo
          enablePan={false}
          dampingFactor={0.05} // Tăng độ trơn tru khi xoay
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
}
