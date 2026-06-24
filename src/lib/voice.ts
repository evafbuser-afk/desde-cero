import { getLanguage } from './languages'

// A language is identified by its BCP-47 code (e.g. 'en', 'es', 'tl', 'zh', ...)
export type SupportedLang = string

function speechCode(lang: SupportedLang): string {
  return getLanguage(lang).speech
}

// Text-to-speech
export function speak(text: string, lang: SupportedLang, onEnd?: () => void) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text))
  utterance.lang = speechCode(lang)
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
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Try Chrome.')
    return () => {}
  }

  const recognition = new SpeechRecognition()
  recognition.lang = speechCode(lang)
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event: any) => {
    onResult(event.results[0][0].transcript)
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
