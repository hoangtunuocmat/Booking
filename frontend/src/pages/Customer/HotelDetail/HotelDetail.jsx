import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelApi } from '../../../api/hotelApi';
import VirtualTour360 from '../../../components/Hotel/VirtualTour360';
import { MapPin, Star, Compass, ShieldCheck, Wifi, Coffee, Sparkles, Tv, Wind, CheckCircle2, ChevronRight } from 'lucide-react';

const mockHotels = [
  {
    idcoso: 'CS03',
    tencoso: 'Hanoi Old Quarter Hotel',
    diachi: '12 Hàng Bạc, Hoàn Kiếm, Hà Nội',
    sosao: 3,
    giaphong: 950000,
    mota: 'Tọa lạc ngay trung tâm Phố Cổ Hà Nội rực rỡ sắc màu, Hanoi Old Quarter Hotel mang đến trải nghiệm nghỉ dưỡng cổ điển kết hợp tinh tế với các tiện ích hiện đại. Khách sạn là điểm khởi đầu hoàn hảo để khám phá nét văn hóa đặc sắc và tinh hoa ẩm thực của thủ đô nghìn năm văn hiến.',
    hinhanh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    idcoso: 'CS04',
    tencoso: 'The Landmark Luxury Apartment',
    diachi: '208 Nguyễn Hữu Cảnh, Quận 1, TP HCM',
    sosao: 5,
    giaphong: 2800000,
    mota: 'Nằm tại vị trí đắc địa nhất Sài Gòn rực rỡ, The Landmark mang đến những căn hộ dịch vụ siêu sang với tầm nhìn Panorama ôm trọn dòng sông Sài Gòn thơ mộng. Thiết kế kính tràn viền cao cấp cùng nội thất châu Âu nhập khẩu mang lại chuẩn mực sống đỉnh cao cho giới thượng lưu.',
    hinhanh: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    idcoso: 'CS05',
    tencoso: 'Phú Quốc Sunset Resort',
    diachi: 'Bãi Trường, Dương Đông, Phú Quốc',
    sosao: 4,
    giaphong: 1500000,
    mota: 'Nằm dọc theo bãi cát vàng óng của Bãi Trường, Phú Quốc Sunset Resort là thiên đường nghỉ dưỡng nhiệt đới ngập tràn nắng gió. Những căn biệt thự mái lá ẩn mình dưới rặng dừa xanh mướt mang đến sự riêng tư tuyệt đối, nơi bạn có thể ngắm hoàng hôn buông xuống đẹp nhất đảo Ngọc.',
    hinhanh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    idcoso: 'CS06',
    tencoso: 'Đà Lạt Mộng Mơ Homestay',
    diachi: 'Đường Hoa Cẩm Tú Cầu, Hồ Tuyền Lâm',
    sosao: 2,
    giaphong: 1200000,
    mota: 'Nằm chênh vênh bên sườn đồi thoai thoải hướng trọn view rừng thông và mặt hồ Tuyền Lâm bảng lảng sương mù, homestay là không gian chữa lành lý tưởng. Thiết kế gỗ mộc mạc kết hợp lò sưởi ấm cúng mang lại cảm giác an yên như đang trở về nhà.',
    hinhanh: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    idcoso: 'CS07',
    tencoso: 'Nha Trang Sea View Villa',
    diachi: 'Khu biệt thự An Viên, Trần Phú, Nha Trang',
    sosao: 5,
    giaphong: 7500000,
    mota: 'Tuyệt tác kiến trúc hiện đại tọa lạc tại khu biệt thự biệt lập An Viên. Villa sở hữu hồ bơi vô cực rộng lớn tràn bờ hướng ra biển xanh ngắt, phòng khách mở phóng khoáng đón trọn làn gió đại dương và trang thiết bị hiện đại hàng đầu thị trường nghỉ dưỡng.',
    hinhanh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    idcoso: 'CS08',
    tencoso: 'An Bang Boutique Hotel',
    diachi: 'Bãi biển An Bàng, Hội An, Quảng Nam',
    sosao: 4,
    giaphong: 1800000,
    mota: 'An Bang Boutique tái hiện không gian giao thoa Đông Tây đậm chất Indochine trầm mặc. Chỉ cách bãi biển An Bàng vài bước chân, đây là điểm dừng chân hoàn hảo để lắng nghe tiếng sóng vỗ rầm rì và tận hưởng không khí cổ kính yên tĩnh đặc trưng của phố Hội.',
    hinhanh: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

const roomIdByHotel = {
  CS03: ['P04', 'P03', 'P04'],
  CS04: ['P05', 'P06', 'P05'],
  CS05: ['P07', 'P08', 'P07'],
  CS06: ['P09', 'P09', 'P09'],
  CS07: ['P10', 'P10', 'P10'],
};

const defaultImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'
];

const getHashFromString = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const normalizeHotel = (hotelData, hotelId) => {
  const fallback = mockHotels.find(h => h.idcoso === hotelId) || mockHotels[0];
  const source = hotelData || fallback;
  const hash = getHashFromString(source.idcoso || hotelId);
  const fallbackImage = fallback.hinhanh || defaultImages[hash % defaultImages.length];

  return {
    ...fallback,
    ...source,
    idcoso: source.idcoso || hotelId || fallback.idcoso,
    giaphong: Number(source.giaphong || fallback.giaphong || 950000),
    hinhanh: source.hinhanh || fallbackImage,
    images: source.images?.length ? source.images : (fallback.images || [fallbackImage, defaultImages[(hash + 1) % defaultImages.length], defaultImages[(hash + 2) % defaultImages.length]]),
    sosao: Number(source.sosao || fallback.sosao || 4),
  };
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [is3DOpen, setIs3DOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    hotelApi.getHotelById(id)
      .then(res => {
        if (!isMounted) return;
        const data = res.data?.data || res.data;
        if (data && data.tencoso) {
          setHotel(normalizeHotel(data, id));
        } else {
          fallbackLoad();
        }
      })
      .catch(() => {
        if (!isMounted) return;
        fallbackLoad();
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const fallbackLoad = () => {
    const found = mockHotels.find(h => h.idcoso === id);
    setHotel(normalizeHotel(found, id));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--accent)' }}>
        <div style={{ border: '3px solid rgba(212, 163, 89, 0.1)', borderTop: '3px solid var(--accent)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h3>Không tìm thấy thông tin cơ sở nghỉ dưỡng.</h3>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--accent-gradient)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}>
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  // Generate mock room layouts for details
  const roomTypes = [
    {
      id: 'R1',
      idphong: roomIdByHotel[hotel.idcoso]?.[0],
      name: 'Deluxe Ocean Suite',
      size: '65m²',
      beds: '1 Giường King lớn',
      capacity: '2 người lớn & 1 trẻ em',
      price: Math.round(hotel.giaphong * 1.25),
      image: hotel.images?.[1] || hotel.hinhanh,
      features: ['Ban công hướng biển', 'Bồn tắm nằm cao cấp', 'Trà & Cà phê miễn phí', 'Minibar đầy đủ']
    },
    {
      id: 'R2',
      idphong: roomIdByHotel[hotel.idcoso]?.[1],
      name: 'Presidential Sky Villa',
      size: '180m²',
      beds: '2 Giường King cực lớn',
      capacity: '4 người lớn & 2 trẻ em',
      price: Math.round(hotel.giaphong * 2.8),
      image: hotel.images?.[2] || hotel.hinhanh,
      features: ['Hồ bơi vô cực riêng biệt', 'Quản gia phục vụ 24/7', 'Phòng khách mở hướng biển', 'Rượu vang chào mừng']
    },
    {
      id: 'R3',
      idphong: roomIdByHotel[hotel.idcoso]?.[2],
      name: 'Executive Club Room',
      size: '45m²',
      beds: '1 Giường đôi hoặc 2 giường đơn',
      capacity: '2 người lớn',
      price: hotel.giaphong,
      image: hotel.hinhanh,
      features: ['Bàn làm việc thông minh', 'Phòng tắm đứng vòi sen', 'Miễn phí giặt ủi nhẹ', 'Tầm nhìn toàn cảnh đồi/sông']
    }
  ];

  const handleBookRoom = (room) => {
    navigate('/booking', { state: { hotel, room: { ...room, idcoso: hotel.idcoso } } });
  };

  return (
    <div style={{ padding: '40px 5% 80px 5%', display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
      
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Chi tiết cơ sở</span>
      </div>

      {/* Title & Actions Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
            {[...Array(hotel.sosao)].map((_, i) => (
              <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />
            ))}
            <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 700, marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              LUXURY CHỨNG NHẬN
            </span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            {hotel.tencoso}
          </h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '8px' }}>
            <MapPin size={16} color="var(--accent)" /> {hotel.diachi}
          </p>
        </div>

        {/* Explore 360° tour button */}
        <button
          onClick={() => setIs3DOpen(true)}
          style={{
            background: 'var(--accent-gradient)',
            border: 'none',
            borderRadius: '14px',
            padding: '14px 28px',
            color: '#070708',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(212, 163, 89, 0.35)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
          onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}
        >
          <Compass size={18} /> KHÁM PHÁ CHI TIẾT 3D / 360°
        </button>
      </div>

      {/* Premium Image Gallery Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '15px', 
          height: '420px', 
          borderRadius: '24px', 
          overflow: 'hidden',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img src={hotel.hinhanh} alt={hotel.tencoso} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '15px', height: '100%' }}>
          <div style={{ position: 'relative', height: '100%' }}>
            <img src={hotel.images?.[1] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'} alt="Detail 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'relative', height: '100%' }}>
            <img src={hotel.images?.[2] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'} alt="Detail 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* Main Info Blocks Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '20px' }}>
        
        {/* Left Column: Description & Room Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
          
          {/* Description */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              Mô tả không gian & Tiện ích nổi bật
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {hotel.mota || 'Không gian nghỉ dưỡng tuyệt hảo được thiết kế dành riêng cho bạn.'}
            </p>
          </div>

          {/* Premium Amenities list */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
              Trang bị dịch vụ cao cấp
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <div style={{ color: 'var(--accent)', background: 'rgba(212,163,89,0.1)', padding: '8px', borderRadius: '8px' }}><Wifi size={16} /></div>
                WiFi miễn phí tốc độ cao
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <div style={{ color: 'var(--accent)', background: 'rgba(212,163,89,0.1)', padding: '8px', borderRadius: '8px' }}><Coffee size={16} /></div>
                Bữa sáng buffet thượng lưu
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <div style={{ color: 'var(--accent)', background: 'rgba(212,163,89,0.1)', padding: '8px', borderRadius: '8px' }}><Tv size={16} /></div>
                Truyền hình vệ tinh SmartTV
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <div style={{ color: 'var(--accent)', background: 'rgba(212,163,89,0.1)', padding: '8px', borderRadius: '8px' }}><Wind size={16} /></div>
                Điều hòa nhiệt độ độc lập
              </div>
            </div>
          </div>

          {/* Available Rooms List Selection */}
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--accent)" /> LỰA CHỌN PHÒNG NGHỈ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {roomTypes.map((room) => (
                <div 
                  key={room.id}
                  className="glass-panel"
                  style={{
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 163, 89, 0.2)',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={e=>e.currentTarget.style.borderColor='var(--accent)'}
                  onMouseOut={e=>e.currentTarget.style.borderColor='rgba(212, 163, 89, 0.2)'}
                >
                  <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          {room.name}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px' }}>
                          {room.size}
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600, margin: '0 0 14px 0' }}>
                        🛌 {room.beds} | 👥 Tối đa {room.capacity}
                      </p>
                      
                      {/* Features Check */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                        {room.features.map((feat, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <CheckCircle2 size={13} color="var(--accent)" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Giá mỗi đêm từ</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{room.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <button
                        onClick={() => handleBookRoom(room)}
                        style={{
                          background: 'var(--accent-gradient)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '10px 20px',
                          color: '#070708',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ĐẶT PHÒNG NGAY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Policies & Quick Booking Panel Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div 
            className="glass-panel" 
            style={{ 
              borderRadius: '24px', 
              padding: '24px', 
              border: '1px solid rgba(212,163,89,0.25)', 
              position: 'sticky', 
              top: '100px',
              backgroundColor: 'rgba(14,14,17,0.9)'
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', marginBottom: '15px', borderBottom: '1px solid rgba(212,163,89,0.15)', paddingBottom: '10px' }}>
              CHÍNH SÁCH QUY ĐỊNH
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>⏱️ Nhận phòng / Trả phòng</strong>
                Nhận phòng từ 14:00 - Trả phòng trước 12:00 trưa.
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>💳 Quy định đặt cọc</strong>
                Yêu cầu đặt cọc bằng thẻ tín dụng hoặc chuyển khoản trước khi nhận phòng.
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>🔒 Hủy phòng linh hoạt</strong>
                Hủy phòng miễn phí trước 48 giờ trước ngày nhận phòng (áp dụng tùy hạng phòng).
              </div>
            </div>
            
            <div style={{ background: 'rgba(212,163,89,0.06)', borderRadius: '12px', border: '1px solid rgba(212,163,89,0.2)', padding: '16px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--accent)" />
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Cam kết giá tốt nhất:</span> Booking3TL cam kết mức giá tối ưu và bảo mật thông tin đặt chỗ.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3D Virtual Tour sphere controls overlay */}
      <VirtualTour360
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
        hotelName={hotel.tencoso}
        imageUrl={hotel.hinhanh}
      />

    </div>
  );
};

export default HotelDetail;
