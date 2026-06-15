import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('cosoluutru').select('*').limit(2);
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Sample data:', JSON.stringify(data, null, 2));
  }
}

test();
