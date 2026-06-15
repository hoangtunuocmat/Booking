import { supabase } from '../config/supabase.js';

const normalizeRole = (role) => {
  if (role === 'ChuSoHuu') return 'Owner';
  if (role === 'NhanVien' || role === 'Admin') return 'Admin';
  return 'Customer';
};

const getProfileTableByRole = (role) => {
  if (role === 'ChuSoHuu') return { table: 'chusohuu', idColumn: 'idchusohuu' };
  if (role === 'NhanVien' || role === 'Admin') return { table: 'nhanvien', idColumn: 'idnhanvien' };
  return { table: 'khachhang', idColumn: 'idkhachhang' };
};

const findUsernameByEmail = async (email) => {
  const profileTables = ['khachhang', 'chusohuu', 'nhanvien'];

  for (const table of profileTables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    if (data?.username) return data.username;
  }

  return null;
};

const getProfileByUsernameAndRole = async (username, role) => {
  const { table } = getProfileTableByRole(role);
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const getNextId = async (table, column, prefix, padLength = 2) => {
  const { data, error } = await supabase.from(table).select(column);
  if (error) throw error;

  const maxNumber = (data || []).reduce((max, row) => {
    const value = row[column];
    if (typeof value !== 'string' || !value.startsWith(prefix)) return max;
    const numericPart = Number.parseInt(value.slice(prefix.length), 10);
    return Number.isNaN(numericPart) ? max : Math.max(max, numericPart);
  }, 0);

  return `${prefix}${String(maxNumber + 1).padStart(padLength, '0')}`;
};

export const userModel = {
  authenticate: async ({ email, username, password }) => {
    const identifier = (username || email || '').trim();
    if (!identifier || !password) {
      throw new Error('Vui lòng nhập tài khoản/email và mật khẩu');
    }

    const resolvedUsername = identifier.includes('@')
      ? await findUsernameByEmail(identifier)
      : identifier;

    if (!resolvedUsername) throw new Error('Không tìm thấy tài khoản');

    const { data: account, error } = await supabase
      .from('taikhoan')
      .select('*')
      .eq('username', resolvedUsername)
      .maybeSingle();

    if (error) throw error;
    if (!account || account.matkhau !== password) throw new Error('Sai tài khoản hoặc mật khẩu');
    if (account.trangthai && account.trangthai !== 'Hoạt động') throw new Error('Tài khoản đã bị khóa');

    const profile = await getProfileByUsernameAndRole(account.username, account.vaitro);
    const mappedRole = normalizeRole(account.vaitro);

    return {
      account,
      profile: {
        ...(profile || {}),
        username: account.username,
        vaitro: mappedRole,
        rawRole: account.vaitro,
      },
      user: {
        id: profile?.idkhachhang || profile?.idchusohuu || profile?.idnhanvien || account.username,
        username: account.username,
        email: profile?.email || '',
        user_metadata: {
          name: profile?.hoten || account.username,
          phone: profile?.sdt || '',
          role: mappedRole,
        },
      },
    };
  },
  createProfile: async (userId, email, name, phone, role = 'Customer', password = '123') => {
    const username = userId || `user_${Date.now()}`;
    let mappedRole = 'KhachHang';
    let table = 'khachhang';
    let idColumn = 'idkhachhang';
    let prefix = 'KH';

    if (role === 'Owner') {
      mappedRole = 'ChuSoHuu';
      table = 'chusohuu';
      idColumn = 'idchusohuu';
      prefix = 'CH';
    } else if (role === 'Admin') {
      mappedRole = 'NhanVien';
      table = 'nhanvien';
      idColumn = 'idnhanvien';
      prefix = 'NV';
    }

    const { error: accountError } = await supabase
      .from('taikhoan')
      .insert([{ username, matkhau: password, vaitro: mappedRole, trangthai: 'Hoạt động' }]);

    if (accountError) throw accountError;

    const nextId = await getNextId(table, idColumn, prefix, 2);
    
    const profileInsert = {
      [idColumn]: nextId,
      username,
      hoten: name,
      sdt: phone,
      email
    };

    if (table === 'khachhang') {
      profileInsert.gioitinh = 'Khác';
      profileInsert.cccd = `9${String(Date.now()).slice(-8)}`;
    }

    const { data, error } = await supabase
      .from(table)
      .insert([profileInsert])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('khachhang')
      .select('*')
      .eq('username', userId)
      .maybeSingle();
    if (error) return null;
    return data;
  }
};
