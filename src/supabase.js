import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
let client = null
export const getSupabase = () => (client ||= url && key ? createClient(url, key) : null)