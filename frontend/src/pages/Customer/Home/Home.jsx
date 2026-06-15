import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../../../api/hotelApi';
import HotelCard from '../../../components/Hotel/HotelCard';
import ParallaxJourney from '../../../components/Common/ParallaxJourney';
import VirtualTour360 from '../../../components/Hotel/VirtualTour360';
import ReelsPlayer from '../../../components/Common/ReelsPlayer';
import AIChatConcierge from '../../../components/Common/AIChatConcierge';
import { Search, MapPin, Calendar, Users, Flame, Compass, Star, Play, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  // Mood variables for Dynamic Mood Pricing
  const moods = [
    { id: 'all', name: 'Tất cả phong cách', icon: '✨', description: 'Trải nghiệm kỳ nghỉ theo ý thích cá nhân', hotels: [] },
    { id: 'couple', name: 'Nghỉ dưỡng cặp đôi', icon: '🕯️', description: 'TẶNG KÈM COMBO: Nến thơm tinh dầu Pháp & 1 chai vang đỏ thượng hạng phục vụ tại phòng', hotels: ['CS05', 'CS07', 'CS08'] },
    { id: 'group', name: 'Tiệc tùng nhóm', icon: '🥂', description: 'TẶNG KÈM COMBO: Gói tiệc nướng BBQ sân vườn riêng biệt & dàn âm thanh bluetooth Sony công suất lớn', hotels: ['CS04', 'CS07'] },
    { id: 'healing', name: 'Chữa lành một mình', icon: '🧘', description: 'TẶNG KÈM COMBO: 1 buổi tập Yoga đón bình minh & liệu trình Spa thảo mộc hữu cơ 60 phút', hotels: ['CS05', 'CS06', 'CS08'] }
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMood, setActiveMood] = useState('all');

  // Reels states
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState(null);

  // 3D Tour states
  const [is3DOpen, setIs3DOpen] = useState(false);
  const [selected3DHotel, setSelected3DHotel] = useState(null);

  const categories = [
    { id: 'all', name: 'Tất cả', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
    { id: 'hotel', name: 'Khách sạn', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
    { id: 'apartment', name: 'Căn hộ', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
    { id: 'resort', name: 'Các resort', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80' },
    { id: 'villa', name: 'Các biệt thự', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' }
  ];

  const mockHotels = [
    {
      idcoso: 'CS03',
      tencoso: 'Hanoi Old Quarter Hotel',
      diachi: '12 Hàng Bạc, Hoàn Kiếm, Hà Nội',
      sosao: 3,
      giaphong: 950000,
      hinhanh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
    },
    {
      idcoso: 'CS04',
      tencoso: 'The Landmark Luxury Apartment',
      diachi: '208 Nguyễn Hữu Cảnh, Quận 1, TP HCM',
      sosao: 5,
      giaphong: 2800000,
      hinhanh: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
    },
    {
      idcoso: 'CS05',
      tencoso: 'Phú Quốc Sunset Resort',
      diachi: 'Bãi Trường, Dương Đông, Phú Quốc',
      sosao: 4,
      giaphong: 1500000,
      hinhanh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
    },
    {
      idcoso: 'CS06',
      tencoso: 'Đà Lạt Mộng Mơ Homestay',
      diachi: 'Đường Hoa Cẩm Tú Cầu, Hồ Tuyền Lâm',
      sosao: 2,
      giaphong: 1200000,
      hinhanh: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    },
    {
      idcoso: 'CS07',
      tencoso: 'Nha Trang Sea View Villa',
      diachi: 'Khu biệt thự An Viên, Trần Phú, Nha Trang',
      sosao: 5,
      giaphong: 7500000,
      hinhanh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
    },
    {
      idcoso: 'CS08',
      tencoso: 'An Bang Boutique Hotel',
      diachi: 'Bãi biển An Bàng, Hội An, Quảng Nam',
      sosao: 4,
      giaphong: 1800000,
      hinhanh: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const mockReels = [
    {
      id: 'CS07',
      title: 'Review bể bơi vô cực triệu đô Amanoi Nha Trang',
      author: 'Linh Travel',
      views: '45.2K',
      bgImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=300&q=80',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'CS05',
      title: 'Kinh nghiệm ngắm hoàng hôn đỏ Phú Quốc cực chill',
      author: 'Hoàng Huy',
      views: '128.5K',
      bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'CS04',
      title: 'Khám phá penthouse sang chảnh bậc nhất Sài Gòn',
      author: 'Mạnh Cường',
      views: '89.7K',
      bgImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=300&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'CS08',
      title: 'Phong cách cổ điển yên bình tại Hội An Boutique',
      author: 'Hà Vy',
      views: '210.4K',
      bgImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=300&q=80',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    }
  ];

  useEffect(() => {
    setLoading(true);
    hotelApi.getHotels()
      .then(res => {
        const data = res.data?.data || res.data || [];
        if (data.length > 0) {
          setHotels(data);
        } else {
          setHotels(mockHotels);
        }
      })
      .catch(err => {
        console.warn('API error, using mock data for demo:', err);
        setHotels(mockHotels);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredHotels = hotels.filter(hotel => {
    // 1. Category Filter
    let categoryMatch = true;
    if (activeCategory !== 'all') {
      const name = hotel.tencoso.toLowerCase();
      if (activeCategory === 'hotel') categoryMatch = name.includes('hotel') || name.includes('boutique') || name.includes('khách sạn');
      else if (activeCategory === 'apartment') categoryMatch = name.includes('apartment') || name.includes('homestay') || name.includes('căn hộ');
      else if (activeCategory === 'resort') categoryMatch = name.includes('resort') || name.includes('khu nghỉ dưỡng');
      else if (activeCategory === 'villa') categoryMatch = name.includes('villa') || name.includes('biệt thự');
    }

    // 2. Mood Filter
    let moodMatch = true;
    if (activeMood !== 'all') {
      const selectedMoodObj = moods.find(m => m.id === activeMood);
      if (selectedMoodObj) {
        moodMatch = selectedMoodObj.hotels.includes(hotel.idcoso);
      }
    }

    return categoryMatch && moodMatch;
  });

  const handleOpen3D = (hotel) => {
    setSelected3DHotel(hotel);
    setIs3DOpen(true);
  };

  const handleOpenReel = (reelId) => {
    setSelectedReelId(reelId);
    setIsReelsOpen(true);
  };

  const handleBookFromReel = (hotelId) => {
    setIsReelsOpen(false);
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '85px', paddingBottom: '80px' }}>
      
      {/* 1. SCENIC PARALLAX JOURNEY (HERO) */}
      <ParallaxJourney />

      {/* 2. PROPERTY TYPES CAROUSEL */}
      <section style={{ padding: '0 5%', position: 'relative' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'left', marginBottom: '24px', fontFamily: 'var(--font-sans)' }}>
          Tìm theo loại chỗ nghỉ
        </h2>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div 
            id="property-types-scroll"
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              width: '100%',
              padding: '10px 0',
              scrollBehavior: 'smooth',
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate('/hotels', { state: { category: cat.id } })}
                style={{
                  flex: '0 0 auto',
                  cursor: 'pointer',
                  width: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Image Card Container */}
                <div 
                  style={{
                    height: '180px',
                    width: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: activeCategory === cat.id ? '3px solid var(--accent)' : '1px solid var(--border-color)',
                    boxShadow: activeCategory === cat.id ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'var(--shadow-sm)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseOver={(e) => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.2)';
                    }
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                  }}
                  onMouseOut={(e) => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                  }}
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                </div>
                {/* Property Type Label */}
                <span 
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: activeCategory === cat.id ? 'var(--accent)' : 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Scroll next button > */}
          <button 
            onClick={() => {
              const el = document.getElementById('property-types-scroll');
              if (el) el.scrollLeft += 290;
            }}
            style={{
              position: 'absolute',
              right: '-20px',
              zIndex: 5,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = '#04100b'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            &rsaquo;
          </button>
        </div>
      </section>

      {/* 3. FEATURED HOTELS SECTION (WITH DYNAMIC MOOD PRICING) */}
      <section style={{ padding: '0 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', textAlign: 'left', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Cơ sở nghỉ dưỡng nổi bật
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', textAlign: 'left' }}>
              Gợi ý các điểm đến có lượng đặt phòng cao và chất lượng phục vụ tiêu chuẩn 5 sao.
            </p>
          </div>
          <button 
            style={{
              background: 'rgba(212, 163, 89, 0.05)',
              border: '1px solid rgba(212, 163, 89, 0.3)',
              color: 'var(--accent)',
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(212, 163, 89, 0.1)',
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.5px'
            }}
            onMouseOver={e=> { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.15)'; e.currentTarget.style.boxShadow='0 0 15px rgba(212, 163, 89, 0.3)'; }}
            onMouseOut={e=> { e.currentTarget.style.borderColor='rgba(212, 163, 89, 0.3)'; e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.05)'; e.currentTarget.style.boxShadow='0 0 10px rgba(212, 163, 89, 0.1)'; }}
          >
            XEM TẤT CẢ PHÒNG
          </button>
        </div>

        {/* Dynamic Mood Selection Filter buttons */}
        <div style={{ marginBottom: '35px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> CHỌN COMBO THEO TÂM TRẠNG CỦA BẠN (MOOD PACKAGES)
          </span>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMood(m.id)}
                style={{
                  background: activeMood === m.id ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.03)',
                  border: activeMood === m.id ? '1px solid var(--accent)' : '1px solid rgba(212, 163, 89, 0.25)',
                  color: activeMood === m.id ? '#070708' : 'var(--text-primary)',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeMood === m.id ? '0 8px 25px rgba(212, 163, 89, 0.3)' : 'none'
                }}
                onMouseOver={e => {
                  if (activeMood !== m.id) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.backgroundColor = 'rgba(212, 163, 89, 0.08)';
                  }
                }}
                onMouseOut={e => {
                  if (activeMood !== m.id) {
                    e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.25)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
              >
                <span>{m.icon}</span>
                {m.name}
              </button>
            ))}
          </div>

          {/* Active Mood Benefit Notice banner */}
          <div 
            style={{ 
              padding: '16px 20px', 
              borderRadius: '14px', 
              background: 'rgba(212, 163, 89, 0.06)', 
              border: '1px solid rgba(212, 163, 89, 0.25)', 
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>🎁</span>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                Đặc quyền gói tâm trạng
              </span>
              <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>
                {moods.find(m => m.id === activeMood)?.description}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <div style={{ border: '3px solid rgba(212, 163, 89, 0.1)', borderTop: '3px solid var(--accent)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}
          >
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div key={hotel.idcoso} className="animate-slide-up">
                  <HotelCard hotel={hotel} onExplore3D={handleOpen3D} />
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '60px 0', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '15px' }}>
                Không tìm thấy phòng nghỉ nào phù hợp với bộ lọc danh mục và tâm trạng hiện tại.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. REELS REVIEW TEASER */}
      <section style={{ padding: '0 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: 'var(--accent-gradient)', borderRadius: '12px', display: 'flex', padding: '8px', boxShadow: '0 0 15px rgba(212, 163, 89, 0.3)' }}>
            <Play size={20} color="#030712" fill="currentColor" />
          </div>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', textAlign: 'left', margin: 0, letterSpacing: '-0.5px' }}>
              Khám phá thực tế qua Reels
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', textAlign: 'left', marginTop: '4px' }}>
              Trải nghiệm video review ngắn chân thực từ cộng đồng đam mê xê dịch. Nhấn vào bất kỳ để xem toàn màn hình.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {mockReels.map((reel) => (
            <div 
              className="glass-panel"
              key={reel.id}
              onClick={() => handleOpenReel(reel.id)}
              style={{
                borderRadius: '16px',
                height: '350px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(212, 163, 89, 0.25)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e=> {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.querySelector('.reel-play-btn').style.transform = 'translate(-50%, -50%) scale(1.1)';
              }}
              onMouseOut={e=> {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.25)';
                e.currentTarget.querySelector('.reel-play-btn').style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              {/* Background cover image */}
              <img 
                src={reel.bgImage} 
                alt={reel.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
              />

              {/* Play button overlay */}
              <div 
                className="reel-play-btn"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#030712',
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 0 15px rgba(212, 163, 89, 0.45)'
                }}
              >
                <Play size={22} fill="currentColor" style={{ marginLeft: '4px' }} />
              </div>

              {/* View count */}
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(3, 7, 18, 0.75)', backdropFilter: 'blur(8px)', borderRadius: '30px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, color: 'var(--accent)', border: '1px solid rgba(212, 163, 89, 0.25)', fontFamily: 'var(--font-tech)' }}>
                🎥 {reel.views} VIEWS
              </div>

              {/* Author & Info overlay bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(3, 7, 18, 0.95))', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px', textAlign: 'left' }}>
                  {reel.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <img src={reel.avatar} alt={reel.author} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent)' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>@{reel.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US / TRUST SECTION */}
      <section style={{ padding: '40px 5%' }}>
        <div 
          className="glass-panel"
          style={{
            borderRadius: '24px',
            padding: '50px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            border: '1px solid rgba(212, 163, 89, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle neon decor */}
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(212, 163, 89, 0.05)', filter: 'blur(50px)' }} />

          {/* Block 1 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ background: 'rgba(212, 163, 89, 0.1)', padding: '12px', borderRadius: '14px', display: 'flex', color: 'var(--accent)', boxShadow: '0 0 10px rgba(212, 163, 89, 0.2)' }}>
              <Award size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>LỰA CHỌN CHUẨN MỰC</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Hơn 10,000+ chỗ ở cao cấp được chọn lọc kỹ càng, đảm bảo chất lượng thiết kế và tiện nghi chuẩn gu thượng lưu.
              </p>
            </div>
          </div>

          {/* Block 2 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ background: 'rgba(212, 163, 89, 0.1)', padding: '12px', borderRadius: '14px', display: 'flex', color: 'var(--accent)', boxShadow: '0 0 10px rgba(212, 163, 89, 0.2)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>AN NINH TUYỆT ĐỐI</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Hỗ trợ trực tiếp từ tư vấn viên nhiệt tình và thanh toán mã hóa đa lớp an toàn thông qua cổng tích hợp.
              </p>
            </div>
          </div>

          {/* Block 3 */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ background: 'rgba(212, 163, 89, 0.1)', padding: '12px', borderRadius: '14px', display: 'flex', color: 'var(--accent)', boxShadow: '0 0 10px rgba(212, 163, 89, 0.2)' }}>
              <Compass size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>KHÔNG GIAN 3D</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Độc quyền xem phòng mô hình 3D thực tế trước khi thuê để bạn có cái nhìn chi tiết và khách quan nhất.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3D VR Tour Modal Integration */}
      <VirtualTour360
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
        hotelName={selected3DHotel?.tencoso}
        imageUrl={selected3DHotel?.hinhanh}
      />

      {/* Fullscreen Video Discovery Feed Overlay */}
      <ReelsPlayer
        isOpen={isReelsOpen}
        onClose={() => setIsReelsOpen(false)}
        selectedReelId={selectedReelId}
        onBookHotel={handleBookFromReel}
      />

      {/* AI Chatbot Assistant Concierge Overlay */}
      <AIChatConcierge
        onNavigateToHotel={(hotelId) => navigate(`/hotel/${hotelId}`)}
      />

      {/* Spin animation styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default Home;