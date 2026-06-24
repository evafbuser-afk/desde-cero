import { useLang } from '../lib/lang'
import { LANGUAGES } from '../lib/languages'
import { Globe, Loader2 } from 'lucide-react'

export function LangSwitcher() {
  const { lang, setLang, translating } = useLang()

  return (
    <div className="relative inline-flex items-center gap-1.5 bg-gray-100 rounded-lg pl-2.5 pr-1 py-1">
      {translating ? (
        <Loader2 size={14} className="text-teal-600 animate-spin shrink-0" />
      ) : (
        <Globe size={14} className="text-gray-400 shrink-0" />
      )}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="appearance-none bg-transparent text-xs font-semibold text-gray-700 pr-4 focus:outline-none cursor-pointer"
        aria-label="Choose language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </div>
  )
}
