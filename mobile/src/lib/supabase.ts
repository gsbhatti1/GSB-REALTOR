import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

export const supabase = createClient(
  'https://hgsxndnxyczhudhsbddo.supabase.co',
  'sb_secret_0DzLQtLeZcxLIfOcHh69Dg_09t8lwLe'
)

export const WFRMLS_TOKEN = '45d62db98f00d4ba2d3b80507f9c5811'
export const WFRMLS_BASE  = 'https://resoapi.utahrealestate.com/reso/odata'
export const SITE_URL     = 'https://www.gsbrealtor.com'
