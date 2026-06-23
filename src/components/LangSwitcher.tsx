import { useLang } from '../lib/lang'
import { LANG_CONFIG, type SupportedLang } from '../lib/voice'

const langs: SupportedLang[] = ['en', 'es', 'tl']

export function LangSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
            lang === l
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {LANG_CONFIG[l].label}
        </button>
      ))}
    </div>
  )
}
