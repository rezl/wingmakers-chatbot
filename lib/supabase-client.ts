import { createClient } from '@supabase/supabase-js';


const privateKey = process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY? process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY : "";
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL: "";
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export const supabase  = createClient(url, privateKey);