// Browser Web Speech API — no external service needed

export type SupportedLang = 'en' | 'es' | 'tl'

export const LANG_CONFIG: Record<SupportedLang, { label: string; speechLang: string; name: string }> = {
  en: { label: 'English', speechLang: 'en-US', name: 'English' },
  es: { label: 'Español', speechLang: 'es-US', name: 'Spanish' },
  tl: { label: 'Tagalog', speechLang: 'fil-PH', name: 'Tagalog' },
}

// Text-to-speech
export function speak(text: string, lang: SupportedLang, onEnd?: () => void) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text))
  utterance.lang = LANG_CONFIG[lang].speechLang
  utterance.rate = 0.95
  utterance.pitch = 1.05
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  window.speechSynthesis.cancel()
}

// Strip markdown before speaking
function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/---/g, '')
    .replace(/`(.*?)`/g, '$1')
}

// Speech recognition
type RecognitionCallback = (transcript: string) => void

export function startListening(
  lang: SupportedLang,
  onResult: RecognitionCallback,
  onError: (err: string) => void,
): (() => void) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Try Chrome.')
    return () => {}
  }

  const recognition = new SpeechRecognition()
  recognition.lang = LANG_CONFIG[lang].speechLang
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event: any) => {
    if (event.error !== 'aborted') onError(event.error)
  }

  recognition.start()
  return () => recognition.abort()
}

export function isSpeechSupported(): boolean {
  return !!(
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) &&
    window.speechSynthesis
  )
}
