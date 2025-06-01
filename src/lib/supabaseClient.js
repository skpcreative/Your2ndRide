import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrymdiipjtwlargtsjdf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyeW1kaWlwanR3bGFyZ3RzamRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDE3NzUsImV4cCI6MjA2NDE3Nzc3NX0.8EAyi0Yj5B2KLK8CPY6IuoeuZyeHXSida12579eqcAo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);