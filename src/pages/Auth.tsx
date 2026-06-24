import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { sendEmailCode, verifyEmailCode } from '../lib/auth'
import { ArrowLeft, Mail, Shield } from 'lucide-react'

export function Auth() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await sendEmailCode(email.trim())
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setStep('otp')
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await verifyEmailCode(email.trim(), otp)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-gray-500 mt-2">Your journey starts with a single step</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Enter your email</h2>
                  <p className="text-sm text-gray-500">We'll send you a verification code</p>
                </div>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                {loading ? 'Sending...' : 'Send code'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                We'll never share your email or send spam.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Enter the code</h2>
                  <p className="text-sm text-gray-500">Sent to {email}</p>
                </div>
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center text-2xl tracking-widest placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                maxLength={6}
                required
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify & continue'}
              </button>

              <button
                type="button"
                onClick={() => handleSendCode(new Event('submit') as unknown as React.FormEvent)}
                className="w-full text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Resend code
              </button>
            </form>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
        >
          <ArrowLeft size={14} /> Back to home
        </button>
      </div>
    </div>
  )
}
