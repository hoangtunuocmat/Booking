import { userModel } from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const { email, password, name, phone, role = 'Customer' } = req.body;

    const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || `kh_${Date.now()}`;
    const profile = await userModel.createProfile(username, email, name, phone, role, password);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: { id: profile.username, email, user_metadata: { name, phone, role }, profile } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const { user, profile } = await userModel.authenticate({ email, username, password });

    res.json({ 
      success: true, 
      message: 'Login successful', 
      session: { access_token: `db-session-${profile.username}` }, 
      user,
      profile
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
