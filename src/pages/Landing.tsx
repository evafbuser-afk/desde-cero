import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { LangSwitcher } from '../components/LangSwitcher'
import { Sparkles, Clock, FileText, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Personalized to you',
    desc: 'AI interviews you to understand your goals, skills, and schedule.',
  },
  {
    icon: Clock,
    title: 'Just 20 minutes a day',
    desc: 'Built for people with full lives. Learn before work, on a break, or after dinner.',
  },
  {
    icon: TrendingUp,
    title: 'Close your skill gaps',
    desc: 'We identify exactly what you need to learn for your target role.',
  },
  {
    icon: FileText,
    title: 'Resume that grows with you',
    desc: 'Your resume updates automatically as you build new skills.',
  },
]

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <LangSwitcher />
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-lime-50 text-lime-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} />
          Your career journey starts here
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          From zero to your
          <span className="text-teal-600"> dream career</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Desde Cero uses AI to build a personalized career path just for you —
          no matter where you're starting from.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-sm"
        >
          Start for free — no account needed
        </button>
        <p className="text-sm text-gray-400 mt-3">Just your phone number to get started</p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-teal-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-lime-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to start from zero?
        </h2>
        <p className="text-teal-100 mb-8 text-lg">
          Thousands of people just like you are already on their path.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
        >
          Get started now
        </button>
      </section>
    </div>
  )
}
