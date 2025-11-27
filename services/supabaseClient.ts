import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://huggomnsrgrhvjwblipd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Z2dvbW5zcmdyaHZqd2JsaXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjE4NDAsImV4cCI6MjA3OTc5Nzg0MH0.2TnmbNHVEK6HD_TZzn7rWafJBUFTFAWaKOJI3q-XqtQ';

export const supabase = createClient(supabaseUrl, supabaseKey);