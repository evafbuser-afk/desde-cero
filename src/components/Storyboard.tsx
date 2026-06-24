import { MessageCircle, Map, GraduationCap, Briefcase, ArrowRight } from 'lucide-react'

const steps = [
  {
    n: 1,
    icon: MessageCircle,
    title: 'You talk, we listen',
    give: 'Tell us about yourself — by voice or typing, in your language',
    get: 'A coach that truly understands your life and dreams',
    accent: 'lime',
  },
  {
    n: 2,
    icon: Map,
    title: 'We build your path',
    give: '20 minutes a day — that\'s all',
    get: 'A personalized 30-day roadmap to your goal',
    accent: 'teal',
  },
  {
    n: 3,
    icon: GraduationCap,
    title: 'You learn & grow',
    give: 'Show up each day and complete small lessons',
    get: 'New skills, filled gaps, and growing confidence',
    accent: 'lime',
  },
  {
    n: 4,
    icon: Briefcase,
    title: 'You land the job',
    give: 'Keep going — we cheer you on',
    get: 'A ready resume and a real shot at your dream career',
    accent: 'teal',
  },
]

const accentMap: Record<string, { bg: string; text: string; ring: string }> = {
  lime: { bg: 'bg-lime-100', text: 'text-lime-600', ring: 'ring-lime-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', ring: 'ring-teal-200' },
}

export function Storyboard() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-lime-600 uppercase tracking-wide">
          How it works
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Your journey, step by step
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Here's what you put in — and what you get back at every stage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2">
        {steps.map((step, i) => {
          const a = accentMap[step.accent]
          return (
            <div key={step.n} className="relative flex flex-col">
              {/* Connector arrow (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-12 z-10 text-gray-300">
                  <ArrowRight size={20} />
                </div>
              )}

              <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col">
                {/* Step number + icon */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${a.bg} flex items-center justify-center ring-4 ${a.ring}`}
                  >
                    <step.icon size={22} className={a.text} />
                  </div>
                  <span className="text-3xl font-extrabold text-gray-100">{step.n}</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-3">{step.title}</h3>

                {/* You give */}
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    You give
                  </div>
                  <p className="text-sm text-gray-600 leading-snug">{step.give}</p>
                </div>

                {/* You get */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className={`text-[11px] font-semibold ${a.text} uppercase tracking-wide mb-0.5`}>
                    You get
                  </div>
                  <p className="text-sm text-gray-800 font-medium leading-snug">{step.get}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
