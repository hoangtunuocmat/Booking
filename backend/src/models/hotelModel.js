import { supabase } from '../config/supabase.js';
export const hotelModel = {
  getAll: async () => {
    const { data, error } = await supabase.from('cosoluutru').select('*');
    if (error) throw error;
    return data;
  },
  getById: async (id) => {
    const { data, error } = await supabase.from('cosoluutru').select('*').eq('idcoso', id).single();
    if (error) throw error;
    return data;
  }
};