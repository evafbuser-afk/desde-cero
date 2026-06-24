import type { ProfileData, RoadmapDay, ResumeData } from './supabase'
import type { SupportedLang } from './voice'
import { getLanguage } from './languages'

function langInstruction(lang: SupportedLang): string {
  const name = getLanguage(lang).name
  if (name === 'English') return 'Conduct this entire conversation in English.'
  return `Conduct this entire conversation in ${name}. Always respond in ${name}, using simple, clear, everyday words. If the user writes in another language, still respond in ${name}.`
}

// NOTE: In production, API calls must go through a backend proxy to protect the key.
const MODEL = 'claude-sonnet-4-6'

export type Message = { role: 'user' | 'assistant'; content: string }

async function callClaude(params: {
  system?: string
  messages: Message[]
  max_tokens?: number
}): Promise<string> {
  // In production, calls go through /api/claude (key stays on server).
  // In dev, call Anthropic directly if a local key is set.
  const isDev = import.meta.env.DEV
  const localKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

  const url = isDev && localKey ? 'https://api.anthropic.com/v1/messages' : '/api/claude'
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (isDev && localKey) {
    headers['x-api-key'] = localKey
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
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
  const system = ONBOARDING_SYSTEM_PROMPT + '\n\n' + langInstruction(lang)
  return callClaude({ system, messages })
}

export async function generateRoadmap(
  profile: ProfileData,
  lang: SupportedLang = 'en',
): Promise<RoadmapDay[]> {
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

Valid types: lesson, practice, quiz, project (keep these type values in English). Write the "topic", "description", and "skill_category" values in ${getLanguage(lang).name}. Make it realistic and progressive.`,
      },
    ],
  })

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse roadmap JSON')
  return JSON.parse(jsonMatch[0])
}

export async function generateResume(
  profile: ProfileData,
  lang: SupportedLang = 'en',
): Promise<ResumeData> {
  const text = await callClaude({
    messages: [
      {
        role: 'user',
        content: `Create a professional resume for someone targeting: ${profile.target_role}

Current skills: ${profile.current_skills.join(', ')}
Education: ${profile.education_level}
Work situation: ${profile.work_situation}
Goals: ${profile.goals}

Write all text values in ${getLanguage(lang).name}. Return ONLY JSON (no markdown):
{"summary":"2-3 sentence professional summary","skills":["skill1","skill2"],"experience":["transferable experience bullet"],"education":"education description","target_role":"the target role"}`,
      },
    ],
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse resume JSON')
  return JSON.parse(jsonMatch[0])
}

// Translate the UI string dictionary into any language (used for languages without a built-in dict).
export async function translateUiStrings(
  langName: string,
  englishDict: object,
): Promise<Record<string, unknown>> {
  const text = await callClaude({
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Translate all the string VALUES in this JSON object into ${langName}. Rules:
- Keep every key exactly the same.
- Keep the JSON structure identical (same arrays/objects).
- Keep any placeholder like {email} unchanged.
- Keep emoji unchanged.
- Use simple, clear, everyday words a beginner would understand.
Return ONLY the JSON, no markdown, no explanation.

${JSON.stringify(englishDict)}`,
      },
    ],
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse translation JSON')
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

${langInstruction(lang)}`

  return callClaude({ system, messages, max_tokens: 512 })
}
