import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { sendMagicLink } from '../lib/auth'
import { useLang } from '../lib/lang'
import { T } from '../lib/i18n'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'

export function Auth() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const t = T[lang]
  const [step, setStep] = useState<'email' | 'sent'>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await sendMagicLink(email.trim())
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setStep('sent')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-gray-500 mt-2">{t.auth_tagline}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 'email' ? (
            <form onSubmit={handleSendLink} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{t.auth_email_title}</h2>
                  <p className="text-sm text-gray-500">{t.auth_email_sub}</p>
                </div>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth_email_placeholder}
                autoComplete="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? t.auth_sending : t.auth_send}
              </button>

              <p className="text-xs text-gray-400 text-center">{t.auth_privacy}</p>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto">
                <MailCheck size={28} className="text-teal-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">{t.auth_sent_title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t.auth_sent_body.split('{email}')[0]}
                  <span className="font-medium text-gray-700">{email}</span>
                  {t.auth_sent_body.split('{email}')[1]}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-left">
                <p className="text-xs text-gray-500">{t.auth_sent_spam}</p>
              </div>

              <button
                onClick={() => setStep('email')}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                {t.auth_different}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
        >
          <ArrowLeft size={14} /> {t.auth_back}
        </button>
      </div>
    </div>
  )
}
