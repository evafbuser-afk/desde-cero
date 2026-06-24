import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { LangSwitcher } from '../components/LangSwitcher'
import { useLang } from '../lib/lang'
import { sendOnboardingMessage, generateRoadmap, generateResume, type Message } from '../lib/claude'
import { speak, stopSpeaking, startListening, isSpeechSupported } from '../lib/voice'
import { supabase } from '../lib/supabase'
import type { ProfileData } from '../lib/supabase'
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'

export function Onboarding() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.onboarding_greeting },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [buildingPlan, setBuildingPlan] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const stopListeningRef = useRef<(() => void) | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const speechSupported = isSpeechSupported()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // When voice mode is turned on, speak the initial message
  useEffect(() => {
    if (voiceMode && messages.length === 1) {
      setSpeaking(true)
      speak(messages[0].content, lang, () => setSpeaking(false))
    }
    if (!voiceMode) {
      stopSpeaking()
      setSpeaking(false)
    }
  }, [voiceMode])

  // Update initial message when language changes (only before the conversation starts)
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 ? [{ role: 'assistant', content: t.onboarding_greeting }] : prev,
    )
  }, [lang, t.onboarding_greeting])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await sendOnboardingMessage(newMessages, lang)

      if (reply.trim().startsWith('{')) {
        const parsed = JSON.parse(reply)
        if (parsed.profile) {
          await buildPlan(parsed.profile)
          return
        }
      }

      const assistantMsg: Message = { role: 'assistant', content: reply }
      setMessages([...newMessages, assistantMsg])

      if (voiceMode) {
        setSpeaking(true)
        speak(reply, lang, () => {
          setSpeaking(false)
          // Auto-listen after AI finishes speaking
          startVoiceInput()
        })
      }
    } catch {
      const errMsg: Message = { role: 'assistant', content: 'Sorry, I had a hiccup. Can you try again?' }
      setMessages([...newMessages, errMsg])
    } finally {
      setLoading(false)
    }
  }, [messages, loading, voiceMode, lang])

  function startVoiceInput(_currentMessages?: Message[]) {
    if (buildingPlan) return
    setListening(true)
    setVoiceError(null)

    const stop = startListening(
      lang,
      (transcript) => {
        setListening(false)
        sendMessage(transcript)
      },
      (err) => {
        setListening(false)
        setVoiceError(`Mic error: ${err}. Try tapping the mic again.`)
      }
    )
    stopListeningRef.current = stop
  }

  function toggleMic() {
    if (listening) {
      stopListeningRef.current?.()
      setListening(false)
    } else {
      startVoiceInput()
    }
  }

  async function buildPlan(profile: ProfileData) {
    setBuildingPlan(true)
    setLoading(false)
    stopSpeaking()

    setMessages((prev) => [...prev, { role: 'assistant', content: t.building_plan }])

    try {
      const [roadmap, resume] = await Promise.all([
        generateRoadmap(profile, lang),
        generateResume(profile, lang),
      ])

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('user_profiles').upsert({
          id: user.id,
          email: user.email,
          onboarding_complete: true,
          profile_data: profile,
          roadmap,
          resume,
        })
      }

      localStorage.setItem('dc_profile', JSON.stringify(profile))
      localStorage.setItem('dc_roadmap', JSON.stringify(roadmap))
      localStorage.setItem('dc_resume', JSON.stringify(resume))

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setBuildingPlan(false)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I had trouble building your plan. Type 'ready' to try again." },
      ])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-sm text-gray-400">{t.interview_label}</span>
        </div>
        <LangSwitcher />
      </header>

      {/* Voice mode banner */}
      {voiceMode && (
        <div className={`flex items-center justify-center gap-3 py-2 text-sm font-medium transition-colors ${
          listening ? 'bg-red-50 text-red-600' : speaking ? 'bg-teal-50 text-teal-600' : 'bg-lime-50 text-lime-700'
        }`}>
          {listening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {t.voice_listening}
            </>
          ) : speaking ? (
            <>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              {t.voice_speaking}
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-lime-500" />
              {t.voice_hint}
            </>
          )}
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-3 mt-1 shrink-0">
                  🌱
                </div>
              )}
              <div
                className={`max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
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

          {buildingPlan && (
            <div className="text-center py-8">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                  <Loader2 size={24} className="text-teal-600 animate-spin" />
                </div>
                <p className="text-sm text-gray-500 font-medium">{t.building_plan}</p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Voice error */}
      {voiceError && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-1">
          <p className="text-xs text-red-500 text-center">{voiceError}</p>
        </div>
      )}

      {/* Input bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Voice toggle */}
          {speechSupported && (
            <div className="flex justify-center mb-3">
              <button
                onClick={() => setVoiceMode((v) => !v)}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full border transition-all ${
                  voiceMode
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                {voiceMode ? <Volume2 size={13} /> : <VolumeX size={13} />}
                {voiceMode ? t.voice_on : t.voice_turn_on}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.input_placeholder}
              disabled={loading || buildingPlan || listening}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:bg-gray-50"
            />

            {/* Mic button — shown in voice mode */}
            {voiceMode && speechSupported && (
              <button
                type="button"
                onClick={toggleMic}
                disabled={loading || buildingPlan || speaking}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
                  listening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || loading || buildingPlan}
              className="w-12 h-12 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
