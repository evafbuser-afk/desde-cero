import { supabase } from './supabase'

export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${window.location.origin}/onboarding`,
    },
  })
  return { error: error?.message ?? null }
}

export async function signOut() {
  await supabase.auth.signOut()
}
