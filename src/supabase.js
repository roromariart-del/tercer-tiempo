import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cevwnhqpbmwftsncmazz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnduaHFwYm13ZnRzbmNtYXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Njk3MjksImV4cCI6MjA5NjU0NTcyOX0.elw6d1CS8hnrCUGeW3lBriPpigWnWIFx-n9LSepl6O8'

export const supabase = createClient(supabaseUrl, supabaseKey)