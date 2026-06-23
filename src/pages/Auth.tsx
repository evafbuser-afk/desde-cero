import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { sendOTP, verifyOTP } from '../lib/auth'
import { ArrowLeft, Phone, Shield } from 'lucide-react'

export function Auth() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formatted = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`
    const { error } = await sendOTP(formatted)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setStep('otp')
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formatted = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`
    const { error } = await verifyOTP(formatted, otp)
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
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Enter your phone number</h2>
                  <p className="text-sm text-gray-500">We'll send you a verification code</p>
                </div>
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
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
                We'll never share your number or send spam.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('phone')}
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
                  <p className="text-sm text-gray-500">Sent to {phone}</p>
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
