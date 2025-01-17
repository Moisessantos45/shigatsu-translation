import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const api_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, api_key);

export default supabase;
