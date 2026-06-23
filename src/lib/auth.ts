import { supabase } from './supabase'

export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({ phone })
  return { error: error?.message ?? null }
}

export async function verifyOTP(
  phone: string,
  token: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
  return { error: error?.message ?? null }
}

export async function signOut() {
  await supabase.auth.signOut()
}
