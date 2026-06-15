import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Compass, Tv, User, LogIn, Menu, X, Hotel, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', path: '/', icon: <Hotel size={18} /> },
    { name: 'Khách sạn', path: '/hotels', icon: <Compass size={18} /> },
    { name: 'Reels Review', path: '/reels', icon: <Tv size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header / Navbar */}
      <header 
        className="glass-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          padding: scrolled ? '12px 5%' : '18px 5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(212, 163, 89, 0.15)',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none',
        }}
      >
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            fontWeight: 900, 
            fontSize: '24px', 
            fontFamily: 'var(--font-tech)',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}
        >
          <Hotel size={28} style={{ stroke: 'url(#accent-grad)', fill: 'none', strokeWidth: 2.5 }} />
          <span>Booking3TL</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '30px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '15px' }} className="desktop-nav">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={15} /> {user.user_metadata?.name || user.email} ({role})
              </span>
              
              {role === 'Owner' && (
                <button
                  onClick={() => navigate('/owner/dashboard')}
                  style={{
                    background: 'rgba(212, 163, 89, 0.15)',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Kênh Chủ Nhà
                </button>
              )}

              <button
                onClick={() => navigate(role === 'Owner' ? '/owner/profile' : role === 'Admin' ? '/admin/profile' : '/profile')}
                style={{
                  background: 'rgba(212, 163, 89, 0.08)',
                  border: '1px solid rgba(212, 163, 89, 0.3)',
                  color: 'var(--accent)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Hồ sơ
              </button>

              {role === 'Admin' && (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid #c084fc',
                    color: '#c084fc',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Kênh Admin
                </button>
              )}

              <button 
                onClick={logout}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/auth')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(212, 163, 89, 0.05)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(212, 163, 89, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 10px rgba(212, 163, 89, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 163, 89, 0.15)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 163, 89, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 163, 89, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 163, 89, 0.1)';
                }}
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
              
              <button 
                onClick={() => navigate('/auth?mode=register')}
                style={{
                  background: 'var(--accent-gradient)',
                  color: '#030712',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 15px rgba(212, 163, 89, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 163, 89, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 163, 89, 0.3)';
                }}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* SVG linear gradient definitions helper */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            top: scrolled ? '60px' : '70px',
            left: 0,
            right: 0,
            zIndex: 99,
            padding: '24px 5%',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '8px 0',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                backgroundColor: 'rgba(6, 182, 212, 0.05)',
                color: 'var(--accent)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/auth?mode=register'); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: '#030712',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer 
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid rgba(6, 182, 212, 0.15)',
          padding: '80px 5% 40px',
          marginTop: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'var(--accent-gradient)', opacity: 0.3 }} />
        
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Logo & About */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'var(--font-tech)', marginBottom: '20px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Booking3TL
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Nền tảng đặt phòng trực tuyến hàng đầu, kết nối khách hàng với các phòng khách sạn, căn hộ, resort và biệt thự sang trọng trên toàn quốc.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span style={{ color: 'var(--accent)', fontSize: '14px' }}><Mail size={18} style={{verticalAlign: 'middle', marginRight: '5px'}} /> contact@booking3tl.vn</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-tech)', fontSize: '15px', marginBottom: '20px', letterSpacing: '0.5px' }}>KHÁM PHÁ</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><Link to="/hotels" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Bản đồ Vị trí Chỗ nghỉ</Link></li>
              <li><Link to="/reels" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Reels Review Thực Tế</Link></li>
              <li><Link to="/promos" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Mã Ưu Đãi Đặc Biệt</Link></li>
              <li><Link to="/blog" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Cẩm nang du lịch</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-tech)', fontSize: '15px', marginBottom: '20px', letterSpacing: '0.5px' }}>ĐỐI TÁC</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><Link to="/owner/dashboard" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Đăng ký Chủ Nhà</Link></li>
              <li><Link to="/owner/hotels" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Quản lý Chỗ Nghỉ</Link></li>
              <li><Link to="/owner/pricing" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Thuật Toán Định Giá</Link></li>
              <li><Link to="/owner/rules" style={{ color: 'var(--text-secondary)' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Quy định cộng đồng</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-tech)', fontSize: '15px', marginBottom: '20px', letterSpacing: '0.5px' }}>BẢN TIN KHUYẾN MÃI</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '15px' }}>
              Đăng ký để nhận thông tin cập nhật về các phòng mới và mã giảm giá đặc quyền.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Địa chỉ email của bạn..." 
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.2)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button 
                style={{
                  background: 'var(--accent-gradient)',
                  color: '#04100b',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.2)'; }}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 Booking3TL. Bảo lưu mọi quyền.
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <a href="/terms" onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}>Điều khoản sử dụng</a>
            <a href="/privacy" onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}>Chính sách bảo mật</a>
          </div>
        </div>
      </footer>

      {/* CSS overrides for responsive desktop navbar */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
