export type Language = "en" | "ru" | "es" | "de" | "fr" | "sr";
export type ThemeMode = "light" | "dark";

const en = {
  "meta.title": "lifetracker | Habit tracking with realtime progress",
  "meta.description":
    "lifetracker helps people track habits, join realtime challenges, and understand personal progress from one accessible dashboard.",
  "controls.label": "Display preferences",
  "controls.language": "Language",
  "controls.theme": "Theme",
  "controls.theme.dark": "Dark",
  "controls.theme.light": "Light",
  "controls.theme.toDark": "Switch to dark theme",
  "controls.theme.toLight": "Switch to light theme",
  "auth.skip": "Skip to main content",
  "auth.loadingDashboard": "Loading your dashboard...",
  "auth.title": "Build momentum you can actually see.",
  "auth.copy":
    "Track habits, join live challenges, unlock achievements, and watch your progress update across devices in real time.",
  "auth.preview.label": "Example daily progress snapshot",
  "auth.preview.today": "Today",
  "auth.preview.focus": "82 focus score",
  "auth.preview.summary":
    "Preview chart showing seven daily progress bars, ending at a complete day.",
  "auth.preview.streak": "7 day streak unlocked",
  "auth.preview.live": "Live challenge feed connected",
  "auth.form.label": "lifetracker account access",
  "auth.mode.label": "Authentication mode",
  "auth.mode.login": "Login",
  "auth.mode.register": "Register",
  "auth.name": "Name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.error": "Authentication failed",
  "auth.submit.loading": "Connecting...",
  "auth.submit.login": "Open dashboard",
  "auth.submit.register": "Create account",
  "auth.demo": "Demo account: demo@lifetracker.dev / demo1234",
  "nav.label": "Dashboard navigation",
  "nav.sections": "Dashboard sections",
  "nav.today": "Today",
  "nav.challenges": "Challenges",
  "nav.progress": "Progress",
  "nav.liveFeed": "Live feed",
  "nav.logout": "Logout",
  "dashboard.eyebrow": "Personal growth cockpit",
  "dashboard.welcome": "Welcome back, {name}",
  "dashboard.online": "{count} online",
  "dashboard.loading": "Loading your momentum...",
  "dashboard.error": "Dashboard failed to load.",
  "dashboard.realtimeError":
    "Live updates are temporarily unavailable. Your saved data still works.",
  "stats.label": "Current habit statistics",
  "stats.activeStreak": "Active streak",
  "stats.completedToday": "Completed today",
  "stats.weeklyRate": "Weekly rate",
  "stats.focusScore": "Focus score",
  "habit.defaultName": "Read for 20 minutes",
  "habit.createTitle": "Create habit",
  "habit.name": "Habit name",
  "habit.category": "Habit category",
  "habit.color": "Habit color",
  "habit.colorChoice": "Use {color} as habit color",
  "habit.target": "Target per week: {count}",
  "habit.add": "Add habit",
  "habit.meta": "{category} - target {target}/week",
  "habit.complete": "Complete {name}",
  "habits.title": "Today habits",
  "habits.mood": "Completion mood",
  "progress.title": "Weekly rhythm",
  "progress.byDate": "Habit completions by date: {summary}",
  "progress.byCategory": "Habit completions by category: {summary}",
  "challenges.title": "Live challenges",
  "challenges.loading": "Loading challenges...",
  "challenges.joined": "{count} joined",
  "challenges.join": "Join",
  "feed.title": "Realtime feed",
  "feed.empty": "Complete a habit to stream the first event.",
  "event.userRegistered": "{name} joined lifetracker",
  "event.habitCreated": "{name} created",
  "event.habitCompleted": "{habitName} reached streak {streak}",
  "event.streakUpdated": "Streak is now {streak}",
  "event.achievementUnlocked": "{title} unlocked",
  "event.challengeJoined": "Joined {title}",
  "event.reminderScheduled": "Reminder scheduled",
  "event.type.userRegistered": "user registered",
  "event.type.habitCreated": "habit created",
  "event.type.habitCompleted": "habit completed",
  "event.type.streakUpdated": "streak updated",
  "event.type.achievementUnlocked": "achievement unlocked",
  "event.type.challengeJoined": "challenge joined",
  "event.type.reminderScheduled": "reminder scheduled",
  "category.fitness": "fitness",
  "category.mind": "mind",
  "category.nutrition": "nutrition",
  "category.learning": "learning",
  "category.sleep": "sleep",
  "category.finance": "finance",
  "category.creative": "creative",
  "mood.great": "great",
  "mood.good": "good",
  "mood.neutral": "neutral",
  "mood.tired": "tired",
  "mood.stressed": "stressed",
  "challenge.7 Day Reset.title": "7 Day Reset",
  "challenge.7 Day Reset.description":
    "Complete one mindful action every day and keep the room feed alive.",
  "challenge.Learning Sprint.title": "Learning Sprint",
  "challenge.Learning Sprint.description":
    "Four focused sessions per week with live progress and streak rewards.",
  "challenge.Sleep Anchor.title": "Sleep Anchor",
  "challenge.Sleep Anchor.description":
    "Build a consistent evening routine and watch your weekly rhythm improve.",
  "errors.generic": "Something went wrong. Please try again.",
  "errors.network": "Connection problem. Check your internet and try again.",
  "errors.auth": "We could not sign you in. Check the form and try again.",
  "errors.authInvalid": "Email or password is incorrect.",
  "errors.emailExists": "This email is already registered. Try logging in instead.",
  "errors.dashboard": "We could not load your dashboard. Please refresh the page.",
  "errors.createHabit": "We could not create the habit. Check the name and try again.",
  "errors.completeHabit": "We could not complete this habit. Try again in a moment.",
  "errors.joinChallenge": "We could not join this challenge. Try again in a moment.",
  "errors.notFound": "This item was not found. Refresh the page and try again.",
  "errors.server": "The service is temporarily unavailable. Try again soon."
} as const;

export type TranslationKey = keyof typeof en;
type Dictionary = Record<TranslationKey, string>;
type ErrorTranslationKey = Extract<TranslationKey, `errors.${string}`>;

const ru = {
  "meta.title": "lifetracker | Трекинг привычек и прогресса в реальном времени",
  "meta.description":
    "lifetracker помогает отслеживать привычки, участвовать в live-челленджах и видеть личный прогресс в доступном dashboard.",
  "controls.label": "Настройки отображения",
  "controls.language": "Язык",
  "controls.theme": "Тема",
  "controls.theme.dark": "Тёмная",
  "controls.theme.light": "Светлая",
  "controls.theme.toDark": "Включить тёмную тему",
  "controls.theme.toLight": "Включить светлую тему",
  "auth.skip": "Перейти к основному контенту",
  "auth.loadingDashboard": "Загружаем dashboard...",
  "auth.title": "Создавай прогресс, который реально видно.",
  "auth.copy":
    "Отслеживай привычки, участвуй в live-челленджах, открывай достижения и смотри, как прогресс обновляется на всех устройствах в реальном времени.",
  "auth.preview.label": "Пример дневного прогресса",
  "auth.preview.today": "Сегодня",
  "auth.preview.focus": "82 балла фокуса",
  "auth.preview.summary":
    "Превью графика с семью дневными столбцами прогресса, где последний день выполнен полностью.",
  "auth.preview.streak": "Открыта серия 7 дней",
  "auth.preview.live": "Live-лента челленджа подключена",
  "auth.form.label": "Вход в аккаунт lifetracker",
  "auth.mode.label": "Режим авторизации",
  "auth.mode.login": "Вход",
  "auth.mode.register": "Регистрация",
  "auth.name": "Имя",
  "auth.email": "Email",
  "auth.password": "Пароль",
  "auth.error": "Не удалось авторизоваться",
  "auth.submit.loading": "Подключаемся...",
  "auth.submit.login": "Открыть dashboard",
  "auth.submit.register": "Создать аккаунт",
  "auth.demo": "Демо-аккаунт: demo@lifetracker.dev / demo1234",
  "nav.label": "Навигация dashboard",
  "nav.sections": "Разделы dashboard",
  "nav.today": "Сегодня",
  "nav.challenges": "Челленджи",
  "nav.progress": "Прогресс",
  "nav.liveFeed": "Live-лента",
  "nav.logout": "Выйти",
  "dashboard.eyebrow": "Центр личного прогресса",
  "dashboard.welcome": "С возвращением, {name}",
  "dashboard.online": "{count} онлайн",
  "dashboard.loading": "Загружаем твой прогресс...",
  "dashboard.error": "Не удалось загрузить dashboard.",
  "dashboard.realtimeError":
    "Live-обновления временно недоступны. Сохранённые данные продолжают работать.",
  "stats.label": "Текущая статистика привычек",
  "stats.activeStreak": "Активная серия",
  "stats.completedToday": "Выполнено сегодня",
  "stats.weeklyRate": "Недельный темп",
  "stats.focusScore": "Фокус",
  "habit.defaultName": "Читать 20 минут",
  "habit.createTitle": "Создать привычку",
  "habit.name": "Название привычки",
  "habit.category": "Категория привычки",
  "habit.color": "Цвет привычки",
  "habit.colorChoice": "Использовать {color} как цвет привычки",
  "habit.target": "Цель в неделю: {count}",
  "habit.add": "Добавить привычку",
  "habit.meta": "{category} - цель {target}/неделю",
  "habit.complete": "Отметить привычку {name}",
  "habits.title": "Привычки на сегодня",
  "habits.mood": "Настроение при выполнении",
  "progress.title": "Недельный ритм",
  "progress.byDate": "Выполнение привычек по датам: {summary}",
  "progress.byCategory": "Выполнение привычек по категориям: {summary}",
  "challenges.title": "Live-челленджи",
  "challenges.loading": "Загружаем челленджи...",
  "challenges.joined": "{count} участников",
  "challenges.join": "Вступить",
  "feed.title": "Лента в реальном времени",
  "feed.empty": "Выполни привычку, чтобы отправить первое событие в ленту.",
  "event.userRegistered": "Пользователь {name} присоединился к lifetracker",
  "event.habitCreated": "Привычка «{name}» создана",
  "event.habitCompleted": "{habitName}: серия {streak}",
  "event.streakUpdated": "Серия обновлена: {streak}",
  "event.achievementUnlocked": "Достижение «{title}» открыто",
  "event.challengeJoined": "Вступление в «{title}»",
  "event.reminderScheduled": "Напоминание запланировано",
  "event.type.userRegistered": "пользователь зарегистрирован",
  "event.type.habitCreated": "привычка создана",
  "event.type.habitCompleted": "привычка выполнена",
  "event.type.streakUpdated": "серия обновлена",
  "event.type.achievementUnlocked": "достижение открыто",
  "event.type.challengeJoined": "челлендж принят",
  "event.type.reminderScheduled": "напоминание запланировано",
  "category.fitness": "фитнес",
  "category.mind": "осознанность",
  "category.nutrition": "питание",
  "category.learning": "обучение",
  "category.sleep": "сон",
  "category.finance": "финансы",
  "category.creative": "творчество",
  "mood.great": "отлично",
  "mood.good": "хорошо",
  "mood.neutral": "нормально",
  "mood.tired": "усталость",
  "mood.stressed": "стресс",
  "challenge.7 Day Reset.title": "7-дневный перезапуск",
  "challenge.7 Day Reset.description":
    "Выполняй одно осознанное действие каждый день и поддерживай live-ленту.",
  "challenge.Learning Sprint.title": "Учебный спринт",
  "challenge.Learning Sprint.description":
    "Четыре фокус-сессии в неделю с live-прогрессом и наградами за серию.",
  "challenge.Sleep Anchor.title": "Якорь сна",
  "challenge.Sleep Anchor.description":
    "Построй стабильный вечерний ритуал и улучшай недельный ритм.",
  "errors.generic": "Что-то пошло не так. Попробуйте ещё раз.",
  "errors.network": "Проблема с соединением. Проверьте интернет и попробуйте снова.",
  "errors.auth": "Не удалось войти. Проверьте форму и попробуйте снова.",
  "errors.authInvalid": "Email или пароль неверные.",
  "errors.emailExists": "Этот email уже зарегистрирован. Попробуйте войти.",
  "errors.dashboard": "Не удалось загрузить dashboard. Обновите страницу.",
  "errors.createHabit": "Не удалось создать привычку. Проверьте название и попробуйте снова.",
  "errors.completeHabit": "Не удалось отметить привычку. Попробуйте чуть позже.",
  "errors.joinChallenge": "Не удалось вступить в челлендж. Попробуйте чуть позже.",
  "errors.notFound": "Элемент не найден. Обновите страницу и попробуйте снова.",
  "errors.server": "Сервис временно недоступен. Попробуйте позже."
} satisfies Dictionary;

const es = {
  "meta.title": "lifetracker | Hábitos y progreso en tiempo real",
  "meta.description":
    "lifetracker ayuda a seguir hábitos, unirse a retos en vivo y entender el progreso personal desde un dashboard accesible.",
  "controls.label": "Preferencias de visualización",
  "controls.language": "Idioma",
  "controls.theme": "Tema",
  "controls.theme.dark": "Oscuro",
  "controls.theme.light": "Claro",
  "controls.theme.toDark": "Activar tema oscuro",
  "controls.theme.toLight": "Activar tema claro",
  "auth.skip": "Ir al contenido principal",
  "auth.loadingDashboard": "Cargando tu dashboard...",
  "auth.title": "Crea progreso que se ve.",
  "auth.copy":
    "Sigue hábitos, participa en retos en vivo, desbloquea logros y mira cómo tu progreso se actualiza en todos tus dispositivos.",
  "auth.preview.label": "Ejemplo de progreso diario",
  "auth.preview.today": "Hoy",
  "auth.preview.focus": "82 puntos de foco",
  "auth.preview.summary":
    "Vista previa de un gráfico con siete barras diarias, terminando en un día completo.",
  "auth.preview.streak": "Racha de 7 días desbloqueada",
  "auth.preview.live": "Feed del reto conectado",
  "auth.form.label": "Acceso a lifetracker",
  "auth.mode.label": "Modo de acceso",
  "auth.mode.login": "Entrar",
  "auth.mode.register": "Registro",
  "auth.name": "Nombre",
  "auth.email": "Email",
  "auth.password": "Contraseña",
  "auth.error": "No se pudo iniciar sesión",
  "auth.submit.loading": "Conectando...",
  "auth.submit.login": "Abrir dashboard",
  "auth.submit.register": "Crear cuenta",
  "auth.demo": "Cuenta demo: demo@lifetracker.dev / demo1234",
  "nav.label": "Navegación del dashboard",
  "nav.sections": "Secciones del dashboard",
  "nav.today": "Hoy",
  "nav.challenges": "Retos",
  "nav.progress": "Progreso",
  "nav.liveFeed": "Feed en vivo",
  "nav.logout": "Salir",
  "dashboard.eyebrow": "Centro de progreso personal",
  "dashboard.welcome": "Bienvenido, {name}",
  "dashboard.online": "{count} en línea",
  "dashboard.loading": "Cargando tu progreso...",
  "dashboard.error": "No se pudo cargar el dashboard.",
  "dashboard.realtimeError":
    "Las actualizaciones en vivo no están disponibles ahora. Tus datos guardados siguen funcionando.",
  "stats.label": "Estadísticas actuales de hábitos",
  "stats.activeStreak": "Racha activa",
  "stats.completedToday": "Completado hoy",
  "stats.weeklyRate": "Ritmo semanal",
  "stats.focusScore": "Foco",
  "habit.defaultName": "Leer 20 minutos",
  "habit.createTitle": "Crear hábito",
  "habit.name": "Nombre del hábito",
  "habit.category": "Categoría del hábito",
  "habit.color": "Color del hábito",
  "habit.colorChoice": "Usar {color} como color del hábito",
  "habit.target": "Objetivo semanal: {count}",
  "habit.add": "Añadir hábito",
  "habit.meta": "{category} - objetivo {target}/semana",
  "habit.complete": "Completar {name}",
  "habits.title": "Hábitos de hoy",
  "habits.mood": "Ánimo al completar",
  "progress.title": "Ritmo semanal",
  "progress.byDate": "Hábitos completados por fecha: {summary}",
  "progress.byCategory": "Hábitos completados por categoría: {summary}",
  "challenges.title": "Retos en vivo",
  "challenges.loading": "Cargando retos...",
  "challenges.joined": "{count} unidos",
  "challenges.join": "Unirse",
  "feed.title": "Feed en tiempo real",
  "feed.empty": "Completa un hábito para enviar el primer evento al feed.",
  "event.userRegistered": "{name} se unió a lifetracker",
  "event.habitCreated": "{name} creado",
  "event.habitCompleted": "{habitName} llegó a racha {streak}",
  "event.streakUpdated": "Racha actual: {streak}",
  "event.achievementUnlocked": "{title} desbloqueado",
  "event.challengeJoined": "Te uniste a {title}",
  "event.reminderScheduled": "Recordatorio programado",
  "event.type.userRegistered": "usuario registrado",
  "event.type.habitCreated": "hábito creado",
  "event.type.habitCompleted": "hábito completado",
  "event.type.streakUpdated": "racha actualizada",
  "event.type.achievementUnlocked": "logro desbloqueado",
  "event.type.challengeJoined": "reto aceptado",
  "event.type.reminderScheduled": "recordatorio programado",
  "category.fitness": "fitness",
  "category.mind": "mente",
  "category.nutrition": "nutrición",
  "category.learning": "aprendizaje",
  "category.sleep": "sueño",
  "category.finance": "finanzas",
  "category.creative": "creatividad",
  "mood.great": "genial",
  "mood.good": "bien",
  "mood.neutral": "normal",
  "mood.tired": "cansancio",
  "mood.stressed": "estrés",
  "challenge.7 Day Reset.title": "Reinicio de 7 días",
  "challenge.7 Day Reset.description":
    "Completa una acción consciente cada día y mantén vivo el feed.",
  "challenge.Learning Sprint.title": "Sprint de aprendizaje",
  "challenge.Learning Sprint.description":
    "Cuatro sesiones de foco por semana con progreso en vivo y recompensas.",
  "challenge.Sleep Anchor.title": "Ancla de sueño",
  "challenge.Sleep Anchor.description":
    "Crea una rutina nocturna estable y mejora tu ritmo semanal.",
  "errors.generic": "Algo salió mal. Inténtalo de nuevo.",
  "errors.network": "Hay un problema de conexión. Revisa internet e inténtalo de nuevo.",
  "errors.auth": "No pudimos iniciar sesión. Revisa el formulario e inténtalo de nuevo.",
  "errors.authInvalid": "El email o la contraseña no son correctos.",
  "errors.emailExists": "Este email ya está registrado. Intenta iniciar sesión.",
  "errors.dashboard": "No pudimos cargar el dashboard. Actualiza la página.",
  "errors.createHabit": "No pudimos crear el hábito. Revisa el nombre e inténtalo de nuevo.",
  "errors.completeHabit": "No pudimos completar este hábito. Inténtalo en un momento.",
  "errors.joinChallenge": "No pudimos unirnos a este reto. Inténtalo en un momento.",
  "errors.notFound": "No encontramos este elemento. Actualiza la página e inténtalo de nuevo.",
  "errors.server": "El servicio no está disponible temporalmente. Inténtalo pronto."
} satisfies Dictionary;

const de = {
  "meta.title": "lifetracker | Gewohnheiten und Fortschritt in Echtzeit",
  "meta.description":
    "lifetracker hilft dir, Gewohnheiten zu verfolgen, Live-Challenges zu starten und deinen Fortschritt in einem zugänglichen Dashboard zu verstehen.",
  "controls.label": "Anzeigeeinstellungen",
  "controls.language": "Sprache",
  "controls.theme": "Design",
  "controls.theme.dark": "Dunkel",
  "controls.theme.light": "Hell",
  "controls.theme.toDark": "Dunkles Design aktivieren",
  "controls.theme.toLight": "Helles Design aktivieren",
  "auth.skip": "Zum Hauptinhalt springen",
  "auth.loadingDashboard": "Dashboard wird geladen...",
  "auth.title": "Baue Fortschritt auf, den du siehst.",
  "auth.copy":
    "Verfolge Gewohnheiten, nimm an Live-Challenges teil, schalte Erfolge frei und sieh deinen Fortschritt auf allen Geräten in Echtzeit.",
  "auth.preview.label": "Beispiel für Tagesfortschritt",
  "auth.preview.today": "Heute",
  "auth.preview.focus": "82 Fokus-Punkte",
  "auth.preview.summary":
    "Vorschau eines Diagramms mit sieben Tagesbalken, der letzte Tag ist vollständig.",
  "auth.preview.streak": "7-Tage-Serie freigeschaltet",
  "auth.preview.live": "Live-Challenge-Feed verbunden",
  "auth.form.label": "lifetracker Kontozugang",
  "auth.mode.label": "Anmeldemodus",
  "auth.mode.login": "Login",
  "auth.mode.register": "Registrieren",
  "auth.name": "Name",
  "auth.email": "Email",
  "auth.password": "Passwort",
  "auth.error": "Anmeldung fehlgeschlagen",
  "auth.submit.loading": "Verbinden...",
  "auth.submit.login": "Dashboard öffnen",
  "auth.submit.register": "Konto erstellen",
  "auth.demo": "Demo-Konto: demo@lifetracker.dev / demo1234",
  "nav.label": "Dashboard-Navigation",
  "nav.sections": "Dashboard-Bereiche",
  "nav.today": "Heute",
  "nav.challenges": "Challenges",
  "nav.progress": "Fortschritt",
  "nav.liveFeed": "Live-Feed",
  "nav.logout": "Abmelden",
  "dashboard.eyebrow": "Zentrum für persönlichen Fortschritt",
  "dashboard.welcome": "Willkommen zurück, {name}",
  "dashboard.online": "{count} online",
  "dashboard.loading": "Fortschritt wird geladen...",
  "dashboard.error": "Dashboard konnte nicht geladen werden.",
  "dashboard.realtimeError":
    "Live-Updates sind vorübergehend nicht verfügbar. Gespeicherte Daten funktionieren weiter.",
  "stats.label": "Aktuelle Gewohnheitsstatistik",
  "stats.activeStreak": "Aktive Serie",
  "stats.completedToday": "Heute erledigt",
  "stats.weeklyRate": "Wochenrate",
  "stats.focusScore": "Fokus",
  "habit.defaultName": "20 Minuten lesen",
  "habit.createTitle": "Gewohnheit erstellen",
  "habit.name": "Name der Gewohnheit",
  "habit.category": "Kategorie der Gewohnheit",
  "habit.color": "Farbe der Gewohnheit",
  "habit.colorChoice": "{color} als Farbe verwenden",
  "habit.target": "Ziel pro Woche: {count}",
  "habit.add": "Gewohnheit hinzufügen",
  "habit.meta": "{category} - Ziel {target}/Woche",
  "habit.complete": "{name} abschließen",
  "habits.title": "Heutige Gewohnheiten",
  "habits.mood": "Stimmung beim Abschluss",
  "progress.title": "Wochenrhythmus",
  "progress.byDate": "Abgeschlossene Gewohnheiten nach Datum: {summary}",
  "progress.byCategory": "Abgeschlossene Gewohnheiten nach Kategorie: {summary}",
  "challenges.title": "Live-Challenges",
  "challenges.loading": "Challenges werden geladen...",
  "challenges.joined": "{count} dabei",
  "challenges.join": "Beitreten",
  "feed.title": "Echtzeit-Feed",
  "feed.empty": "Schließe eine Gewohnheit ab, um das erste Ereignis zu senden.",
  "event.userRegistered": "{name} ist lifetracker beigetreten",
  "event.habitCreated": "{name} erstellt",
  "event.habitCompleted": "{habitName} erreichte Serie {streak}",
  "event.streakUpdated": "Serie ist jetzt {streak}",
  "event.achievementUnlocked": "{title} freigeschaltet",
  "event.challengeJoined": "{title} beigetreten",
  "event.reminderScheduled": "Erinnerung geplant",
  "event.type.userRegistered": "Nutzer registriert",
  "event.type.habitCreated": "Gewohnheit erstellt",
  "event.type.habitCompleted": "Gewohnheit erledigt",
  "event.type.streakUpdated": "Serie aktualisiert",
  "event.type.achievementUnlocked": "Erfolg freigeschaltet",
  "event.type.challengeJoined": "Challenge beigetreten",
  "event.type.reminderScheduled": "Erinnerung geplant",
  "category.fitness": "Fitness",
  "category.mind": "Achtsamkeit",
  "category.nutrition": "Ernährung",
  "category.learning": "Lernen",
  "category.sleep": "Schlaf",
  "category.finance": "Finanzen",
  "category.creative": "Kreativ",
  "mood.great": "super",
  "mood.good": "gut",
  "mood.neutral": "normal",
  "mood.tired": "müde",
  "mood.stressed": "Stress",
  "challenge.7 Day Reset.title": "7-Tage-Neustart",
  "challenge.7 Day Reset.description":
    "Erledige jeden Tag eine bewusste Aktion und halte den Live-Feed aktiv.",
  "challenge.Learning Sprint.title": "Lern-Sprint",
  "challenge.Learning Sprint.description":
    "Vier Fokus-Sessions pro Woche mit Live-Fortschritt und Serien-Belohnungen.",
  "challenge.Sleep Anchor.title": "Schlafanker",
  "challenge.Sleep Anchor.description":
    "Baue eine stabile Abendroutine auf und verbessere deinen Wochenrhythmus.",
  "errors.generic": "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  "errors.network": "Verbindungsproblem. Prüfe dein Internet und versuche es erneut.",
  "errors.auth": "Anmeldung nicht möglich. Prüfe das Formular und versuche es erneut.",
  "errors.authInvalid": "Email oder Passwort ist falsch.",
  "errors.emailExists": "Diese Email ist bereits registriert. Versuche dich anzumelden.",
  "errors.dashboard": "Dashboard konnte nicht geladen werden. Bitte aktualisiere die Seite.",
  "errors.createHabit": "Gewohnheit konnte nicht erstellt werden. Prüfe den Namen.",
  "errors.completeHabit":
    "Diese Gewohnheit konnte nicht abgeschlossen werden. Versuche es gleich erneut.",
  "errors.joinChallenge": "Beitritt zur Challenge fehlgeschlagen. Versuche es gleich erneut.",
  "errors.notFound": "Dieses Element wurde nicht gefunden. Aktualisiere die Seite.",
  "errors.server": "Der Dienst ist vorübergehend nicht verfügbar. Versuche es später erneut."
} satisfies Dictionary;

const fr = {
  "meta.title": "lifetracker | Habitudes et progrès en temps réel",
  "meta.description":
    "lifetracker aide à suivre les habitudes, rejoindre des défis live et comprendre le progrès personnel depuis un dashboard accessible.",
  "controls.label": "Préférences d’affichage",
  "controls.language": "Langue",
  "controls.theme": "Thème",
  "controls.theme.dark": "Sombre",
  "controls.theme.light": "Clair",
  "controls.theme.toDark": "Activer le thème sombre",
  "controls.theme.toLight": "Activer le thème clair",
  "auth.skip": "Aller au contenu principal",
  "auth.loadingDashboard": "Chargement du dashboard...",
  "auth.title": "Construis un progrès visible.",
  "auth.copy":
    "Suis tes habitudes, rejoins des défis live, débloque des réussites et regarde ton progrès se mettre à jour sur tous tes appareils.",
  "auth.preview.label": "Exemple de progrès quotidien",
  "auth.preview.today": "Aujourd’hui",
  "auth.preview.focus": "82 points de focus",
  "auth.preview.summary":
    "Aperçu d’un graphique avec sept barres quotidiennes, se terminant par une journée complète.",
  "auth.preview.streak": "Série de 7 jours débloquée",
  "auth.preview.live": "Feed de défi connecté",
  "auth.form.label": "Accès au compte lifetracker",
  "auth.mode.label": "Mode d’authentification",
  "auth.mode.login": "Connexion",
  "auth.mode.register": "Inscription",
  "auth.name": "Nom",
  "auth.email": "Email",
  "auth.password": "Mot de passe",
  "auth.error": "Échec de l’authentification",
  "auth.submit.loading": "Connexion...",
  "auth.submit.login": "Ouvrir le dashboard",
  "auth.submit.register": "Créer un compte",
  "auth.demo": "Compte démo : demo@lifetracker.dev / demo1234",
  "nav.label": "Navigation du dashboard",
  "nav.sections": "Sections du dashboard",
  "nav.today": "Aujourd’hui",
  "nav.challenges": "Défis",
  "nav.progress": "Progrès",
  "nav.liveFeed": "Feed live",
  "nav.logout": "Déconnexion",
  "dashboard.eyebrow": "Centre de progrès personnel",
  "dashboard.welcome": "Bon retour, {name}",
  "dashboard.online": "{count} en ligne",
  "dashboard.loading": "Chargement de ton progrès...",
  "dashboard.error": "Impossible de charger le dashboard.",
  "dashboard.realtimeError":
    "Les mises à jour live sont indisponibles pour le moment. Tes données enregistrées restent disponibles.",
  "stats.label": "Statistiques actuelles des habitudes",
  "stats.activeStreak": "Série active",
  "stats.completedToday": "Fait aujourd’hui",
  "stats.weeklyRate": "Rythme hebdo",
  "stats.focusScore": "Focus",
  "habit.defaultName": "Lire 20 minutes",
  "habit.createTitle": "Créer une habitude",
  "habit.name": "Nom de l’habitude",
  "habit.category": "Catégorie de l’habitude",
  "habit.color": "Couleur de l’habitude",
  "habit.colorChoice": "Utiliser {color} comme couleur",
  "habit.target": "Objectif par semaine : {count}",
  "habit.add": "Ajouter une habitude",
  "habit.meta": "{category} - objectif {target}/semaine",
  "habit.complete": "Terminer {name}",
  "habits.title": "Habitudes du jour",
  "habits.mood": "Humeur à la validation",
  "progress.title": "Rythme hebdomadaire",
  "progress.byDate": "Habitudes terminées par date : {summary}",
  "progress.byCategory": "Habitudes terminées par catégorie : {summary}",
  "challenges.title": "Défis live",
  "challenges.loading": "Chargement des défis...",
  "challenges.joined": "{count} inscrits",
  "challenges.join": "Rejoindre",
  "feed.title": "Feed en temps réel",
  "feed.empty": "Termine une habitude pour envoyer le premier événement.",
  "event.userRegistered": "{name} a rejoint lifetracker",
  "event.habitCreated": "{name} créée",
  "event.habitCompleted": "{habitName} a atteint la série {streak}",
  "event.streakUpdated": "Série actuelle : {streak}",
  "event.achievementUnlocked": "{title} débloqué",
  "event.challengeJoined": "{title} rejoint",
  "event.reminderScheduled": "Rappel programmé",
  "event.type.userRegistered": "utilisateur inscrit",
  "event.type.habitCreated": "habitude créée",
  "event.type.habitCompleted": "habitude terminée",
  "event.type.streakUpdated": "série mise à jour",
  "event.type.achievementUnlocked": "réussite débloquée",
  "event.type.challengeJoined": "défi rejoint",
  "event.type.reminderScheduled": "rappel programmé",
  "category.fitness": "fitness",
  "category.mind": "pleine conscience",
  "category.nutrition": "nutrition",
  "category.learning": "apprentissage",
  "category.sleep": "sommeil",
  "category.finance": "finances",
  "category.creative": "créatif",
  "mood.great": "excellent",
  "mood.good": "bien",
  "mood.neutral": "normal",
  "mood.tired": "fatigue",
  "mood.stressed": "stress",
  "challenge.7 Day Reset.title": "Reset 7 jours",
  "challenge.7 Day Reset.description":
    "Réalise une action consciente chaque jour et garde le feed live actif.",
  "challenge.Learning Sprint.title": "Sprint d’apprentissage",
  "challenge.Learning Sprint.description":
    "Quatre sessions de focus par semaine avec progrès live et récompenses.",
  "challenge.Sleep Anchor.title": "Ancre de sommeil",
  "challenge.Sleep Anchor.description":
    "Construis une routine du soir stable et améliore ton rythme hebdomadaire.",
  "errors.generic": "Une erreur est survenue. Réessaie.",
  "errors.network": "Problème de connexion. Vérifie internet et réessaie.",
  "errors.auth": "Connexion impossible. Vérifie le formulaire et réessaie.",
  "errors.authInvalid": "Email ou mot de passe incorrect.",
  "errors.emailExists": "Cet email est déjà inscrit. Essaie de te connecter.",
  "errors.dashboard": "Impossible de charger le dashboard. Actualise la page.",
  "errors.createHabit": "Impossible de créer l’habitude. Vérifie le nom et réessaie.",
  "errors.completeHabit": "Impossible de terminer cette habitude. Réessaie dans un instant.",
  "errors.joinChallenge": "Impossible de rejoindre ce défi. Réessaie dans un instant.",
  "errors.notFound": "Élément introuvable. Actualise la page et réessaie.",
  "errors.server": "Le service est temporairement indisponible. Réessaie bientôt."
} satisfies Dictionary;

const sr = {
  "meta.title": "lifetracker | Navike i napredak u realnom vremenu",
  "meta.description":
    "lifetracker pomaže da pratiš navike, učestvuješ u live izazovima i razumeš lični napredak iz pristupačnog dashboarda.",
  "controls.label": "Podešavanja prikaza",
  "controls.language": "Jezik",
  "controls.theme": "Tema",
  "controls.theme.dark": "Tamna",
  "controls.theme.light": "Svetla",
  "controls.theme.toDark": "Uključi tamnu temu",
  "controls.theme.toLight": "Uključi svetlu temu",
  "auth.skip": "Preskoči na glavni sadržaj",
  "auth.loadingDashboard": "Učitavamo dashboard...",
  "auth.title": "Gradi napredak koji se vidi.",
  "auth.copy":
    "Prati navike, učestvuj u live izazovima, otključavaj dostignuća i gledaj kako se napredak ažurira na svim uređajima.",
  "auth.preview.label": "Primer dnevnog napretka",
  "auth.preview.today": "Danas",
  "auth.preview.focus": "82 poena fokusa",
  "auth.preview.summary":
    "Pregled grafikona sa sedam dnevnih stubaca, završava se potpuno ispunjenim danom.",
  "auth.preview.streak": "Otključan niz od 7 dana",
  "auth.preview.live": "Live feed izazova povezan",
  "auth.form.label": "Pristup lifetracker nalogu",
  "auth.mode.label": "Režim prijave",
  "auth.mode.login": "Prijava",
  "auth.mode.register": "Registracija",
  "auth.name": "Ime",
  "auth.email": "Email",
  "auth.password": "Lozinka",
  "auth.error": "Prijava nije uspela",
  "auth.submit.loading": "Povezivanje...",
  "auth.submit.login": "Otvori dashboard",
  "auth.submit.register": "Kreiraj nalog",
  "auth.demo": "Demo nalog: demo@lifetracker.dev / demo1234",
  "nav.label": "Dashboard navigacija",
  "nav.sections": "Dashboard sekcije",
  "nav.today": "Danas",
  "nav.challenges": "Izazovi",
  "nav.progress": "Napredak",
  "nav.liveFeed": "Live feed",
  "nav.logout": "Odjava",
  "dashboard.eyebrow": "Centar ličnog napretka",
  "dashboard.welcome": "Dobrodošao nazad, {name}",
  "dashboard.online": "{count} online",
  "dashboard.loading": "Učitavamo tvoj napredak...",
  "dashboard.error": "Dashboard nije mogao da se učita.",
  "dashboard.realtimeError":
    "Live ažuriranja trenutno nisu dostupna. Sačuvani podaci i dalje rade.",
  "stats.label": "Trenutna statistika navika",
  "stats.activeStreak": "Aktivan niz",
  "stats.completedToday": "Danas završeno",
  "stats.weeklyRate": "Nedeljni ritam",
  "stats.focusScore": "Fokus",
  "habit.defaultName": "Čitaj 20 minuta",
  "habit.createTitle": "Kreiraj naviku",
  "habit.name": "Naziv navike",
  "habit.category": "Kategorija navike",
  "habit.color": "Boja navike",
  "habit.colorChoice": "Koristi {color} kao boju navike",
  "habit.target": "Cilj nedeljno: {count}",
  "habit.add": "Dodaj naviku",
  "habit.meta": "{category} - cilj {target}/nedeljno",
  "habit.complete": "Završi {name}",
  "habits.title": "Današnje navike",
  "habits.mood": "Raspoloženje pri završavanju",
  "progress.title": "Nedeljni ritam",
  "progress.byDate": "Završene navike po datumu: {summary}",
  "progress.byCategory": "Završene navike po kategoriji: {summary}",
  "challenges.title": "Live izazovi",
  "challenges.loading": "Učitavamo izazove...",
  "challenges.joined": "{count} učesnika",
  "challenges.join": "Pridruži se",
  "feed.title": "Feed u realnom vremenu",
  "feed.empty": "Završi naviku da pošalješ prvi događaj u feed.",
  "event.userRegistered": "{name} se pridružio lifetrackeru",
  "event.habitCreated": "{name} kreirana",
  "event.habitCompleted": "{habitName}: niz {streak}",
  "event.streakUpdated": "Niz je sada {streak}",
  "event.achievementUnlocked": "{title} otključano",
  "event.challengeJoined": "Pridružio si se: {title}",
  "event.reminderScheduled": "Podsetnik zakazan",
  "event.type.userRegistered": "korisnik registrovan",
  "event.type.habitCreated": "navika kreirana",
  "event.type.habitCompleted": "navika završena",
  "event.type.streakUpdated": "niz ažuriran",
  "event.type.achievementUnlocked": "dostignuće otključano",
  "event.type.challengeJoined": "izazov prihvaćen",
  "event.type.reminderScheduled": "podsetnik zakazan",
  "category.fitness": "fitnes",
  "category.mind": "svesnost",
  "category.nutrition": "ishrana",
  "category.learning": "učenje",
  "category.sleep": "san",
  "category.finance": "finansije",
  "category.creative": "kreativno",
  "mood.great": "odlično",
  "mood.good": "dobro",
  "mood.neutral": "normalno",
  "mood.tired": "umor",
  "mood.stressed": "stres",
  "challenge.7 Day Reset.title": "Restart od 7 dana",
  "challenge.7 Day Reset.description":
    "Uradi jednu svesnu akciju svaki dan i održi live feed aktivnim.",
  "challenge.Learning Sprint.title": "Sprint učenja",
  "challenge.Learning Sprint.description":
    "Četiri fokus sesije nedeljno sa live napretkom i nagradama za niz.",
  "challenge.Sleep Anchor.title": "Sidro sna",
  "challenge.Sleep Anchor.description":
    "Izgradi stabilnu večernju rutinu i poboljšaj nedeljni ritam.",
  "errors.generic": "Nešto nije uspelo. Pokušaj ponovo.",
  "errors.network": "Problem sa vezom. Proveri internet i pokušaj ponovo.",
  "errors.auth": "Ne možemo da te prijavimo. Proveri formu i pokušaj ponovo.",
  "errors.authInvalid": "Email ili lozinka nisu tačni.",
  "errors.emailExists": "Ovaj email je već registrovan. Pokušaj prijavu.",
  "errors.dashboard": "Ne možemo da učitamo dashboard. Osveži stranicu.",
  "errors.createHabit": "Ne možemo da kreiramo naviku. Proveri naziv i pokušaj ponovo.",
  "errors.completeHabit": "Ne možemo da završimo ovu naviku. Pokušaj malo kasnije.",
  "errors.joinChallenge": "Ne možemo da se pridružimo izazovu. Pokušaj malo kasnije.",
  "errors.notFound": "Ova stavka nije pronađena. Osveži stranicu i pokušaj ponovo.",
  "errors.server": "Servis trenutno nije dostupan. Pokušaj kasnije."
} satisfies Dictionary;

const dictionaries = { en, ru, es, de, fr, sr } satisfies Record<Language, Dictionary>;

export const languageOptions: ReadonlyArray<{
  label: string;
  locale: string;
  value: Language;
}> = [
  { label: "English", locale: "en-US", value: "en" },
  { label: "Русский", locale: "ru-RU", value: "ru" },
  { label: "Español", locale: "es-ES", value: "es" },
  { label: "Deutsch", locale: "de-DE", value: "de" },
  { label: "Français", locale: "fr-FR", value: "fr" },
  { label: "Srpski", locale: "sr-Latn-RS", value: "sr" }
];

const languageAliases: Record<string, Language> = {
  en: "en",
  ru: "ru",
  es: "es",
  de: "de",
  fr: "fr",
  sr: "sr",
  hr: "sr",
  bs: "sr"
};

export function translate(
  language: Language,
  key: TranslationKey,
  values: Record<string, string | number> = {}
) {
  return Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    dictionaries[language][key]
  );
}

export function isLanguage(value: string | null): value is Language {
  return (
    value === "en" ||
    value === "ru" ||
    value === "es" ||
    value === "de" ||
    value === "fr" ||
    value === "sr"
  );
}

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function resolveLanguage(value: string | null | undefined): Language | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace("_", "-");
  if (isLanguage(normalized)) {
    return normalized;
  }

  const primary = normalized.split("-")[0] ?? "";
  return languageAliases[primary] ?? null;
}

export function detectPreferredLanguage(values?: readonly string[]): Language {
  const candidates =
    values && values.length > 0
      ? values
      : typeof navigator !== "undefined"
        ? navigator.languages.length > 0
          ? navigator.languages
          : [navigator.language]
        : [];

  for (const candidate of candidates) {
    const language = resolveLanguage(candidate);
    if (language) {
      return language;
    }
  }

  return "en";
}

export function localeCode(language: Language): string {
  return languageOptions.find((option) => option.value === language)?.locale ?? "en-US";
}

export function categoryLabel(language: Language, category: string) {
  const key = `category.${category}` as TranslationKey;

  return key in dictionaries[language] ? translate(language, key) : category;
}

export function moodLabel(language: Language, mood: string) {
  const key = `mood.${mood}` as TranslationKey;

  return key in dictionaries[language] ? translate(language, key) : mood;
}

export function challengeCopy(language: Language, title: string, description: string) {
  const titleKey = `challenge.${title}.title` as TranslationKey;
  const descriptionKey = `challenge.${title}.description` as TranslationKey;

  return {
    title: titleKey in dictionaries[language] ? translate(language, titleKey) : title,
    description:
      descriptionKey in dictionaries[language] ? translate(language, descriptionKey) : description
  };
}

export function friendlyErrorMessage(
  language: Language,
  error: unknown,
  fallbackKey: ErrorTranslationKey = "errors.generic"
): string {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const normalized = message.toLowerCase();

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("load failed")
  ) {
    return translate(language, "errors.network");
  }
  if (normalized.includes("invalid email or password")) {
    return translate(language, "errors.authInvalid");
  }
  if (normalized.includes("email already registered")) {
    return translate(language, "errors.emailExists");
  }
  if (normalized.includes("not found")) {
    return translate(language, "errors.notFound");
  }
  if (normalized.includes("request failed with 5") || normalized.includes("service unavailable")) {
    return translate(language, "errors.server");
  }

  return translate(language, fallbackKey);
}
