import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  phone: string
  name: string | null
  onboarding_complete: boolean
  profile_data: ProfileData | null
  roadmap: RoadmapDay[] | null
  resume: ResumeData | null
  created_at: string
}

export type ProfileData = {
  goals: string
  current_skills: string[]
  education_level: string
  work_situation: string
  target_role: string
  availability_minutes: number
  languages: string[]
  challenges: string
}

export type RoadmapDay = {
  day: number
  topic: string
  description: string
  duration_minutes: number
  type: 'lesson' | 'practice' | 'quiz' | 'project'
  skill_category: string
  completed: boolean
}

export type ResumeData = {
  summary: string
  skills: string[]
  experience: string[]
  education: string
  target_role: string
}
