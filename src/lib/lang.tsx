import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SupportedLang } from './voice'

type LangContextType = {
  lang: SupportedLang
  setLang: (l: SupportedLang) => void
}

const LangContext = createContext<LangContextType>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(
    () => (localStorage.getItem('dc_lang') as SupportedLang) ?? 'en'
  )

  function setLang(l: SupportedLang) {
    setLangState(l)
    localStorage.setItem('dc_lang', l)
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
