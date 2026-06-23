import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import type { ProfileData, RoadmapDay, ResumeData } from '../lib/supabase'
import type { Message } from '../lib/claude'
import { CheckCircle2, Circle, Flame, Target, FileText, MessageCircle, ChevronRight, Send, Loader2 } from 'lucide-react'

type Tab = 'today' | 'roadmap' | 'resume' | 'coach'

export function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('today')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapDay[]>([])
  const [resume, setResume] = useState<ResumeData | null>(null)

  useEffect(() => {
    const p = localStorage.getItem('dc_profile')
    const r = localStorage.getItem('dc_roadmap')
    const res = localStorage.getItem('dc_resume')
    if (p) setProfile(JSON.parse(p))
    if (r) setRoadmap(JSON.parse(r))
    if (res) setResume(JSON.parse(res))
    if (!p) navigate('/onboarding')
  }, [navigate])

  function toggleDay(day: number) {
    setRoadmap((prev) => {
      const updated = prev.map((d) =>
        d.day === day ? { ...d, completed: !d.completed } : d
      )
      localStorage.setItem('dc_roadmap', JSON.stringify(updated))
      return updated
    })
  }

  const completedCount = roadmap.filter((d) => d.completed).length
  const streak = (() => {
    let s = 0
    for (let i = completedCount - 1; i >= 0; i--) {
      if (roadmap[i]?.completed) s++
      else break
    }
    return s
  })()

  const todayTask = roadmap.find((d) => !d.completed) ?? roadmap[0]

  const typeColors: Record<string, string> = {
    lesson: 'bg-blue-100 text-blue-700',
    practice: 'bg-purple-100 text-purple-700',
    quiz: 'bg-amber-100 text-amber-700',
    project: 'bg-teal-100 text-teal-700',
  }

  const tabs = [
    { id: 'today' as Tab, label: "Today", icon: Target },
    { id: 'roadmap' as Tab, label: 'Roadmap', icon: ChevronRight },
    { id: 'resume' as Tab, label: 'Resume', icon: FileText },
    { id: 'coach' as Tab, label: 'Coach', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm font-medium text-orange-500">
              <Flame size={16} />
              {streak} day streak
            </div>
            <div className="text-sm text-gray-400">
              {completedCount}/{roadmap.length} done
            </div>
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {tab === 'today' && todayTask && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {profile?.target_role ? `Your path to ${profile.target_role}` : "Your path forward"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {completedCount} of {roadmap.length} days complete
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${(completedCount / roadmap.length) * 100}%` }}
              />
            </div>

            {/* Today's task */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-teal-50 px-6 py-4 border-b border-teal-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                    Day {todayTask.day} · Up next
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[todayTask.type]}`}>
                    {todayTask.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{todayTask.topic}</h3>
                <p className="text-gray-500 mb-6">{todayTask.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">⏱ {todayTask.duration_minutes} min</span>
                  <button
                    onClick={() => toggleDay(todayTask.day)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Mark complete
                  </button>
                </div>
              </div>
            </div>

            {/* Next 3 upcoming */}
            {roadmap.filter((d) => !d.completed && d.day !== todayTask.day).slice(0, 3).map((day) => (
              <div key={day.day} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  {day.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{day.topic}</p>
                  <p className="text-xs text-gray-400">{day.skill_category} · {day.duration_minutes} min</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${typeColors[day.type]}`}>
                  {day.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'roadmap' && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your 30-day roadmap</h2>
            {roadmap.map((day) => (
              <div
                key={day.day}
                className={`bg-white rounded-xl border px-5 py-4 flex items-center gap-4 transition-all ${
                  day.completed ? 'border-teal-100 opacity-60' : 'border-gray-100'
                }`}
              >
                <button onClick={() => toggleDay(day.day)} className="shrink-0">
                  {day.completed ? (
                    <CheckCircle2 size={22} className="text-teal-500" />
                  ) : (
                    <Circle size={22} className="text-gray-300" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-gray-400 font-medium">Day {day.day}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${typeColors[day.type]}`}>
                      {day.type}
                    </span>
                  </div>
                  <p className={`font-medium text-sm ${day.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {day.topic}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{day.skill_category} · {day.duration_minutes} min</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'resume' && resume && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your resume</h2>
              <span className="text-xs text-lime-700 font-medium bg-lime-50 px-3 py-1 rounded-full border border-lime-200">
                Auto-updated as you learn
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div>
                <div className="text-xl font-bold text-gray-900">{resume.target_role}</div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-lime-50 text-lime-700 font-medium px-2.5 py-1 rounded-full border border-lime-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Experience & Strengths</h3>
                <ul className="space-y-1.5">
                  {resume.experience.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-lime-500 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Education</h3>
                <p className="text-sm text-gray-700">{resume.education}</p>
              </div>
            </div>

            <p className="text-xs text-center text-gray-400">
              Complete more days to add skills to your resume automatically.
            </p>
          </div>
        )}

        {tab === 'coach' && (
          <CoachTab profile={profile} />
        )}
      </div>
    </div>
  )
}

function CoachTab({ profile }: { profile: ProfileData | null }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: profile
        ? `Hi! I'm your career coach. You're working toward becoming a ${profile.target_role}. What questions do you have? I'm here to help with job prep, skill advice, motivation — anything.`
        : "Hi! I'm your career coach. What can I help you with today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const { askCareerCoach } = await import('../lib/claude')
    const userMsg = { role: 'user' as const, content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await askCareerCoach(newMessages, profile ?? {} as ProfileData)
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't respond. Try again?" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-3 mt-1 shrink-0">
                🌱
              </div>
            )}
            <div
              className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-3 shrink-0">🌱</div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <Loader2 size={16} className="text-teal-500 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3 pt-4 border-t border-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your career coach..."
          disabled={loading}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-11 h-11 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

