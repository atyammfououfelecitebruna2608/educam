import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not defined in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log("--- Checking Students ---");
  const { data: students, error: sError } = await supabase.from('students').select('*').limit(5);
  if (sError) {
    console.error("sError:", sError);
  } else {
    console.log("Students columns:", students.length > 0 ? Object.keys(students[0]) : "Empty table");
  }

  console.log("\n--- Checking Payments ---");
  const { data: payments, error: pError } = await supabase.from('payments').select('*').limit(5);
  if (pError) {
    console.error("pError:", pError);
  } else {
    console.log("Payments columns:", payments.length > 0 ? Object.keys(payments[0]) : "Empty table");
  }
}

checkData();
