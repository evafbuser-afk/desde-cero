import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { SupportedLang } from './voice'
import { T, BASE_DICT, type Dict } from './i18n'
import { getLanguage } from './languages'
import { translateUiStrings } from './claude'

type LangContextType = {
  lang: SupportedLang
  setLang: (l: SupportedLang) => void
  t: Dict
  translating: boolean
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: BASE_DICT,
  translating: false,
})

function cacheKey(lang: string) {
  return `dc_dict_${lang}`
}

// Resolve the dictionary for a language: built-in, cached, or English (until translated).
function resolveDict(lang: string): Dict {
  if (T[lang]) return T[lang]
  const cached = localStorage.getItem(cacheKey(lang))
  if (cached) {
    try {
      return JSON.parse(cached) as Dict
    } catch {
      /* fall through */
    }
  }
  return BASE_DICT
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(
    () => localStorage.getItem('dc_lang') ?? 'en',
  )
  const [t, setT] = useState<Dict>(() => resolveDict(lang))
  const [translating, setTranslating] = useState(false)

  // Whenever the language changes, make sure we have a dictionary for it.
  useEffect(() => {
    let cancelled = false

    // Built-in or already cached → use immediately.
    if (T[lang] || localStorage.getItem(cacheKey(lang))) {
      setT(resolveDict(lang))
      return
    }

    // Otherwise translate on the fly (show English meanwhile).
    setT(BASE_DICT)
    setTranslating(true)
    translateUiStrings(getLanguage(lang).name, BASE_DICT)
      .then((translated) => {
        if (cancelled) return
        localStorage.setItem(cacheKey(lang), JSON.stringify(translated))
        setT(translated as Dict)
      })
      .catch(() => {
        /* keep English fallback */
      })
      .finally(() => {
        if (!cancelled) setTranslating(false)
      })

    return () => {
      cancelled = true
    }
  }, [lang])

  function setLang(l: SupportedLang) {
    setLangState(l)
    localStorage.setItem('dc_lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t, translating }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
