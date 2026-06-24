export type Dict = {
  nav_signin: string
  hero_badge: string
  hero_title_1: string
  hero_title_2: string
  hero_subtitle: string
  hero_cta: string
  hero_note: string
  features: { title: string; desc: string }[]
  story_kicker: string
  story_title: string
  story_subtitle: string
  story_give: string
  story_get: string
  steps: { title: string; give: string; get: string }[]
  cta_title: string
  cta_subtitle: string
  cta_button: string
  auth_tagline: string
  auth_email_title: string
  auth_email_sub: string
  auth_email_placeholder: string
  auth_send: string
  auth_sending: string
  auth_privacy: string
  auth_sent_title: string
  auth_sent_body: string
  auth_sent_spam: string
  auth_different: string
  auth_back: string
  interview_label: string
  onboarding_greeting: string
  building_plan: string
  voice_turn_on: string
  voice_on: string
  voice_listening: string
  voice_speaking: string
  voice_hint: string
  input_placeholder: string
}

export const T: Record<string, Dict> = {
  en: {
    nav_signin: 'Sign in',
    hero_badge: 'Your career journey starts here',
    hero_title_1: 'From zero to your',
    hero_title_2: ' dream career',
    hero_subtitle:
      'Desde Cero uses AI to build a personalized career path just for you — no matter where you\'re starting from.',
    hero_cta: 'Start for free — no account needed',
    hero_note: 'Just your email to get started',
    features: [
      { title: 'Personalized to you', desc: 'AI interviews you to understand your goals, skills, and schedule.' },
      { title: 'Just 20 minutes a day', desc: 'Built for people with full lives. Learn before work, on a break, or after dinner.' },
      { title: 'Close your skill gaps', desc: 'We identify exactly what you need to learn for your target role.' },
      { title: 'Resume that grows with you', desc: 'Your resume updates automatically as you build new skills.' },
    ],
    story_kicker: 'How it works',
    story_title: 'Your journey, step by step',
    story_subtitle: 'Here\'s what you put in — and what you get back at every stage.',
    story_give: 'You give',
    story_get: 'You get',
    steps: [
      { title: 'You talk, we listen', give: 'Tell us about yourself — by voice or typing, in your language', get: 'A coach that truly understands your life and dreams' },
      { title: 'We build your path', give: '20 minutes a day — that\'s all', get: 'A personalized 30-day roadmap to your goal' },
      { title: 'You learn & grow', give: 'Show up each day and complete small lessons', get: 'New skills, filled gaps, and growing confidence' },
      { title: 'You land the job', give: 'Keep going — we cheer you on', get: 'A ready resume and a real shot at your dream career' },
    ],
    cta_title: 'Ready to start from zero?',
    cta_subtitle: 'Thousands of people just like you are already on their path.',
    cta_button: 'Get started now',
    auth_tagline: 'Your journey starts with a single step',
    auth_email_title: 'Enter your email',
    auth_email_sub: 'We\'ll email you a sign-in link',
    auth_email_placeholder: 'you@example.com',
    auth_send: 'Send me a link',
    auth_sending: 'Sending...',
    auth_privacy: 'We\'ll never share your email or send spam.',
    auth_sent_title: 'Check your email',
    auth_sent_body: 'We sent a sign-in link to {email}. Open it on this device and you\'ll be signed in automatically.',
    auth_sent_spam: 'Don\'t see it? Check your spam folder, or wait a minute and try again.',
    auth_different: 'Use a different email',
    auth_back: 'Back to home',
    interview_label: 'Personalized interview',
    onboarding_greeting:
      "Hi! I'm so glad you're here. I'm your personal career coach, and I'm going to help you build a plan that fits your life.\n\nLet's start simple — what's your name, and can you tell me a little about yourself?",
    building_plan: '✨ I have everything I need! Building your personalized 30-day roadmap now...',
    voice_turn_on: 'Turn on voice',
    voice_on: 'Voice mode: ON',
    voice_listening: 'Listening...',
    voice_speaking: 'Coach is speaking...',
    voice_hint: 'Voice mode — tap the mic to speak',
    input_placeholder: 'Type your message...',
  },
  es: {
    nav_signin: 'Iniciar sesión',
    hero_badge: 'Tu camino profesional empieza aquí',
    hero_title_1: 'De cero a la',
    hero_title_2: ' carrera de tus sueños',
    hero_subtitle:
      'Desde Cero usa inteligencia artificial para crear un camino profesional personalizado solo para ti — sin importar desde dónde empieces.',
    hero_cta: 'Empieza gratis — sin necesidad de cuenta',
    hero_note: 'Solo tu correo para empezar',
    features: [
      { title: 'Personalizado para ti', desc: 'La IA te entrevista para entender tus metas, habilidades y horario.' },
      { title: 'Solo 20 minutos al día', desc: 'Hecho para personas con vidas ocupadas. Aprende antes del trabajo, en un descanso o después de cenar.' },
      { title: 'Cierra tus brechas de habilidades', desc: 'Identificamos exactamente lo que necesitas aprender para tu meta.' },
      { title: 'Un currículum que crece contigo', desc: 'Tu currículum se actualiza automáticamente a medida que ganas habilidades.' },
    ],
    story_kicker: 'Cómo funciona',
    story_title: 'Tu camino, paso a paso',
    story_subtitle: 'Esto es lo que aportas — y lo que recibes en cada etapa.',
    story_give: 'Tú aportas',
    story_get: 'Tú recibes',
    steps: [
      { title: 'Tú hablas, nosotros escuchamos', give: 'Cuéntanos sobre ti — por voz o escribiendo, en tu idioma', get: 'Un coach que entiende de verdad tu vida y tus sueños' },
      { title: 'Construimos tu camino', give: '20 minutos al día — eso es todo', get: 'Un plan personalizado de 30 días hacia tu meta' },
      { title: 'Aprendes y creces', give: 'Aparece cada día y completa lecciones cortas', get: 'Nuevas habilidades, brechas cerradas y más confianza' },
      { title: 'Consigues el trabajo', give: 'Sigue adelante — te animamos', get: 'Un currículum listo y una oportunidad real para tu carrera soñada' },
    ],
    cta_title: '¿Listo para empezar desde cero?',
    cta_subtitle: 'Miles de personas como tú ya están en su camino.',
    cta_button: 'Empieza ahora',
    auth_tagline: 'Tu camino empieza con un solo paso',
    auth_email_title: 'Ingresa tu correo',
    auth_email_sub: 'Te enviaremos un enlace para iniciar sesión',
    auth_email_placeholder: 'tu@ejemplo.com',
    auth_send: 'Envíame un enlace',
    auth_sending: 'Enviando...',
    auth_privacy: 'Nunca compartiremos tu correo ni enviaremos spam.',
    auth_sent_title: 'Revisa tu correo',
    auth_sent_body: 'Enviamos un enlace de inicio de sesión a {email}. Ábrelo en este dispositivo y entrarás automáticamente.',
    auth_sent_spam: '¿No lo ves? Revisa tu carpeta de spam o espera un minuto e inténtalo de nuevo.',
    auth_different: 'Usar otro correo',
    auth_back: 'Volver al inicio',
    interview_label: 'Entrevista personalizada',
    onboarding_greeting:
      '¡Hola! Me alegra mucho que estés aquí. Soy tu coach de carrera personal y voy a ayudarte a construir un plan que se adapte a tu vida.\n\nEmpecemos simple — ¿cuál es tu nombre y puedes contarme un poco sobre ti?',
    building_plan: '✨ ¡Tengo todo lo que necesito! Construyendo tu plan personalizado de 30 días...',
    voice_turn_on: 'Activar voz',
    voice_on: 'Modo de voz: ON',
    voice_listening: 'Escuchando...',
    voice_speaking: 'El coach está hablando...',
    voice_hint: 'Modo de voz — toca el micrófono para hablar',
    input_placeholder: 'Escribe tu mensaje...',
  },
  tl: {
    nav_signin: 'Mag-sign in',
    hero_badge: 'Dito nagsisimula ang iyong career',
    hero_title_1: 'Mula sa wala tungo sa',
    hero_title_2: ' career na pinapangarap mo',
    hero_subtitle:
      'Gumagamit ang Desde Cero ng AI para gumawa ng personalisadong landas sa career para sa\'yo — kahit saan ka pa nagsisimula.',
    hero_cta: 'Magsimula nang libre — walang kailangang account',
    hero_note: 'Email mo lang ang kailangan para magsimula',
    features: [
      { title: 'Personalisado para sa\'yo', desc: 'Iinterbyuhin ka ng AI para maunawaan ang iyong mga layunin, kasanayan, at iskedyul.' },
      { title: '20 minuto lang bawat araw', desc: 'Ginawa para sa mga taong abala. Matuto bago magtrabaho, sa break, o pagkatapos maghapunan.' },
      { title: 'Punan ang kakulangan sa kasanayan', desc: 'Tutukuyin namin kung ano talaga ang kailangan mong matutunan para sa iyong layunin.' },
      { title: 'Resume na lumalago kasama mo', desc: 'Awtomatikong ina-update ang iyong resume habang nadadagdagan ang iyong kasanayan.' },
    ],
    story_kicker: 'Paano ito gumagana',
    story_title: 'Ang iyong paglalakbay, hakbang-hakbang',
    story_subtitle: 'Ito ang iyong ibibigay — at ang makukuha mo sa bawat yugto.',
    story_give: 'Ibibigay mo',
    story_get: 'Makukuha mo',
    steps: [
      { title: 'Magsalita ka, makikinig kami', give: 'Ikuwento ang tungkol sa\'yo — sa boses o pag-type, sa wika mo', get: 'Isang coach na tunay na nakakaunawa sa buhay at pangarap mo' },
      { title: 'Bubuuin namin ang landas mo', give: '20 minuto bawat araw — iyon lang', get: 'Personalisadong 30-araw na plano tungo sa layunin mo' },
      { title: 'Matututo at lalago ka', give: 'Bumalik araw-araw at tapusin ang maikling aralin', get: 'Bagong kasanayan, napunang kakulangan, at lumalagong tiwala' },
      { title: 'Makukuha mo ang trabaho', give: 'Magpatuloy — kasama mo kami', get: 'Handang resume at tunay na pagkakataon sa pinapangarap mong career' },
    ],
    cta_title: 'Handa ka na bang magsimula sa wala?',
    cta_subtitle: 'Libu-libong tao na katulad mo ang nasa kanilang landas na.',
    cta_button: 'Magsimula na ngayon',
    auth_tagline: 'Nagsisimula ang iyong paglalakbay sa isang hakbang',
    auth_email_title: 'Ilagay ang iyong email',
    auth_email_sub: 'Padadalhan ka namin ng sign-in link',
    auth_email_placeholder: 'ikaw@halimbawa.com',
    auth_send: 'Padalhan ako ng link',
    auth_sending: 'Pinapadala...',
    auth_privacy: 'Hindi namin ibabahagi ang iyong email o magpapadala ng spam.',
    auth_sent_title: 'Tingnan ang iyong email',
    auth_sent_body: 'Nagpadala kami ng sign-in link sa {email}. Buksan ito sa device na ito at awtomatiko kang maka-sign in.',
    auth_sent_spam: 'Hindi mo makita? Tingnan ang spam folder, o maghintay ng isang minuto at subukan muli.',
    auth_different: 'Gumamit ng ibang email',
    auth_back: 'Bumalik sa simula',
    interview_label: 'Personal na panayam',
    onboarding_greeting:
      'Kumusta! Natutuwa akong narito ka. Ako ang iyong personal na career coach at tutulungan kitang bumuo ng plano na angkop sa iyong buhay.\n\nSimulan natin nang simple — ano ang iyong pangalan, at maaari mo bang ikuwento ang kaunti tungkol sa iyong sarili?',
    building_plan: '✨ Mayroon na akong lahat ng kailangan ko! Ginagawa na ang iyong 30-araw na roadmap...',
    voice_turn_on: 'I-on ang boses',
    voice_on: 'Mode ng boses: ON',
    voice_listening: 'Nakikinig...',
    voice_speaking: 'Nagsasalita ang AI...',
    voice_hint: 'Mode ng boses — i-tap ang mikropono para magsalita',
    input_placeholder: 'I-type ang iyong mensahe...',
  },
}

// English is the source of truth for on-the-fly translation into any other language.
export const BASE_DICT: Dict = T.en

