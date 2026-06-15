import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Compass, MapPin, Star } from 'lucide-react';

const mockDatabase = [
  {
    idcoso: 'CS03',
    tencoso: 'Hanoi Old Quarter Hotel',
    diachi: '12 Hàng Bạc, Hoàn Kiếm, Hà Nội',
    sosao: 3,
    giaphong: 950000,
    features: ['phố cổ', 'hà nội', 'giá rẻ', 'trung tâm'],
    hinhanh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS04',
    tencoso: 'The Landmark Luxury Apartment',
    diachi: '208 Nguyễn Hữu Cảnh, Quận 1, TP HCM',
    sosao: 5,
    giaphong: 2800000,
    features: ['căn hộ', 'hồ bơi', 'view sông', 'sài gòn', 'hiện đại', 'sang trọng'],
    hinhanh: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS05',
    tencoso: 'Phú Quốc Sunset Resort',
    diachi: 'Bãi Trường, Dương Đông, Phú Quốc',
    sosao: 4,
    giaphong: 1500000,
    features: ['resort', 'hồ bơi', 'yên tĩnh', 'view biển', 'phú quốc', 'bãi biển'],
    hinhanh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS06',
    tencoso: 'Đà Lạt Mộng Mơ Homestay',
    diachi: 'Đường Hoa Cẩm Tú Cầu, Hồ Tuyền Lâm',
    sosao: 2,
    giaphong: 1200000,
    features: ['yên tĩnh', 'đà lạt', 'view hồ', 'homestay', 'chữa lành'],
    hinhanh: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS07',
    tencoso: 'Nha Trang Sea View Villa',
    diachi: 'Khu biệt thự An Viên, Trần Phú, Nha Trang',
    sosao: 5,
    giaphong: 7500000,
    features: ['villa', 'hồ bơi', 'view biển', 'nha trang', 'sang trọng', 'yên tĩnh', 'biệt thự'],
    hinhanh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    idcoso: 'CS08',
    tencoso: 'An Bang Boutique Hotel',
    diachi: 'Bãi biển An Bàng, Hội An, Quảng Nam',
    sosao: 4,
    giaphong: 1800000,
    features: ['boutique', 'hồ bơi', 'yên tĩnh', 'view biển', 'hội an', 'bãi biển', 'cổ điển'],
    hinhanh: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80'
  }
];

const AIChatConcierge = ({ onNavigateToHotel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào quý khách! Tôi là trợ lý ảo Concierge của Booking3TL. Hãy cho tôi biết nhu cầu nghỉ dưỡng của quý khách (ví dụ: "Tìm resort có hồ bơi ở Phú Quốc dưới 2 triệu/đêm").'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on semantic triggers
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateAIResponse(userText);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        results: botResponse.results
      }]);
    }, 1500);
  };

  const generateAIResponse = (text) => {
    const textLower = text.toLowerCase();
    let matches = [];

    // Simple matching rules
    const hasPool = textLower.includes('bể bơi') || textLower.includes('hồ bơi') || textLower.includes('pool');
    const hasSeaView = textLower.includes('biển') || textLower.includes('sea');
    const hasQuiet = textLower.includes('yên tĩnh') || textLower.includes('yên bình') || textLower.includes('chữa lành') || textLower.includes('quiet');
    
    // Parse budget constraints (e.g., "dưới 2 triệu", "dưới 5 triệu")
    let maxBudget = Infinity;
    const matchMillion = textLower.match(/dưới\s+(\d+)\s*triệu/);
    if (matchMillion) {
      maxBudget = parseInt(matchMillion[1], 10) * 1000000;
    } else if (textLower.includes('giá rẻ')) {
      maxBudget = 1500000;
    }

    // Filter database
    matches = mockDatabase.filter(hotel => {
      let score = 0;
      if (hasPool && hotel.features.includes('hồ bơi')) score += 2;
      if (hasSeaView && hotel.features.includes('view biển')) score += 2;
      if (hasQuiet && hotel.features.includes('yên tĩnh')) score += 1;
      
      // Location matching
      if (textLower.includes('phú quốc') && hotel.features.includes('phú quốc')) score += 5;
      if (textLower.includes('nha trang') && hotel.features.includes('nha trang')) score += 5;
      if (textLower.includes('đà lạt') && hotel.features.includes('đà lạt')) score += 5;
      if (textLower.includes('hà nội') && hotel.features.includes('hà nội')) score += 5;
      if (textLower.includes('sài gòn') && hotel.features.includes('sài gòn')) score += 5;
      if (textLower.includes('hội an') && hotel.features.includes('hội an')) score += 5;

      // Budget filter
      if (hotel.giaphong > maxBudget) return false;

      return score > 0 || textLower.includes(hotel.tencoso.toLowerCase());
    });

    // Sort by star rating and price matches
    matches.sort((a, b) => b.sosao - a.sosao);

    // If no matching hotels, return default top rated
    if (matches.length === 0) {
      matches = mockDatabase.filter(h => h.sosao >= 4).slice(0, 2);
      return {
        text: 'Tôi chưa tìm thấy phòng nghỉ khớp hoàn toàn với mô tả của bạn. Tuy nhiên, đây là những khu resort & villa cao cấp được đánh giá 5 sao hàng đầu từ khách hàng thượng lưu của chúng tôi:',
        results: matches
      };
    }

    return {
      text: `Dựa trên yêu cầu của quý khách, tôi đã lọc từ hệ thống và tìm ra ${matches.length} lựa chọn phòng nghỉ sang trọng, đầy đủ tiện nghi phù hợp nhất:`,
      results: matches.slice(0, 3)
    };
  };

  const handleSuggestionClick = (query) => {
    setInputValue(query);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          border: 'none',
          boxShadow: '0 8px 30px rgba(212, 163, 89, 0.4), 0 0 0 4px rgba(212, 163, 89, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#070708',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseOver={e=> { e.currentTarget.style.transform='scale(1.08) translateY(-3px)'; }}
        onMouseOut={e=> { e.currentTarget.style.transform='scale(1) translateY(0)'; }}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Chatbox Window Container */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '105px',
            right: '30px',
            width: '400px',
            height: '600px',
            borderRadius: '24px',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(212, 163, 89, 0.35)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            backgroundColor: 'rgba(14, 14, 17, 0.95)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(212, 163, 89, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to right, rgba(212, 163, 89, 0.08), transparent)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  background: 'var(--accent-gradient)', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#070708'
                }}
              >
                <Sparkles size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Booking3TL Concierge
                </h4>
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> AI Assistant Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Timeline */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Text Bubble */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    background: msg.sender === 'user' ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                    color: msg.sender === 'user' ? '#070708' : 'var(--text-primary)',
                    fontSize: '13.5px',
                    lineHeight: '1.45',
                    textAlign: 'left',
                    boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(212, 163, 89, 0.2)' : 'none',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {msg.text}
                </div>

                {/* Optional Hotel Cards Embedded Result */}
                {msg.results && msg.results.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      width: '100%',
                      marginTop: '12px',
                    }}
                  >
                    {msg.results.map((hotel) => (
                      <div
                        key={hotel.idcoso}
                        onClick={() => {
                          setIsOpen(false);
                          if (onNavigateToHotel) onNavigateToHotel(hotel.idcoso);
                        }}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '10px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(212, 163, 89, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={e=>e.currentTarget.style.borderColor='var(--accent)'}
                        onMouseOut={e=>e.currentTarget.style.borderColor='rgba(212, 163, 89, 0.2)'}
                      >
                        <img 
                          src={hotel.hinhanh} 
                          alt={hotel.tencoso} 
                          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                          <div>
                            <h5 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {hotel.tencoso}
                            </h5>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                              <MapPin size={10} color="var(--accent)" /> {hotel.diachi.split(',')[1] || hotel.diachi}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>
                              {hotel.giaphong.toLocaleString('vi-VN')}đ<span style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-secondary)' }}>/đêm</span>
                            </span>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[...Array(hotel.sosao)].map((_, i) => (
                                <Star key={i} size={8} fill="var(--accent)" color="var(--accent)" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '5px', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt suggestion buttons (Helper triggers) */}
          {messages.length === 1 && (
            <div
              style={{
                padding: '0 20px 12px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <button
                onClick={() => handleSuggestionClick('Tìm villa có hồ bơi, yên tĩnh ở Nha Trang dưới 5 triệu/đêm')}
                style={{
                  fontSize: '11px',
                  background: 'rgba(212, 163, 89, 0.08)',
                  border: '1px solid rgba(212, 163, 89, 0.25)',
                  color: 'var(--accent)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseOver={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.15)'}
                onMouseOut={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.08)'}
              >
                🌊 Villa hồ bơi Nha Trang &lt; 5M
              </button>
              <button
                onClick={() => handleSuggestionClick('Tìm homestay yên tĩnh để chữa lành ở Đà Lạt')}
                style={{
                  fontSize: '11px',
                  background: 'rgba(212, 163, 89, 0.08)',
                  border: '1px solid rgba(212, 163, 89, 0.25)',
                  color: 'var(--accent)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseOver={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.15)'}
                onMouseOut={e=>e.currentTarget.style.backgroundColor='rgba(212, 163, 89, 0.08)'}
              >
                🌲 Homestay Đà Lạt chữa lành
              </button>
            </div>
          )}

          {/* Form Input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(212, 163, 89, 0.15)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn tìm phòng nghỉ..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(212, 163, 89, 0.15)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#070708',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>

          {/* Inline Typing keyframe definition helper */}
          <style>{`
            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1.0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default AIChatConcierge;
