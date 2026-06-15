import { createClient } from '@supabase/supabase-js';
// Đảm bảo đã cài dotenv để đọc file .env
import 'dotenv/config'; 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);