import type { ProfileData, RoadmapDay, ResumeData } from './supabase'
import type { SupportedLang } from './voice'

const LANG_INSTRUCTION: Record<SupportedLang, string> = {
  en: 'Conduct this entire conversation in English.',
  es: 'Conduce toda esta conversación en español. Responde siempre en español.',
  tl: 'Isagawa ang buong pag-uusap na ito sa Tagalog. Sumagot palagi sa Tagalog.',
}

// NOTE: In production, API calls must go through a backend proxy to protect the key.
const MODEL = 'claude-sonnet-4-6'

export type Message = { role: 'user' | 'assistant'; content: string }

async function callClaude(params: {
  system?: string
  messages: Message[]
  max_tokens?: number
}): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: params.max_tokens ?? 1024,
      ...(params.system ? { system: params.system } : {}),
      messages: params.messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.content[0].text as string
}

export const ONBOARDING_SYSTEM_PROMPT = `You are a warm, encouraging career coach for Desde Cero — an app that helps people from underserved communities unlock their career potential. Your job is to interview the user to build a personalized profile.

Conduct a friendly, conversational interview to learn:
1. Their name and a bit about themselves
2. Their current work situation (employed/unemployed, what kind of work)
3. Their education level (no judgment — be encouraging)
4. Skills they already have (even informal ones — cooking, driving, childcare, customer service, etc.)
5. Their career dreams and goals
6. Their biggest challenges (time, money, language, confidence, etc.)
7. How much time per day they can dedicate (~20 min default)
8. What role or field they want to break into

Keep it conversational — ask one or two questions at a time. Be warm, non-judgmental, and encouraging. Use simple, clear language. After gathering enough information (5-8 exchanges), end with:
"Thank you so much! I have everything I need to build your personalized plan. Type 'ready' when you want to see your roadmap."

When you receive 'ready', respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "profile": {
    "name": "...",
    "goals": "...",
    "current_skills": ["skill1", "skill2"],
    "education_level": "...",
    "work_situation": "...",
    "target_role": "...",
    "availability_minutes": 20,
    "languages": ["English"],
    "challenges": "..."
  }
}`

export async function sendOnboardingMessage(messages: Message[], lang: SupportedLang = 'en'): Promise<string> {
  const system = ONBOARDING_SYSTEM_PROMPT + '\n\n' + LANG_INSTRUCTION[lang]
  return callClaude({ system, messages })
}

export async function generateRoadmap(profile: ProfileData): Promise<RoadmapDay[]> {
  const text = await callClaude({
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Based on this user profile, create a 30-day personalized career learning roadmap.

Profile:
- Target role: ${profile.target_role}
- Current skills: ${profile.current_skills.join(', ')}
- Education: ${profile.education_level}
- Work situation: ${profile.work_situation}
- Daily availability: ${profile.availability_minutes} minutes
- Challenges: ${profile.challenges}
- Goals: ${profile.goals}

Return ONLY a JSON array (no markdown) of 30 objects with this shape:
{"day":1,"topic":"short topic","description":"1-2 sentence description","duration_minutes":20,"type":"lesson","skill_category":"category","completed":false}

Valid types: lesson, practice, quiz, project. Make it realistic and progressive.`,
      },
    ],
  })

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse roadmap JSON')
  return JSON.parse(jsonMatch[0])
}

export async function generateResume(profile: ProfileData): Promise<ResumeData> {
  const text = await callClaude({
    messages: [
      {
        role: 'user',
        content: `Create a professional resume for someone targeting: ${profile.target_role}

Current skills: ${profile.current_skills.join(', ')}
Education: ${profile.education_level}
Work situation: ${profile.work_situation}
Goals: ${profile.goals}

Return ONLY JSON (no markdown):
{"summary":"2-3 sentence professional summary","skills":["skill1","skill2"],"experience":["transferable experience bullet"],"education":"education description","target_role":"the target role"}`,
      },
    ],
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse resume JSON')
  return JSON.parse(jsonMatch[0])
}

export async function askCareerCoach(
  messages: Message[],
  profile: ProfileData,
  lang: SupportedLang = 'en',
): Promise<string> {
  const system = `You are an encouraging career coach for Desde Cero. You're helping ${
    profile.target_role ? `someone pursuing a career as a ${profile.target_role}` : 'someone building their career'
  }.

Their skills: ${profile.current_skills?.join(', ') || 'still discovering them'}
Their goals: ${profile.goals || 'building a better future'}

Be warm, specific, and actionable. Keep responses concise (3-5 sentences max). Speak simply and clearly.

${LANG_INSTRUCTION[lang]}`

  return callClaude({ system, messages, max_tokens: 512 })
}
