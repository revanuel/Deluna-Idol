const SUPABASE_URL = "MASUKKAN_SUPABASE_URL_KAMU";
const SUPABASE_KEY = "MASUKKAN_PUBLISHABLE_KEY_KAMU";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
