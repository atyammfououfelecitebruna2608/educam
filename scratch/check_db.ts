
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log("--- Checking Students ---");
  const { data: students, error: sError } = await supabase.from('students').select('*').limit(5);
  if (sError) console.error(sError);
  else console.log(JSON.stringify(students, null, 2));

  console.log("\n--- Checking Pending Payments ---");
  const { data: payments, error: pError } = await supabase.from('payments').select('*, students(*)').eq('status', 'pending');
  if (pError) console.error(pError);
  else console.log(JSON.stringify(payments, null, 2));
}

checkData();
