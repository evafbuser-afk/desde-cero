import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { LangSwitcher } from '../components/LangSwitcher'
import { Storyboard } from '../components/Storyboard'
import { useLang } from '../lib/lang'
import { Sparkles, Clock, FileText, TrendingUp } from 'lucide-react'

const icons = [Sparkles, Clock, TrendingUp, FileText]

export function Landing() {
  const navigate = useNavigate()
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <LangSwitcher />
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            {t.nav_signin}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-lime-50 text-lime-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} />
          {t.hero_badge}
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          {t.hero_title_1}
          <span className="text-teal-600">{t.hero_title_2}</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          {t.hero_subtitle}
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-sm"
        >
          {t.hero_cta}
        </button>
        <p className="text-sm text-gray-400 mt-3">{t.hero_note}</p>
      </section>

      {/* Storyboard — how it works */}
      <div className="border-y border-gray-100">
        <Storyboard />
      </div>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.features.map((f, i) => {
            const Icon = icons[i]
            return (
              <div
                key={f.title}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-white hover:border-teal-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-lime-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{t.cta_title}</h2>
        <p className="text-teal-100 mb-8 text-lg">{t.cta_subtitle}</p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
        >
          {t.cta_button}
        </button>
      </section>
    </div>
  )
}
