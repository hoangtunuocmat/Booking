import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck, Cpu, Fingerprint, Eye, EyeOff, KeyRound, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // Set mode: 'login' or 'register'
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bioScanning, setBioScanning] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (mode === 'register' && !formData.name.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!formData.email.trim()) {
      newErrors.email = mode === 'login' ? 'Vui lòng nhập email hoặc username' : 'Vui lòng nhập email';
    } else if (mode === 'register' && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (mode === 'register' && !formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải tối thiểu 6 ký tự';
    }
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (mode === 'register' && !formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn cần đồng ý với các điều khoản';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          alert('Đăng nhập hệ thống thành công!');
          const profile = JSON.parse(localStorage.getItem('booking_profile') || '{}');
          if (profile.vaitro === 'Owner') navigate('/owner/dashboard');
          else if (profile.vaitro === 'Admin') navigate('/admin/dashboard');
          else navigate(searchParams.get('redirect') || '/');
        } else {
          alert('Đăng nhập thất bại.');
        }
      } else {
        const res = await register(
          formData.name,
          formData.email,
          formData.phone,
          formData.password,
          formData.role || 'Customer'
        );
        if (res.success) {
          alert('Đăng ký tài khoản thành công! Vui lòng tiến hành đăng nhập.');
          setMode('login');
          navigate('/auth?mode=login');
        } else {
          alert('Đăng ký thất bại.');
        }
      }
    } catch (err) {
      alert(err.message || 'Thao tác xác thực gặp lỗi kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate fingerprint scan
  const handleBioScan = () => {
    if (bioScanning || bioSuccess) return;
    setBioScanning(true);
    setErrors({});
    
    setTimeout(() => {
      setBioScanning(false);
      setBioSuccess(true);
      // Automatically login on biometric success
      setTimeout(() => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          alert('Nhận diện sinh trắc học thành công! Đang kết nối thiết bị...');
          navigate('/');
        }, 1500);
      }, 500);
    }, 3000);
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Absolute floating cyber tech elements */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          zIndex: 0,
          filter: 'blur(40px)'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          zIndex: 0,
          filter: 'blur(40px)'
        }}
      />

      {/* Futuristic Grid Overlay decoration */}
      <div 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px',
          opacity: 0.3,
          pointerEvents: 'none'
        }}
      />

      {/* Auth Panel */}
      <div 
        className="glass-panel scanline"
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '24px',
          padding: '45px 35px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1,
          animation: 'fadeIn 0.6s ease-out',
        }}
      >
        {/* Terminal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="var(--accent)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-tech)', color: 'var(--accent)', letterSpacing: '1px', fontWeight: 700 }}>
              SECURE LINK // PORT_443
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', opacity: 0.8 }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308', opacity: 0.8 }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', opacity: 0.8 }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', margin: 0, letterSpacing: '1px' }}>
            {mode === 'login' ? 'ĐĂNG NHẬP HỆ THỐNG' : 'ĐĂNG KÝ MẠNG LƯỚI'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px' }}>
            {mode === 'login' ? 'Nhập thông tin giao thức để truy cập cổng dịch vụ 3D' : 'Khởi tạo danh tính số của bạn trên nền tảng LuxStay'}
          </p>
        </div>

        {/* Form Selection Tabs */}
        <div style={{ display: 'flex', gap: '10px', backgroundColor: 'rgba(6, 182, 212, 0.05)', padding: '5px', borderRadius: '14px', border: '1px solid rgba(6, 182, 212, 0.15)', marginBottom: '30px' }}>
          <button 
            onClick={() => { setMode('login'); navigate('/auth?mode=login'); setErrors({}); }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: mode === 'login' ? 'var(--accent-gradient)' : 'transparent',
              color: mode === 'login' ? '#030712' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => { setMode('register'); navigate('/auth?mode=register'); setErrors({}); }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: mode === 'register' ? 'var(--accent-gradient)' : 'transparent',
              color: mode === 'register' ? '#030712' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Đăng ký
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Full Name (Register only) */}
          {mode === 'register' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-tech)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={12} /> HỌ VÀ TÊN
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Nhập họ tên của bạn..." 
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(6, 182, 212, 0.03)',
                      border: errors.name ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.25)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.currentTarget.style.borderColor = errors.name ? '#ef4444' : 'rgba(6, 182, 212, 0.25)'}
                  />
                </div>
                {errors.name && <span style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left' }}>{errors.name}</span>}
              </div>

              {/* Account Role Dropdown Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-tech)', letterSpacing: '0.5px' }}>
                  VAI TRÒ TÀI KHOẢN
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(6, 182, 212, 0.03)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Customer">Khách hàng (Đặt phòng)</option>
                  <option value="Owner">Chủ sở hữu / Host (Cho thuê)</option>
                  <option value="Admin">Quản trị viên (Admin hệ thống)</option>
                </select>
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-tech)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={12} /> ĐỊA CHỈ EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={mode === 'login' ? 'text' : 'email'} 
                name="email"
                placeholder="Email hoặc username: kh01, csh01, nv02" 
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(6, 182, 212, 0.03)',
                  border: errors.email ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#ef4444' : 'rgba(6, 182, 212, 0.25)'}
              />
            </div>
            {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left' }}>{errors.email}</span>}
          </div>

          {/* Phone (Register only) */}
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-tech)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={12} /> SỐ ĐIỆN THOẠI
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Nhập số liên hệ..." 
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(6, 182, 212, 0.03)',
                    border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.phone ? '#ef4444' : 'rgba(6, 182, 212, 0.25)'}
                />
              </div>
              {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left' }}>{errors.phone}</span>}
            </div>
          )}

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-tech)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} /> MẬT KHẨU KHÓA
              </label>
              {mode === 'login' && (
                <span 
                  onClick={() => alert('Yêu cầu đặt lại mật khẩu đã gửi tới máy chủ.')}
                  style={{ fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseOver={e=>e.currentTarget.style.color='var(--accent)'}
                  onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}
                >
                  Quên mật khẩu?
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(6, 182, 212, 0.03)',
                  border: errors.password ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '12px',
                  padding: '14px 45px 14px 18px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#ef4444' : 'rgba(6, 182, 212, 0.25)'}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left' }}>{errors.password}</span>}
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-tech)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={12} /> XÁC NHẬN MẬT KHẨU
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(6, 182, 212, 0.03)',
                    border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.confirmPassword ? '#ef4444' : 'rgba(6, 182, 212, 0.25)'}
                />
              </div>
              {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left' }}>{errors.confirmPassword}</span>}
            </div>
          )}

          {/* Terms checkbox (Register only) */}
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                <input 
                  type="checkbox" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  style={{ marginTop: '4px', accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  Tôi chấp nhận tất cả các giao thức bảo mật thông tin và điều khoản sử dụng mạng lưới.
                </span>
              </label>
              {errors.agreeToTerms && <span style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left', marginLeft: '24px' }}>{errors.agreeToTerms}</span>}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading || bioScanning}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--accent-gradient)',
              color: '#030712',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 800,
              fontFamily: 'var(--font-tech)',
              cursor: (isLoading || bioScanning) ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.35)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '10px'
            }}
            onMouseOver={e => { if(!isLoading && !bioScanning) { e.currentTarget.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseOut={e => { if(!isLoading && !bioScanning) { e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.35)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
          >
            {isLoading ? (
              <>
                <div style={{ border: '2px solid rgba(3,7,18,0.2)', borderTop: '2px solid #030712', borderRadius: '50%', width: '18px', height: '18px', animation: 'spin 0.8s linear infinite' }} />
                <span>Đang mã hóa...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>{mode === 'login' ? 'Kết nối terminal' : 'Khởi tạo tài khoản'}</span>
              </>
            )}
          </button>
        </form>

        {/* Biometric Auth option (Login mode only) */}
        {mode === 'login' && (
          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(6, 182, 212, 0.15)', paddingTop: '25px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-tech)', color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '15px' }}>
              HOẶC SỬ DỤNG SINH TRẮC HỌC
            </span>
            
            <button 
              onClick={handleBioScan}
              disabled={isLoading || bioScanning || bioSuccess}
              style={{
                background: 'rgba(6, 182, 212, 0.05)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                cursor: (isLoading || bioScanning || bioSuccess) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e => { if(!isLoading && !bioScanning && !bioSuccess) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.1)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.2)'; } }}
              onMouseOut={e => { if(!isLoading && !bioScanning && !bioSuccess) { e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)'; e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.05)'; e.currentTarget.style.boxShadow = 'none'; } }}
            >
              <div style={{ position: 'relative' }}>
                <Fingerprint 
                  size={48} 
                  color={bioSuccess ? 'var(--accent)' : bioScanning ? 'var(--accent-purple)' : 'var(--text-secondary)'} 
                  style={{ animation: bioScanning ? 'pulse 1s infinite' : 'none' }}
                />
                {bioScanning && (
                  <div 
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'var(--accent)',
                      animation: 'bioScanLine 1.5s ease-in-out infinite',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
              <span style={{ fontSize: '13px', color: bioSuccess ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600 }}>
                {bioSuccess ? 'Đã xác thực danh tính' : bioScanning ? 'Đang quét vân tay...' : 'Chạm để quét vân tay (TouchID)'}
              </span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes bioScanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Auth;
