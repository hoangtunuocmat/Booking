import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, VolumeX, Heart, MessageSquare, Share2, Compass, ArrowUp, ArrowDown } from 'lucide-react';

const mockVideos = [
  {
    id: 'CS07',
    hotelName: 'Nha Trang Sea View Villa',
    title: 'Một sớm thức dậy tại hồ bơi vô cực hướng trọn vịnh Nha Trang. Đẹp không tì vết!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-swimming-pool-41611-large.mp4',
    author: 'Linh Travel',
    likes: '12.4K',
    comments: '438',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'CS05',
    hotelName: 'Phú Quốc Sunset Resort',
    title: 'Chạng vạng hoàng hôn đỏ lửa tại bãi biển riêng của Phú Quốc Sunset. Trải nghiệm hoàng gia 5 sao.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-couple-walking-on-a-beach-at-sunset-1525-large.mp4',
    author: 'Hoàng Huy',
    likes: '8.9K',
    comments: '215',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'CS04',
    hotelName: 'The Landmark Luxury Apartment',
    title: 'Cận cảnh căn hộ áp mái Penthouse với tầm view triệu đô ôm trọn sông Sài Gòn rực rỡ về đêm.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-minimalist-design-42354-large.mp4',
    author: 'Mạnh Cường',
    likes: '15.2K',
    comments: '782',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'CS08',
    hotelName: 'An Bang Boutique Hotel',
    title: 'Phong cách Đông Dương hoài niệm, hồ bơi lợp ngói xanh rêu thanh bình ngay bên bãi biển An Bàng.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-swimming-pool-in-a-resort-41610-large.mp4',
    author: 'Hà Vy',
    likes: '21.0K',
    comments: '1.2K',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
  }
];

const ReelsPlayer = ({ isOpen, onClose, selectedReelId, onBookHotel }) => {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedList, setLikedList] = useState({});
  const videoRefs = useRef([]);

  useEffect(() => {
    if (selectedReelId) {
      const foundIdx = mockVideos.findIndex(v => v.id === selectedReelId);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      }
    }
  }, [selectedReelId]);

  useEffect(() => {
    // Play active video, pause others
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentIndex) {
          video.play().catch(err => console.log('Video autoplay blocked:', err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < mockVideos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleLike = (idx) => {
    setLikedList(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleVideoClick = (idx) => {
    const video = videoRefs.current[idx];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const currentReel = mockVideos[currentIndex];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#030303',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Background blur overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle, rgba(212,163,89,0.1) 0%, rgba(3,3,3,1) 80%)`,
          zIndex: 1,
        }}
      />

      {/* Close button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '25px',
          right: '25px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.3)'}
        onMouseOut={e=>e.currentTarget.style.backgroundColor='rgba(255, 255, 255, 0.08)'}
      >
        <X size={24} />
      </button>

      {/* Main Reels Viewport Container */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px', // Perfect smartphone portrait size
          height: '100%',
          maxHeight: '880px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(212, 163, 89, 0.25)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          }}
        >
          {mockVideos.map((reel, idx) => (
            <div
              key={reel.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: idx === currentIndex ? 1 : 0,
                pointerEvents: idx === currentIndex ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Loop Video */}
              <video
                ref={el => videoRefs.current[idx] = el}
                src={reel.videoUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
                loop
                playsInline
                muted={isMuted}
                onClick={() => handleVideoClick(idx)}
              />

              {/* Gradient Dark Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
                  pointerEvents: 'none',
                  zIndex: 3
                }}
              />

              {/* Reels Details overlay (bottom) */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '25px',
                  left: '20px',
                  right: '70px',
                  zIndex: 4,
                  textAlign: 'left'
                }}
              >
                {/* Author profile info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img 
                    src={reel.avatar} 
                    alt={reel.author} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700 }}>@{reel.author}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800 }}>Certified Explorer</span>
                  </div>
                </div>

                {/* Hotel Tag */}
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '4px 10px', 
                    background: 'rgba(212, 163, 89, 0.15)', 
                    border: '1px solid rgba(212, 163, 89, 0.35)',
                    borderRadius: '20px',
                    marginBottom: '10px'
                  }}
                >
                  <Compass size={12} color="var(--accent)" />
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800 }}>{reel.hotelName}</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13.5px', color: '#e5e7eb', lineHeight: '1.4', marginBottom: '18px' }}>
                  {reel.title}
                </p>

                {/* Call To Action button */}
                <button
                  onClick={() => onBookHotel(reel.id)}
                  style={{
                    background: 'var(--accent-gradient)',
                    color: '#070708',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px 20px',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 8px 20px rgba(212, 163, 89, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}
                >
                  ĐẶT CHỖ NGHỈ NGAY &rarr;
                </button>
              </div>

              {/* Floating Interactions (right side) */}
              <div 
                style={{
                  position: 'absolute',
                  right: '15px',
                  bottom: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'center',
                  zIndex: 4
                }}
              >
                {/* Like Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => toggleLike(idx)}
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      color: likedList[idx] ? '#ef4444' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Heart size={20} fill={likedList[idx] ? '#ef4444' : 'none'} />
                  </button>
                  <span style={{ fontSize: '11px', color: '#d1d5db', fontWeight: 600 }}>{reel.likes}</span>
                </div>

                {/* Comment Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageSquare size={20} />
                  </button>
                  <span style={{ fontSize: '11px', color: '#d1d5db', fontWeight: 600 }}>{reel.comments}</span>
                </div>

                {/* Share Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={20} />
                  </button>
                  <span style={{ fontSize: '11px', color: '#d1d5db', fontWeight: 600 }}>Share</span>
                </div>

                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>
          ))}

          {/* Swipe Indicator Arrows */}
          <div 
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              zIndex: 5
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(212, 163, 89, 0.3)',
                color: currentIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === 0 ? 'default' : 'pointer'
              }}
            >
              <ArrowUp size={16} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === mockVideos.length - 1}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(212, 163, 89, 0.3)',
                color: currentIndex === mockVideos.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === mockVideos.length - 1 ? 'default' : 'pointer'
              }}
            >
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsPlayer;
