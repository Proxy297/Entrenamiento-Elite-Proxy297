
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuslosgxyzysfrqaghei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c2xvc2d4eXp5c2ZycWFnaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDU5NTMsImV4cCI6MjA4NTcyMTk1M30.GO2cGgCrygUzmuTgbjLNAnqPlSk7evPROedhvnFwsO4';

export const supabase = createClient(supabaseUrl, supabaseKey);
