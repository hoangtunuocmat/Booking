import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';

const HotelCard = ({ hotel, onExplore3D }) => {
  const navigate = useNavigate();

  // Hàm băm (hash) chuỗi để chuyển đổi bất kỳ chuỗi nào thành số nguyên dương ổn định
  const getHashFromString = (str) => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hashId = getHashFromString(hotel.idcoso);

  // Mảng giá phòng giả lập phong丰富 từ thấp đến cao
  const mockPrices = [950000, 1500000, 2800000, 4200000, 7500000, 11800000];
  const finalPrice = hotel.giaphong || mockPrices[hashId % mockPrices.length];
  const formattedPrice = finalPrice.toLocaleString('vi-VN');

  // Ảnh nghỉ dưỡng mặc định chất lượng cao từ Unsplash
  const defaultImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80'
  ];
  
  // Lấy ảnh dựa trên hashId để đảm bảo không bao giờ bị NaN
  const hotelImg = hotel.hinhanh || defaultImages[hashId % defaultImages.length];

  return (
    <div 
      className="glass-panel glow-hover"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '420px',
      }}
      onClick={() => navigate(`/hotel/${hotel.idcoso}`)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Top Banner Tag & Favorite button */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 2 }}>
        <span 
          style={{
            background: 'var(--accent-gradient)',
            color: '#0b0f19',
            padding: '5px 12px',
            borderRadius: '30px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {hotel.sosao >= 5 ? 'Luxury' : 'Trending'}
        </span>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          // Logic xử lý yêu thích
        }}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 2,
          background: 'rgba(11, 15, 25, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.color = '#ef4444';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Heart size={18} fill="currentColor" style={{ strokeWidth: 2 }} />
      </button>

      {/* Image container with Zoom on hover */}
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
        <img 
          src={hotelImg} 
          alt={hotel.tencoso}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => {
            // Đảm bảo có ảnh dự phòng tuyệt đối nếu ảnh online lỗi tải
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
          }}
        />
        
        {/* Floating Explore 3D Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onExplore3D) onExplore3D(hotel);
          }}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 3,
            background: 'rgba(7, 7, 8, 0.85)',
            border: '1px solid var(--accent)',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'var(--accent-gradient)';
            e.currentTarget.style.color = '#070708';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(7, 7, 8, 0.85)';
            e.currentTarget.style.color = 'var(--accent)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Explore 3D
        </button>
      </div>
      
      {/* Content Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Stars */}
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginBottom: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < (hotel.sosao || 5) ? 'var(--accent)' : 'none'} 
                color={i < (hotel.sosao || 5) ? 'var(--accent)' : 'var(--text-muted)'} 
              />
            ))}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>({(hotel.sosao || 5)}.0)</span>
          </div>

          {/* Title */}
          <h3 
            style={{ 
              fontSize: '18px', 
              fontWeight: 700, 
              color: 'var(--text-primary)', 
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {hotel.tencoso}
          </h3>

          {/* Address */}
          <p 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '13px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              marginBottom: '15px'
            }}
          >
            <MapPin size={14} color="var(--accent)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hotel.diachi}</span>
          </p>
        </div>

        {/* Price & Booking action */}
        <div 
          style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '15px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Giá từ</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{formattedPrice}đ</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/đêm</span>
          </div>
          
          <span 
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            Chi tiết &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;