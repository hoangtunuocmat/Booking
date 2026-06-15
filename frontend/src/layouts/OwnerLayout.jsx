import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Building2, ClipboardList, LogOut, Home, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OwnerLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
    { to: '/owner/profile', label: 'Hồ sơ cá nhân', icon: <User size={18} /> },
    { to: '/owner/hotels', label: 'Quản lý khách sạn', icon: <Building2 size={18} /> },
    { to: '/owner/orders', label: 'Quản lý đơn đặt phòng', icon: <ClipboardList size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '280px 1fr', background: 'var(--bg-primary)' }}>
      <aside className="glass-panel" style={{ borderRadius: 0, padding: '28px 22px', borderRight: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent)', marginBottom: '8px' }}>Owner Center</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '28px' }}>{user?.user_metadata?.name || user?.username}</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                color: isActive ? '#070708' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                fontWeight: 800,
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => navigate('/')} style={{ padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Home size={16} /> Về trang chủ
          </button>
          <button onClick={() => { logout(); navigate('/auth'); }} style={{ padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      <main style={{ padding: '32px', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
