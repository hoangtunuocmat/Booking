import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Search, MapPin, Calendar, Users, Sunrise, Trees, Navigation } from 'lucide-react';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const ParallaxJourney = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const containerRef = useRef(null);
  const skyRef = useRef(null);
  const sunRef = useRef(null);
  const mountainRef = useRef(null);
  const forestRef = useRef(null);
  const bikeRef = useRef(null);
  const foregroundRef = useRef(null);
  
  // Center booking interface panel (Initial state)
  const heroContentRef = useRef(null);
  
  // Luxury resort/villa booking quotes (Second phase)
  const bookingQuoteRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    
    // GSAP ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=220%', // Smooth scroll length
        pin: true,     // Pin the screen
        scrub: 1.5,    // Super smooth scrub
        anticipatePin: 1,
      }
    });

    // Parallax movements with smooth easing
    tl.to(skyRef.current, {
      yPercent: 8,
      xPercent: -3,
      ease: 'power2.inOut',
    }, 0);

    // Sun rises up as you scroll
    tl.to(sunRef.current, {
      y: -120,
      scale: 1.15,
      ease: 'power2.out',
    }, 0);

    // Mountains translate slowly
    tl.to(mountainRef.current, {
      xPercent: -15,
      yPercent: 2,
      ease: 'power2.inOut',
    }, 0);

    // Misty forest translations
    tl.to(forestRef.current, {
      xPercent: -35,
      ease: 'power2.inOut',
    }, 0);

    // Foreground grass and rocks zoom by
    tl.to(foregroundRef.current, {
      xPercent: -70,
      ease: 'power2.inOut',
    }, 0);

    // Dirt bike travels forward, tilts slightly up/down, simulating mountain trail riding
    tl.to(bikeRef.current, {
      x: 130,
      y: -25,
      rotation: 4,
      scale: 1.04,
      ease: 'power2.inOut',
    }, 0);

    // --- HEADING & SEARCH ENGINE SCROLL TRIGGERS ---
    // Scroll Phase 1: Fade out and slide up the Search Panel
    tl.to(heroContentRef.current, {
      opacity: 0,
      y: -150,
      scale: 0.92,
      ease: 'power2.inOut',
    }, 0.2); // Fades out early in the scroll

    // Scroll Phase 2: Fade in and out the booking/resort/villa promotional quote
    tl.fromTo(bookingQuoteRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'power2.out' },
      0.65
    );
    tl.to(bookingQuoteRef.current, {
      opacity: 0,
      y: -60,
      ease: 'power2.in',
    }, 1.3);

    // Natural bobbing idle animation for the motorcycle
    gsap.to(bikeRef.current, {
      y: '+=8',
      rotation: '-=2',
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/hotels', { state: { searchQuery } });
  };

  return (
    <div 
      ref={containerRef}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#04100b', // Deep forest theme background base
      }}
    >
      {/* 1. Dawn/Dusk Sky Layer */}
      <div 
        ref={skyRef}
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          top: '-10%',
          left: 0,
          background: 'linear-gradient(to bottom, #d97706 0%, #15803d 45%, #04100b 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 2. Rising Sun */}
      <div 
        ref={sunRef}
        style={{
          position: 'absolute',
          left: '65%',
          bottom: '32%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fef08a 20%, #f59e0b 60%, transparent 100%)',
          boxShadow: '0 0 80px rgba(245, 158, 11, 0.5)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Distant Mountains silhouettes */}
      <div 
        ref={mountainRef}
        style={{
          position: 'absolute',
          width: '140%',
          height: '60%',
          bottom: '12%',
          left: 0,
          zIndex: 3,
          opacity: 0.65,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 400' fill='%2314532d'%3E%3Cpath d='M0,400 L0,220 L150,130 L350,260 L500,100 L750,290 L950,80 L1150,220 L1300,140 L1400,280 L1400,400 Z' opacity='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      {/* 4. Misty Pine Forest Layer */}
      <div 
        ref={forestRef}
        style={{
          position: 'absolute',
          width: '180%',
          height: '65%',
          bottom: '5%',
          left: 0,
          zIndex: 4,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1800 450' fill='%23052e16'%3E%3Cpath d='M 10 450 L 10 250 L 25 300 L 20 300 L 40 350 L 30 350 L 50 450 Z'/%3E%3Cpath d='M 70 450 L 70 180 L 90 230 L 82 230 L 110 300 L 100 300 L 130 450 Z' opacity='0.9'/%3E%3Cpath d='M 180 450 L 180 200 L 200 250 L 195 250 L 220 330 L 210 330 L 240 450 Z' opacity='0.9'/%3E%3Cpath d='M 320 450 L 320 150 L 350 200 L 340 200 L 370 290 L 360 290 L 400 450 Z'/%3E%3Cpath d='M 480 450 L 480 220 L 500 270 L 492 270 L 520 350 L 510 350 L 540 450 Z' opacity='0.9'/%3E%3Cpath d='M 650 450 L 650 120 L 685 180 L 675 180 L 710 280 L 700 280 L 750 450 Z'/%3E%3Cpath d='M 820 450 L 820 230 L 840 270 L 832 270 L 860 340 L 850 340 L 880 450 Z' opacity='0.8'/%3E%3Cpath d='M 960 450 L 960 170 L 990 220 L 980 220 L 1010 300 L 1000 300 L 1040 450 Z'/%3E%3Cpath d='M 1150 450 L 1150 140 L 1180 190 L 1170 190 L 1200 270 L 1190 270 L 1240 450 Z'/%3E%3Cpath d='M 1350 450 L 1350 210 L 1375 260 L 1365 260 L 1395 330 L 1385 330 L 1420 450 Z' opacity='0.9'/%3E%3Cpath d='M 1520 450 L 1520 110 L 1555 170 L 1545 170 L 1580 260 L 1570 260 L 1620 450 Z'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      >
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(21, 128, 61, 0.2), transparent)' }} />
      </div>

      {/* 5. Adventurer riding a Scrambler Motorcycle */}
      <div 
        ref={bikeRef}
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '18%',
          width: '260px',
          height: '160px',
          zIndex: 6,
          filter: 'drop-shadow(0 10px 15px rgba(2, 6, 23, 0.45))',
          pointerEvents: 'none'
        }}
      >
        <svg viewBox="0 0 300 180" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="28" cy="115" rx="8" ry="5" fill="#e2e8f0" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0;0.3" dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="cx" values="28;15;28" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="85" cy="120" r="30" fill="none" stroke="#27272a" strokeWidth="6" />
          <circle cx="85" cy="120" r="27" fill="none" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="2, 6" />
          <circle cx="85" cy="120" r="6" fill="#71717a" />
          <circle cx="215" cy="120" r="30" fill="none" stroke="#27272a" strokeWidth="6" />
          <circle cx="215" cy="120" r="27" fill="none" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="2, 6" />
          <circle cx="215" cy="120" r="6" fill="#71717a" />
          <path d="M50 110 A 35 35 0 0 1 100 95" fill="none" stroke="#a1a1aa" strokeWidth="4" />
          <path d="M190 95 A 35 35 0 0 1 245 110" fill="none" stroke="#a1a1aa" strokeWidth="4" />
          <line x1="85" y1="120" x2="110" y2="80" stroke="#71717a" strokeWidth="5" />
          <line x1="215" y1="120" x2="200" y2="60" stroke="#d4d4d8" strokeWidth="4" />
          <rect x="110" y="90" width="60" height="35" rx="5" fill="#3f3f46" />
          <circle cx="125" cy="108" r="10" fill="#18181b" />
          <path d="M125 110 L50 115" stroke="#71717a" strokeWidth="6" fill="none" />
          <path d="M50 115 L35 115" stroke="#a1a1aa" strokeWidth="4" fill="none" />
          <path d="M120 70 Q150 55 185 70 L180 85 L125 85 Z" fill="#b45309" />
          <path d="M105 80 Q135 75 160 80 L160 88 L105 88 Z" fill="#78350f" />
          <line x1="200" y1="60" x2="185" y2="45" stroke="#27272a" strokeWidth="3" />
          <line x1="185" y1="45" x2="165" y2="45" stroke="#18181b" strokeWidth="4" />
          <path d="M130 85 L140 110 L125 125" stroke="#1e3a8a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M135 85 L155 55 L180 65 Z" fill="#064e3b" />
          <path d="M150 60 L175 50 L180 46" stroke="#064e3b" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="165" cy="40" r="12" fill="#d97706" />
          <path d="M165 34 A 8 8 0 0 1 175 44" fill="#18181b" />
        </svg>
      </div>

      {/* 6. Foreground Natural Terrain */}
      <div 
        ref={foregroundRef}
        style={{
          position: 'absolute',
          width: '210%',
          height: '35%',
          bottom: '-2%',
          left: 0,
          zIndex: 7,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2100 250' fill='%23022c22'%3E%3Cpath d='M0,250 Q200,120 450,220 T900,250 Q1100,100 1450,250 T2000,200 L2100,200 L2100,250 Z'/%3E%3Cpath d='M150,210 L160,170 L170,215' stroke='%23047857' strokeWidth='3'/%3E%3Cpath d='M550,220 L555,160 L570,230' stroke='%23047857' strokeWidth='4'/%3E%3Cpath d='M1150,230 L1152,150 L1165,235' stroke='%23047857' strokeWidth='3'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      {/* 7. Scenic Parallax Text & Search Form Container (Fades out when scrolling) */}
      <div 
        ref={heroContentRef}
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '850px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Header Title block */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', marginBottom: '12px' }}>
            <Sunrise size={13} color="var(--accent)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-tech)', color: 'var(--accent-light)', fontWeight: 800, letterSpacing: '2px' }}>ĐẶT PHÒNG NHANH CHÓNG</span>
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'var(--font-tech)', color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.8)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            Tìm chỗ nghỉ tiếp theo
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '15px', fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.8)', marginTop: '8px', marginBottom: 0 }}>
            Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
          </p>
        </div>

        {/* Search Booking Engine Form */}
        <form 
          onSubmit={handleSearchSubmit}
          className="glass-panel"
          style={{
            width: '100%',
            padding: '24px 30px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(2, 6, 23, 0.65)',
            background: 'rgba(8, 23, 17, 0.85)', // Deep forest green glass
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
            
            {/* Destination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-tech)' }}>
                <MapPin size={12} /> ĐIỂM ĐẾN NGHỈ DƯỠNG
              </label>
              <input 
                type="text" 
                placeholder="Đà Lạt, Nha Trang, Phú Quốc..."
                value={searchQuery.location}
                onChange={e => setSearchQuery({ ...searchQuery, location: e.target.value })}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Check in */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-tech)' }}>
                <Calendar size={12} /> NHẬN PHÒNG
              </label>
              <input 
                type="date"
                value={searchQuery.checkIn}
                onChange={e => setSearchQuery({ ...searchQuery, checkIn: e.target.value })}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Check out */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-tech)' }}>
                <Calendar size={12} /> TRẢ PHÒNG
              </label>
              <input 
                type="date"
                value={searchQuery.checkOut}
                onChange={e => setSearchQuery({ ...searchQuery, checkOut: e.target.value })}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Guests */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-tech)' }}>
                <Users size={12} /> SỐ KHÁCH
              </label>
              <select
                value={searchQuery.guests}
                onChange={e => setSearchQuery({ ...searchQuery, guests: e.target.value })}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="1">1 khách</option>
                <option value="2">2 khách</option>
                <option value="3">Gia đình (3-4 người)</option>
                <option value="4">Đoàn đông (5+ người)</option>
              </select>
            </div>

          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--accent-gradient)',
              color: '#04100b',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-tech)',
              letterSpacing: '1px'
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.5)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.25)'}
          >
            <Search size={18} />
            TÌM KIẾM CHỖ NGHỈ
          </button>
        </form>
      </div>

      {/* Phase 2 Overlay Quote (Resort & Villa focus, no spiritual text) */}
      <div 
        ref={bookingQuoteRef}
        style={{
          position: 'absolute',
          top: '35%',
          left: '10%',
          right: '10%',
          zIndex: 8,
          textAlign: 'center',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          opacity: 0,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px' }}>
          <Compass size={13} color="var(--accent-cyan)" />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-tech)', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '2px' }}>HÌNH ẢNH KHÔNG GIAN THỰC TẾ</span>
        </div>
        <h2 style={{ fontSize: '38px', fontWeight: 900, fontFamily: 'var(--font-tech)', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.8)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Khám phá chi tiết phòng nghỉ
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', maxWidth: '600px', textShadow: '0 1px 5px rgba(0,0,0,0.8)', margin: 0 }}>
          Xem trước hình ảnh đầy đủ, góc chụp chân thực của các khu nghỉ dưỡng, resort cao cấp, khách sạn và villa sang trọng trước khi tiến hành đặt phòng nghỉ tiếp theo của bạn.
        </p>
      </div>
    </div>
  );
};

export default ParallaxJourney;
