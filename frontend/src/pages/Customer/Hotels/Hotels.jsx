import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hotelApi } from '../../../api/hotelApi';
import { MapPin, Star, Calendar, Users, Sparkles, Navigation, ShieldCheck, Compass, Info, ArrowLeft } from 'lucide-react';

const mockHotels = [
  {
    idcoso: 'CS03',
    tencoso: 'Hanoi Old Quarter Hotel',
    diachi: '12 Hàng Bạc, Hoàn Kiếm, Hà Nội',
    sosao: 3,
    giaphong: 950000,
    coordinates: { x: '55%', y: '25%' }, // Location on SVG map
    category: 'hotel',
    vacancies: [
      { name: 'Standard Room', count: 5, price: 950000 },
      { name: 'Family Suite', count: 2, price: 1650000 }
    ],
    hinhanh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS04',
    tencoso: 'The Landmark Luxury Apartment',
    diachi: '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP HCM',
    sosao: 5,
    giaphong: 2800000,
    coordinates: { x: '45%', y: '80%' },
    category: 'apartment',
    vacancies: [
      { name: 'Penthouse Apartment', count: 1, price: 5800000 },
      { name: 'Studio Room', count: 4, price: 2800000 }
    ],
    hinhanh: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS05',
    tencoso: 'Phú Quốc Sunset Resort',
    diachi: 'Bãi Trường, Dương Đông, Phú Quốc',
    sosao: 4,
    giaphong: 1500000,
    coordinates: { x: '25%', y: '90%' },
    category: 'resort',
    vacancies: [
      { name: 'Beachfront Bungalow', count: 3, price: 2200000 },
      { name: 'Garden Deluxe', count: 8, price: 1500000 }
    ],
    hinhanh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS06',
    tencoso: 'Đà Lạt Mộng Mơ Homestay',
    diachi: 'Đường Hoa Cẩm Tú Cầu, Hồ Tuyền Lâm, Đà Lạt',
    sosao: 2,
    giaphong: 1200000,
    coordinates: { x: '52%', y: '70%' },
    category: 'apartment',
    vacancies: [
      { name: 'Wooden Cabin', count: 2, price: 1200000 },
      { name: 'Pine View Villa Room', count: 1, price: 1800000 }
    ],
    hinhanh: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS07',
    tencoso: 'Nha Trang Sea View Villa',
    diachi: 'Khu biệt thự An Viên, Trần Phú, Nha Trang',
    sosao: 5,
    giaphong: 7500000,
    coordinates: { x: '58%', y: '75%' },
    category: 'villa',
    vacancies: [
      { name: 'Ocean Infinity Pool Villa', count: 1, price: 7500000 }
    ],
    hinhanh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS08',
    tencoso: 'An Bang Boutique Hotel',
    diachi: 'Bãi biển An Bàng, Hội An, Quảng Nam',
    sosao: 4,
    giaphong: 1800000,
    coordinates: { x: '60%', y: '50%' },
    category: 'hotel',
    vacancies: [
      { name: 'Indochine Superior Room', count: 3, price: 1800000 },
      { name: 'An Bang Garden Suite', count: 2, price: 2500000 }
    ],
    hinhanh: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80'
  }
];

const Hotels = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state || {};

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: routeState.searchQuery?.location || '',
    checkIn: routeState.searchQuery?.checkIn || '',
    checkOut: routeState.searchQuery?.checkOut || '',
    guests: routeState.searchQuery?.guests || '1'
  });

  const [selectedCategory, setSelectedCategory] = useState(routeState.category || 'all');
  const [hoveredHotel, setHoveredHotel] = useState(null);
  const [selectedMapPin, setSelectedMapPin] = useState(null);
  const [mapAddress, setMapAddress] = useState('Vietnam');

  useEffect(() => {
    if (routeState.searchQuery) {
      setSearchParams({
        location: routeState.searchQuery.location || '',
        checkIn: routeState.searchQuery.checkIn || '',
        checkOut: routeState.searchQuery.checkOut || '',
        guests: routeState.searchQuery.guests || '1'
      });
    }
    if (routeState.category) {
      setSelectedCategory(routeState.category);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedMapPin) {
      const hotel = hotels.find(h => h.idcoso === selectedMapPin);
      if (hotel) setMapAddress(hotel.diachi);
    } else if (searchParams.location) {
      setMapAddress(searchParams.location);
    } else {
      setMapAddress('Vietnam');
    }
  }, [selectedMapPin, searchParams.location, hotels]);

  useEffect(() => {
    setLoading(true);
    hotelApi.getHotels()
      .then(res => {
        const data = res.data?.data || res.data || [];
        if (data.length > 0) {
          // Merge API data coordinates from local mock
          const merged = data.map(h => {
            const matched = mockHotels.find(m => m.idcoso === h.idcoso);
            return {
              ...h,
              hinhanh: h.hinhanh || matched?.hinhanh || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
              coordinates: matched?.coordinates || { x: '50%', y: '50%' },
              category: matched?.category || 'hotel',
              vacancies: matched?.vacancies || [{ name: 'Superior Room', count: 3, price: h.giaphong }]
            };
          });
          setHotels(merged);
        } else {
          setHotels(mockHotels);
        }
      })
      .catch(() => {
        setHotels(mockHotels);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const filteredHotels = hotels.filter(hotel => {
    // 1. Search Query Filter
    if (searchParams.location) {
      const q = searchParams.location.toLowerCase();
      const name = (hotel.tencoso || '').toLowerCase();
      const addr = (hotel.diachi || '').toLowerCase();
      if (!name.includes(q) && !addr.includes(q)) return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      if (selectedCategory !== (hotel.category || '')) return false;
    }

    // 3. Map Pin Filter
    if (selectedMapPin) {
      if (hotel.idcoso !== selectedMapPin) return false;
    }

    return true;
  });

  return (
    <div style={{ padding: '30px 5% 80px', width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Search Header Bar */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '20px 25px', border: '1px solid rgba(212, 163, 89, 0.25)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>
          <Compass size={14} color="var(--accent)" />
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ</span>
          <span>&rsaquo;</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Bản đồ vị trí & phòng trống</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)' }}>ĐIỂM ĐẾN</span>
            <input
              type="text"
              name="location"
              placeholder="Đà Lạt, Nha Trang, Phú Quốc..."
              value={searchParams.location}
              onChange={handleSearchChange}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)' }}>NHẬN PHÒNG</span>
            <input
              type="date"
              name="checkIn"
              value={searchParams.checkIn}
              onChange={handleSearchChange}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '9px 12px', color: '#fff', fontSize: '13.5px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)' }}>TRẢ PHÒNG</span>
            <input
              type="date"
              name="checkOut"
              value={searchParams.checkOut}
              onChange={handleSearchChange}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,163,89,0.15)', borderRadius: '10px', padding: '9px 12px', color: '#fff', fontSize: '13.5px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)' }}>SỐ KHÁCH</span>
            <select
              name="guests"
              value={searchParams.guests}
              onChange={handleSearchChange}
              style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(212, 163, 89, 0.15)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px', outline: 'none' }}
            >
              <option value="1">1 khách</option>
              <option value="2">2 khách</option>
              <option value="3">Gia đình (3-4 người)</option>
              <option value="4">Đoàn đông (5+ người)</option>
            </select>
          </div>

          <button
            onClick={() => setSelectedMapPin(null)}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 22px',
              color: '#070708',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              height: '40px'
            }}
          >
            LÀM MỚI BỘ LỌC
          </button>
        </div>
      </div>

      {/* Category selector row */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
        {[
          { id: 'all', name: 'Tất cả chỗ nghỉ' },
          { id: 'hotel', name: 'Khách sạn' },
          { id: 'apartment', name: 'Căn hộ / Homestay' },
          { id: 'resort', name: 'Khu nghỉ dưỡng' },
          { id: 'villa', name: 'Biệt thự / Villa' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === cat.id ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
              background: selectedCategory === cat.id ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.02)',
              color: selectedCategory === cat.id ? '#070708' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              transition: 'all 0.3s ease'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Split Split-screen: Map Left, Listings Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '430px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Map Column (Left) */}
        <div 
          className="glass-panel" 
          style={{ 
            borderRadius: '24px', 
            border: '1px solid rgba(212,163,89,0.3)', 
            height: '620px', 
            padding: '20px', 
            position: 'sticky', 
            top: '100px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px',
            backgroundColor: 'rgba(14,14,17,0.95)'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={14} /> BẢN ĐỒ VỊ TRÍ DU LỊCH
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hiển thị vị trí thực tế của cơ sở nghỉ dưỡng trên Google Maps.</span>
          </div>

          {/* Google Maps Container */}
          <div style={{ flex: 1, position: 'relative', background: '#09090b', borderRadius: '16px', border: '1px solid rgba(212,163,89,0.25)', overflow: 'hidden' }}>
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            />
          </div>
        </div>

        {/* Property Listings Column (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 900, margin: 0 }}>
              {selectedCategory === 'all' ? 'Tất cả các cơ sở' : `Cơ sở: ${selectedCategory.toUpperCase()}`} 
              <span style={{ color: 'var(--accent)', fontSize: '15px', fontWeight: 500, marginLeft: '10px' }}>
                ({filteredHotels.length} kết quả)
              </span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {filteredHotels.map(hotel => (
              <div
                key={hotel.idcoso}
                className="glass-panel"
                style={{
                  borderRadius: '24px',
                  border: '1px solid rgba(212,163,89,0.2)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr',
                  height: '240px',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseOver={e=>e.currentTarget.style.borderColor='var(--accent)'}
                onMouseOut={e=>e.currentTarget.style.borderColor='rgba(212, 163, 89, 0.2)'}
              >
                <div style={{ position: 'relative', height: '100%' }}>
                  <img src={hotel.hinhanh} alt={hotel.tencoso} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--accent-gradient)', color: '#070708', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '12px' }}>
                    {hotel.category}
                  </span>
                </div>

                {/* Details info */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, cursor: 'pointer' }} onClick={() => navigate(`/hotel/${hotel.idcoso}`)}>
                        {hotel.tencoso}
                      </h4>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(Number(hotel.sosao) || 0)].map((_, i) => (
                          <Star key={i} size={11} fill="var(--accent)" color="var(--accent)" />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', margin: '6px 0 14px 0' }}>
                      <MapPin size={12} color="var(--accent)" /> {hotel.diachi}
                    </p>

                    {/* Vacant Rooms Details */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                        🚪 CÁC HẠNG PHÒNG CÒN TRỐNG (VACANT ROOMS)
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(hotel.vacancies || []).map((room, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{room.name}</span>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>Còn trống {room.count} phòng</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Giá từ</span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>{(Number(hotel.giaphong) || 0).toLocaleString('vi-VN')}đ</span>
                    </div>

                    <button
                      onClick={() => navigate(`/hotel/${hotel.idcoso}`)}
                      style={{
                        background: 'var(--accent-gradient)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: '#070708',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      XEM CÁC PHÒNG &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredHotels.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', padding: '50px 0', fontSize: '14px' }}>
                Không tìm thấy chỗ nghỉ nào khớp với bộ lọc tìm kiếm hiện tại.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded inline styles for Pin glow and maps */}
      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 15px var(--accent); }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .pulse-pin {
          animation: pulseGlow 2s infinite ease-in-out;
        }
        .active-pin {
          background: var(--accent-gradient) !important;
          transform: scale(1.2) !important;
          box-shadow: 0 0 20px var(--accent) !important;
          border-color: #fff !important;
        }
      `}</style>

    </div>
  );
};

export default Hotels;
