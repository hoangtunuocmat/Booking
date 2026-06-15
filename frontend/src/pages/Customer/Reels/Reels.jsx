import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReelsPlayer from '../../../components/Common/ReelsPlayer';
import { Play, Sparkles, Compass, Heart, ArrowLeft } from 'lucide-react';

const mockReels = [
  {
    id: 'CS07',
    title: 'Review bể bơi vô cực triệu đô Amanoi Nha Trang',
    author: 'Linh Travel',
    views: '45.2K',
    likes: '12.4K',
    bgImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'CS05',
    title: 'Kinh nghiệm ngắm hoàng hôn đỏ Phú Quốc cực chill',
    author: 'Hoàng Huy',
    views: '128.5K',
    likes: '8.9K',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'CS04',
    title: 'Khám phá penthouse sang chảnh bậc nhất Sài Gòn',
    author: 'Mạnh Cường',
    views: '89.7K',
    likes: '15.2K',
    bgImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'CS08',
    title: 'Phong cách cổ điển yên bình tại Hội An Boutique',
    author: 'Hà Vy',
    views: '210.4K',
    likes: '21.0K',
    bgImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
  }
];

const Reels = () => {
  const navigate = useNavigate();
  const [isPlayerOpen, setIsPlayerOpen] = useState(true); // Default to open the immersive reels immediately
  const [activeReelId, setActiveReelId] = useState('CS07');

  const handleOpenPlayer = (reelId) => {
    setActiveReelId(reelId);
    setIsPlayerOpen(true);
  };

  const handleBookFromReel = (hotelId) => {
    setIsPlayerOpen(false);
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div style={{ padding: '40px 5% 80px 5%', width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
            <Sparkles size={16} color="var(--accent)" />
            <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              LUXURY VIDEO REVIEWS
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Khám phá qua Reels
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '6px' }}>
            Trải nghiệm chân thực từ cộng đồng khách hàng thượng lưu. Nhấp vào bất kỳ video để bắt đầu lướt.
          </p>
        </div>

        <button
          onClick={() => setIsPlayerOpen(true)}
          style={{
            background: 'var(--accent-gradient)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: '#070708',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(212, 163, 89, 0.3)'
          }}
        >
          <Play size={16} fill="currentColor" /> BẮT ĐẦU XEM PHÁT NGAY
        </button>
      </div>

      {/* Pinterest-like Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}
      >
        {mockReels.map((reel) => (
          <div 
            className="glass-panel"
            key={reel.id}
            onClick={() => handleOpenPlayer(reel.id)}
            style={{
              borderRadius: '20px',
              height: '400px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(212, 163, 89, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e=> {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseOut={e=> {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.2)';
            }}
          >
            <img 
              src={reel.bgImage} 
              alt={reel.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
            />
            
            {/* Play button overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--accent-gradient)',
                border: 'none',
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#030712',
                boxShadow: '0 0 15px rgba(212, 163, 89, 0.45)'
              }}
            >
              <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
            </div>

            {/* Views badge */}
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(7,7,8,0.8)', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, color: 'var(--accent)', border: '1px solid rgba(212, 163, 89, 0.25)' }}>
              🎥 {reel.views}
            </div>

            {/* Content overlay bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(transparent, rgba(7, 7, 8, 0.95))', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: '1.4' }}>
                {reel.title}
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={reel.avatar} alt={reel.author} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--accent)' }} />
                  <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>@{reel.author}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  <Heart size={14} fill="#ef4444" color="#ef4444" /> {reel.likes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Autoplaying Fullscreen Video Feed Overlay */}
      <ReelsPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        selectedReelId={activeReelId}
        onBookHotel={handleBookFromReel}
      />

    </div>
  );
};

export default Reels;
