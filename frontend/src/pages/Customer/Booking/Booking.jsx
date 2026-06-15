import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../api/bookingApi';
import { paymentApi } from '../../../api/paymentApi';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Users, ShieldCheck, CreditCard, Tag, Sparkles, User, Mail, Phone, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hotel, room } = location.state || {};

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Online Payment Gateway Simulation States
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fallback defaults if routed directly without state
  const defaultHotel = hotel || {
    idcoso: 'CS07',
    tencoso: 'Nha Trang Sea View Villa',
    diachi: 'Khu biệt thự An Viên, Trần Phú, Nha Trang',
    giaphong: 7500000
  };
  const defaultRoom = room || {
    idphong: 'P10',
    name: 'Deluxe Ocean Suite',
    price: 9375000,
    beds: '1 Giường King lớn',
    size: '65m²'
  };

  const basePrice = defaultRoom.price;
  const serviceFee = Math.round(basePrice * 0.05);
  const vatTax = Math.round(basePrice * 0.1);
  const originalTotal = basePrice + serviceFee + vatTax;
  const finalPrice = basePrice + serviceFee + vatTax - discount;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const response = await paymentApi.verifyPromo(promoCode, basePrice);
      if (response.data?.success) {
        const promoData = response.data.data;
        setDiscount(promoData.discount);
        setIsPromoApplied(true);
        alert(`Áp dụng mã giảm giá thành công! ${promoData.description}`);
      } else {
        alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      }
    } catch (err) {
      console.error(err);
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập trước khi đặt phòng và thanh toán.');
      navigate('/auth?redirect=/booking');
      return;
    }

    if (!fullName || !email || !phone) {
      alert('Vui lòng điền đầy đủ thông tin Họ tên, Email và Số điện thoại liên hệ.');
      return;
    }

    setShowPaymentGateway(true);
  };

  const handleConfirmPayment = async () => {
    if (isSubmitting) return;

    const normalizedCheckIn = checkIn || new Date().toISOString().split('T')[0];
    const normalizedCheckOut = checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const paymentMethodLabel = paymentMethod === 'credit_card' ? 'Thẻ tín dụng' : 'Chuyển khoản QR ngân hàng';

    const payload = {
      customer: {
        fullName,
        email,
        phone,
        username: user?.username || user?.id,
      },
      hotel: {
        idcoso: defaultHotel.idcoso,
        tencoso: defaultHotel.tencoso,
      },
      room: {
        idphong: defaultRoom.idphong,
        idcoso: defaultHotel.idcoso,
        name: defaultRoom.name,
        price: basePrice,
      },
      checkIn: normalizedCheckIn,
      checkOut: normalizedCheckOut,
      adults: 2,
      children: 0,
      specialRequest,
      paymentMethod: paymentMethodLabel,
      promo: {
        code: promoCode || null,
      },
      pricing: {
        basePrice,
        serviceFee,
        vatTax,
        originalTotal,
        discount,
        finalPrice,
      },
    };

    try {
      setIsProcessingPayment(true);
      setIsSubmitting(true);
      
      const response = await bookingApi.createBooking(payload);
      const savedData = response.data?.data || {};
      
      const details = {
        orderId: savedData.booking?.iddatphong || 'DP' + Math.floor(Math.random() * 90 + 10),
        paymentId: savedData.payment?.idthanhtoan || 'TT' + Math.floor(Math.random() * 90 + 10),
        fullName,
        email,
        phone,
        checkIn: normalizedCheckIn,
        checkOut: normalizedCheckOut,
        hotelName: defaultHotel.tencoso,
        roomName: defaultRoom.name,
        finalPrice: savedData.payment?.tongtienthanhtoan || finalPrice,
        paymentMethod: paymentMethod === 'credit_card' ? 'Thẻ tín dụng Quốc tế' : 'Chuyển khoản QR ngân hàng'
      };

      setSuccessDetails(details);
      setShowPaymentGateway(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Booking payment error:', err);
      alert(err.response?.data?.message || 'Không thể lưu đơn đặt phòng vào Supabase. Vui lòng kiểm tra backend và thử lại.');
    } finally {
      setIsProcessingPayment(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '40px 5% 80px 5%', display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
      
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ</span>
        <ChevronRight size={14} />
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>Chi tiết</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Thanh toán đặt phòng</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Sparkles size={24} color="var(--accent)" />
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Xác nhận Đặt phòng & Thanh toán
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Form Column */}
        <form onSubmit={handleSubmitBooking} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Guest Information */}
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '30px', border: '1px solid rgba(212,163,89,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)', marginBottom: '20px', borderBottom: '1px solid rgba(212,163,89,0.1)', paddingBottom: '10px' }}>
              THÔNG TIN KHÁCH HÀNG LIÊN HỆ
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} color="var(--accent)" /> HỌ VÀ TÊN KHÁCH HÀNG *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} color="var(--accent)" /> SỐ ĐIỆN THOẠI DI ĐỘNG *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0912345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={12} color="var(--accent)" /> EMAIL LIÊN HỆ *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>NGÀY NHẬN PHÒNG</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '11px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>NGÀY TRẢ PHÒNG</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '11px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={12} color="var(--accent)" /> YÊU CẦU ĐẶC BIỆT (KHÔNG BẮT BUỘC)
                </label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Phòng tầng cao, phòng không hút thuốc, chuẩn bị giường honeymoon..."
                  value={specialRequest}
                  onChange={e => setSpecialRequest(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '30px', border: '1px solid rgba(212,163,89,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)', marginBottom: '20px', borderBottom: '1px solid rgba(212,163,89,0.1)', paddingBottom: '10px' }}>
              PHƯƠNG THỨC THANH TOÁN
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Option 1 */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: paymentMethod === 'credit_card' ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                  background: paymentMethod === 'credit_card' ? 'rgba(212,163,89,0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <CreditCard size={20} color="var(--accent)" />
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>Thẻ tín dụng quốc tế</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hỗ trợ Visa, Mastercard, JCB bảo mật cao 3D-Secure.</span>
                </div>
              </label>

              {/* Option 2 */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: paymentMethod === 'bank_transfer' ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                  background: paymentMethod === 'bank_transfer' ? 'rgba(212,163,89,0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <CheckCircle2 size={20} color="var(--accent)" />
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>Chuyển khoản nhanh bằng mã QR</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tự động điền số tài khoản, số tiền và cú pháp chuyển khoản nội bộ VietQR.</span>
                </div>
              </label>
            </div>
          </div>

        </form>

        {/* Right Pricing Summary Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Booking Summary */}
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '24px', border: '1px solid rgba(212,163,89,0.25)', backgroundColor: 'rgba(14,14,17,0.95)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', marginBottom: '15px', borderBottom: '1px solid rgba(212,163,89,0.15)', paddingBottom: '10px' }}>
              TÓM TẮT THÔNG TIN PHÒNG
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '15px' }}>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'block' }}>{defaultHotel.tencoso}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{defaultHotel.diachi}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>Hạng phòng đã chọn</span>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{defaultRoom.name}</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                <div>🛏️ {defaultRoom.beds}</div>
                <div>📐 {defaultRoom.size}</div>
              </div>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Giá phòng (1 đêm)</span>
                <span style={{ color: 'var(--text-primary)' }}>{basePrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Phí dịch vụ & Concierge (5%)</span>
                <span style={{ color: 'var(--text-primary)' }}>{serviceFee.toLocaleString('vi-VN')}đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Thuế giá trị gia tăng VAT (10%)</span>
                <span style={{ color: 'var(--text-primary)' }}>{vatTax.toLocaleString('vi-VN')}đ</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Khuyến mãi giảm trừ</span>
                  <span>-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>TỔNG CỘNG</span>
                <span style={{ color: 'var(--accent)' }}>{finalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Promo Codes */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Tag size={12} color="var(--accent)" /> NHẬP MÃ KHUYẾN MÃI (PROMO CODE)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Gợi ý: LUXURY500 hoặc WELCOME10"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  disabled={isPromoApplied}
                  style={{ flex: 1, textTransform: 'uppercase', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '12.5px', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isPromoApplied}
                  style={{
                    background: isPromoApplied ? 'rgba(255,255,255,0.1)' : 'var(--accent-gradient)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 15px',
                    fontWeight: 800,
                    fontSize: '12px',
                    color: isPromoApplied ? 'var(--text-muted)' : '#070708',
                    cursor: isPromoApplied ? 'default' : 'pointer'
                  }}
                >
                  ÁP DỤNG
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleSubmitBooking}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '25px',
                background: 'var(--accent-gradient)',
                color: '#070708',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(212,163,89,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}
            >
              <ShieldCheck size={18} /> {isSubmitting ? 'ĐANG LƯU VÀO SUPABASE...' : 'XÁC NHẬN THANH TOÁN'}
            </button>
          </div>
        </div>

      </div>

      {/* Online Payment Gateway Overlay Modal */}
      {showPaymentGateway && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(7, 7, 8, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '500px',
              borderRadius: '28px',
              border: '1px solid var(--accent)',
              padding: '35px 25px',
              textAlign: 'center',
              backgroundColor: 'rgba(14, 14, 17, 0.98)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
              CỔNG THANH TOÁN TRỰC TUYẾN
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '25px' }}>
              Vui lòng hoàn tất giao dịch thanh toán để xác nhận đặt phòng.
            </p>

            {paymentMethod === 'credit_card' ? (
              /* Credit Card Mock Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', marginBottom: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>SỐ THẺ TÍN DỤNG</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>NGÀY HẾT HẠN</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value.substring(0, 5))}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>MÃ BẢO MẬT CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* VietQR Dynamic Online Bank Transfer Screen */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--accent)' }}>
                  <img
                    src={`https://api.vietqr.io/image/970415-101882402909-compact2.jpg?amount=${finalPrice}&addInfo=DP${fullName.replace(/\s+/g, '')}&accountName=KHANH%20DUY`}
                    alt="VietQR Code"
                    style={{ width: '220px', height: '220px', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', textAlign: 'left', width: '100%', background: 'rgba(255,255,255,0.02)', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Ngân hàng:</strong> Vietin Bank </div>
                  <div><strong>Số tài khoản:</strong> 101882402909</div>
                  <div><strong>Tên tài khoản:</strong> CONG TY TNHH BOOKING3TL</div>
                  <div><strong>Số tiền:</strong> <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{finalPrice.toLocaleString('vi-VN')}đ</span></div>
                  <div><strong>Nội dung CK:</strong> <span style={{ color: 'var(--accent)', fontWeight: 800 }}>DP{fullName.replace(/\s+/g, '')}</span></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowPaymentGateway(false)}
                disabled={isProcessingPayment}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                HỦY GIAO DỊCH
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#070708',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {isProcessingPayment ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐÃ THANH TOÁN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animated Invoice Modal */}
      {isSuccess && successDetails && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(7, 7, 8, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '28px',
              border: '1px solid var(--accent)',
              padding: '40px 30px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.3s ease-out',
              backgroundColor: 'rgba(14, 14, 17, 0.98)',
            }}
          >
            {/* Animated green check */}
            <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%', color: '#10b981', marginBottom: '20px' }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Giao dịch thành công!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '30px' }}>
              Cảm ơn quý khách đã tin tưởng và lựa chọn Booking3TL.
            </p>

            {/* Invoice Table */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MÃ ĐƠN ĐẶT PHÒNG:</span>
                <strong style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'var(--font-tech)' }}>{successDetails.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Khách hàng:</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{successDetails.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cơ sở lưu trú:</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{successDetails.hotelName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hạng phòng:</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{successDetails.roomName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ngày nhận/trả:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{successDetails.checkIn} đến {successDetails.checkOut}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Thanh toán qua:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{successDetails.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', fontSize: '16px', fontWeight: 800 }}>
                <span style={{ color: 'var(--text-secondary)' }}>TỔNG TIỀN THANH TOÁN:</span>
                <span style={{ color: 'var(--accent)' }}>{successDetails.finalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                navigate('/');
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent-gradient)',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13.5px',
                color: '#070708',
                cursor: 'pointer'
              }}
            >
              TRỞ VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Booking;
