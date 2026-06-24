import { supabase } from './supabase'

export async function sendEmailCode(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })
  return { error: error?.message ?? null }
}

export async function verifyEmailCode(
  email: string,
  token: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  return { error: error?.message ?? null }
}

export async function signOut() {
  await supabase.auth.signOut()
}
