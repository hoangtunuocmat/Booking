import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Building2, CalendarCheck, ClipboardList, Crown, Gift, LogOut, MapPin, ShieldCheck, Star, User, Wallet } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { bookingApi } from '../../../api/bookingApi';
import { ownerApi } from '../../../api/ownerApi';
import { adminApi } from '../../../api/adminApi';

const roleMap = {
  Customer: {
    title: 'Hồ sơ khách hàng',
    badge: 'Customer',
    color: 'var(--accent)',
    icon: <User size={26} />,
    description: 'Theo dõi thông tin cá nhân, lịch sử đặt phòng và trạng thái thanh toán.',
  },
  Owner: {
    title: 'Hồ sơ chủ khách sạn',
    badge: 'Owner',
    color: '#d4a359',
    icon: <Crown size={26} />,
    description: 'Quản lý danh tính chủ sở hữu, cơ sở lưu trú, doanh thu và đơn đặt phòng.',
  },
  Admin: {
    title: 'Hồ sơ quản trị viên',
    badge: 'Admin',
    color: '#c084fc',
    icon: <ShieldCheck size={26} />,
    description: 'Giám sát hệ thống, duyệt khách sạn, quản lý tài khoản và khuyến mãi.',
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, role, logout } = useAuth();
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentRole = role || profile?.vaitro || 'Customer';
  const roleConfig = roleMap[currentRole] || roleMap.Customer;
  const displayName = profile?.hoten || user?.user_metadata?.name || user?.username || 'Người dùng Booking3TL';
  const email = profile?.email || user?.email || 'Chưa cập nhật';
  const phone = profile?.sdt || user?.user_metadata?.phone || 'Chưa cập nhật';
  const username = profile?.username || user?.username || user?.id || 'guest';

  useEffect(() => {
    let mounted = true;
    const loadRoleData = async () => {
      try {
        setLoading(true);
        if (currentRole === 'Owner') {
          const ownerId = profile?.idchusohuu || profile?.username || user?.id || user?.username;
          const res = await ownerApi.getDashboard(ownerId);
          if (mounted) setRoleData(res.data?.data || null);
        } else if (currentRole === 'Admin') {
          const res = await adminApi.getDashboard();
          if (mounted) setRoleData(res.data?.data || null);
        } else {
          const res = await bookingApi.getBookings();
          const bookings = res.data?.data || [];
          const customerBookings = bookings.filter(item => item.idkhachhang === profile?.idkhachhang);
          if (mounted) setRoleData({ bookings: customerBookings });
        }
      } catch (err) {
        console.error('Profile data error:', err);
        if (mounted) setRoleData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user) loadRoleData();
    return () => { mounted = false; };
  }, [currentRole, profile, user]);

  const stats = useMemo(() => {
    if (currentRole === 'Owner') {
      return [
        { label: 'Cơ sở lưu trú', value: roleData?.totalHotels ?? 0, icon: <Building2 size={22} /> },
        { label: 'Đơn trong tháng', value: roleData?.monthlyOrders ?? 0, icon: <ClipboardList size={22} /> },
        { label: 'Doanh thu', value: `${Number(roleData?.revenue || 0).toLocaleString('vi-VN')}đ`, icon: <Wallet size={22} /> },
      ];
    }

    if (currentRole === 'Admin') {
      return [
        { label: 'Tổng khách sạn', value: roleData?.totalHotels ?? 0, icon: <Building2 size={22} /> },
        { label: 'Tài khoản', value: roleData?.totalUsers ?? 0, icon: <User size={22} /> },
        { label: 'Cần duyệt', value: roleData?.pendingHotels ?? 0, icon: <BadgeCheck size={22} /> },
      ];
    }

    return [
      { label: 'Lịch sử đặt phòng', value: roleData?.bookings?.length ?? 0, icon: <CalendarCheck size={22} /> },
      { label: 'Vai trò', value: 'Khách hàng', icon: <User size={22} /> },
      { label: 'Ưu đãi khả dụng', value: 'Theo mùa', icon: <Gift size={22} /> },
    ];
  }, [currentRole, roleData]);

  const quickActions = useMemo(() => {
    if (currentRole === 'Owner') {
      return [
        { label: 'Dashboard Owner', path: '/owner/dashboard' },
        { label: 'Quản lý khách sạn', path: '/owner/hotels' },
        { label: 'Quản lý đơn', path: '/owner/orders' },
      ];
    }

    if (currentRole === 'Admin') {
      return [
        { label: 'Duyệt khách sạn', path: '/admin/approve-hotels' },
        { label: 'Quản lý user', path: '/admin/users' },
        { label: 'Khuyến mãi', path: '/admin/promos' },
      ];
    }

    return [
      { label: 'Trang chủ', path: '/' },
      { label: 'Khám phá khách sạn', path: '/' },
      { label: 'Reels Review', path: '/reels' },
    ];
  }, [currentRole]);

  if (!user) {
    return (
      <div style={{ padding: '80px 5%', color: 'var(--text-primary)' }}>
        <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
          <h2>Vui lòng đăng nhập để xem hồ sơ.</h2>
          <button onClick={() => navigate('/auth')} style={primaryButton}>Đăng nhập</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 5% 80px', width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section className="glass-panel" style={{ borderRadius: '28px', padding: '32px', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '24px', alignItems: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '28px', background: 'var(--accent-gradient)', color: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 900 }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: roleConfig.color, fontWeight: 900, marginBottom: '10px' }}>
            {roleConfig.icon} {roleConfig.badge}
          </div>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '32px' }}>{roleConfig.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{roleConfig.description}</p>
        </div>
        <button onClick={() => { logout(); navigate('/auth'); }} style={dangerButton}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ borderRadius: '22px', padding: '26px' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '18px' }}>Thông tin tài khoản</h3>
          <InfoRow label="Họ tên" value={displayName} />
          <InfoRow label="Username" value={username} />
          <InfoRow label="Email" value={email} />
          <InfoRow label="Số điện thoại" value={phone} />
          <InfoRow label="Phân quyền" value={currentRole} />
          <InfoRow label="Trạng thái" value="Đang hoạt động" />
        </div>

        <div className="glass-panel" style={{ borderRadius: '22px', padding: '26px' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '18px' }}>Lối tắt theo phân quyền</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quickActions.map(action => (
              <button key={action.path} onClick={() => navigate(action.path)} style={secondaryButton}>{action.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {stats.map(stat => (
          <div key={stat.label} className="glass-panel" style={{ borderRadius: '18px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{stat.label}</div>
              <div style={{ color: 'var(--accent)', fontSize: '26px', fontWeight: 900 }}>{loading ? '...' : stat.value}</div>
            </div>
            <div style={{ color: 'var(--accent)' }}>{stat.icon}</div>
          </div>
        ))}
      </section>

      <RolePanel role={currentRole} data={roleData} loading={loading} />
    </div>
  );
};

const RolePanel = ({ role, data, loading }) => {
  if (loading) {
    return <div className="glass-panel" style={panelStyle}>Đang tải dữ liệu hồ sơ từ Supabase...</div>;
  }

  if (role === 'Owner') {
    return (
      <div className="glass-panel" style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ color: 'var(--accent)', marginBottom: '4px' }}>Cơ sở đang quản lý</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>Những khách sạn/cơ sở lưu trú được gắn với tài khoản chủ sở hữu này.</p>
          </div>
          <strong style={{ color: 'var(--text-primary)' }}>{data?.hotels?.length || 0} cơ sở</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {(data?.hotels || []).map(hotel => (
            <div key={hotel.idcoso} style={{ border: '1px solid rgba(212,163,89,0.18)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.025)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{hotel.tencoso}</strong>
                <span style={{ color: 'var(--accent)', fontWeight: 900 }}>{hotel.idcoso}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                <MapPin size={14} color="var(--accent)" /> {hotel.diachi}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)', display: 'inline-flex', gap: '5px', alignItems: 'center', fontWeight: 800 }}><Star size={14} fill="var(--accent)" /> {hotel.sosao} sao</span>
                <span style={{ color: hotel.trangthai === 'Đang hoạt động' ? '#10b981' : 'var(--accent)', fontWeight: 800 }}>{hotel.trangthai}</span>
              </div>
            </div>
          ))}
          {!data?.hotels?.length && <div style={{ color: 'var(--text-secondary)' }}>Chưa có cơ sở lưu trú nào thuộc tài khoản này.</div>}
        </div>

        <h3 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Đơn gần đây theo các cơ sở trên</h3>
        {(data?.recentOrders || []).map(order => <InfoRow key={order.iddatphong} label={order.iddatphong} value={`${order.hotel?.tencoso || 'Cơ sở lưu trú'} - ${order.customer?.hoten || order.idkhachhang} - ${order.trangthai}`} />)}
        {!data?.recentOrders?.length && <div style={{ color: 'var(--text-secondary)' }}>Chưa có đơn đặt phòng gần đây cho các cơ sở này.</div>}
      </div>
    );
  }

  if (role === 'Admin') {
    return (
      <div className="glass-panel" style={panelStyle}>
        <h3 style={{ color: '#c084fc', marginBottom: '16px' }}>Quyền quản trị hệ thống</h3>
        <InfoRow label="Duyệt cơ sở" value="Cho phép duyệt hoặc từ chối khách sạn trạng thái Chờ duyệt" />
        <InfoRow label="Quản lý tài khoản" value="Cho phép khóa/mở khóa tài khoản vi phạm" />
        <InfoRow label="Khuyến mãi" value="Cho phép tạo chiến dịch KhuyenMai và MaGiamGia" />
      </div>
    );
  }

  return (
    <div className="glass-panel" style={panelStyle}>
      <h3 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Lịch sử đặt phòng</h3>
      {(data?.bookings || []).map(booking => <InfoRow key={booking.iddatphong} label={booking.iddatphong} value={`${booking.ngaynhanphong} → ${booking.ngaytraphong} - ${booking.trangthai}`} />)}
      {!data?.bookings?.length && <div style={{ color: 'var(--text-secondary)' }}>Chưa có lịch sử đặt phòng.</div>}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '14px', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <strong style={{ color: 'var(--text-primary)' }}>{value || 'Chưa cập nhật'}</strong>
  </div>
);

const panelStyle = { borderRadius: '22px', padding: '26px', color: 'var(--text-secondary)' };
const primaryButton = { marginTop: '18px', background: 'var(--accent-gradient)', color: '#070708', border: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: 900, cursor: 'pointer' };
const secondaryButton = { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px 14px', cursor: 'pointer', fontWeight: 800, textAlign: 'left' };
const dangerButton = { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444', borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' };

export default Profile;
