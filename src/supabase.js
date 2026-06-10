import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cevwnhqpbmwftsncmazz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnduaHFwYm13ZnRzbmNtYXp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk2OTcyOSwiZXhwIjoyMDk2NTQ1NzI5fQ.65upATRHdnLHbTVYBkV81p_1R1mx_zc2XoQgQ6No5WU'

export const supabase = createClient(supabaseUrl, supabaseKey)