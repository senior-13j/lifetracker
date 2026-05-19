import {
  Activity,
  CalendarCheck,
  Check,
  Flame,
  Languages,
  Moon,
  Radio,
  Sparkles,
  Sun,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Badge,
  Brand,
  Button,
  Card,
  Field,
  SegmentedControl,
  StatCard,
  Swatch,
  TextInput
} from "@lifetracker/ui";

const colors = ["#12b886", "#3b82f6", "#f97316", "#e11d48", "#8b5cf6", "#14b8a6"];
const languageOptions = [
  { label: "English", locale: "en-US", value: "en" },
  { label: "Русский", locale: "ru-RU", value: "ru" },
  { label: "Español", locale: "es-ES", value: "es" },
  { label: "Deutsch", locale: "de-DE", value: "de" },
  { label: "Français", locale: "fr-FR", value: "fr" },
  { label: "Srpski", locale: "sr-Latn-RS", value: "sr" }
] as const;

type Language = (typeof languageOptions)[number]["value"];
type ThemeMode = "light" | "dark";

const copy = {
  en: {
    titleMeta: "lifetracker UI Kit | React component showcase",
    reactOnly: "React only",
    controls: "Display preferences",
    language: "Language",
    themeDark: "Dark",
    themeLight: "Light",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    eyebrow: "Design system workspace",
    title: "Reusable React components for the lifetracker product surface.",
    primary: "Primary action",
    secondary: "Secondary",
    ghost: "Ghost",
    examples: "UI Kit component examples",
    stats: "Statistic card examples",
    activeStreak: "Active streak",
    completedToday: "Completed today",
    focusScore: "Focus score",
    formControls: "Form controls",
    authMode: "Authentication mode example",
    login: "Login",
    register: "Register",
    email: "Email",
    emailHint: "Uses the shared UI input shape.",
    password: "Password",
    openDashboard: "Open dashboard",
    statusColor: "Status and color",
    neutral: "Neutral",
    success: "Success",
    info: "Info",
    warning: "Warning",
    danger: "Danger",
    selectColor: "Select {color}",
    selectedToken: "Selected token:"
  },
  ru: {
    titleMeta: "lifetracker UI Kit | Витрина React-компонентов",
    reactOnly: "Только React",
    controls: "Настройки отображения",
    language: "Язык",
    themeDark: "Тёмная",
    themeLight: "Светлая",
    themeToDark: "Включить тёмную тему",
    themeToLight: "Включить светлую тему",
    eyebrow: "Рабочая область дизайн-системы",
    title: "Переиспользуемые React-компоненты для интерфейса lifetracker.",
    primary: "Основное действие",
    secondary: "Вторичное",
    ghost: "Прозрачное",
    examples: "Примеры компонентов UI Kit",
    stats: "Примеры статистических карточек",
    activeStreak: "Активная серия",
    completedToday: "Выполнено сегодня",
    focusScore: "Фокус",
    formControls: "Контролы формы",
    authMode: "Пример режима авторизации",
    login: "Вход",
    register: "Регистрация",
    email: "Email",
    emailHint: "Использует общий UI input.",
    password: "Пароль",
    openDashboard: "Открыть dashboard",
    statusColor: "Статусы и цвет",
    neutral: "Нейтрально",
    success: "Успех",
    info: "Инфо",
    warning: "Внимание",
    danger: "Ошибка",
    selectColor: "Выбрать {color}",
    selectedToken: "Выбранный токен:"
  },
  es: {
    titleMeta: "lifetracker UI Kit | Showcase de componentes React",
    reactOnly: "Solo React",
    controls: "Preferencias de visualización",
    language: "Idioma",
    themeDark: "Oscuro",
    themeLight: "Claro",
    themeToDark: "Activar tema oscuro",
    themeToLight: "Activar tema claro",
    eyebrow: "Espacio del sistema de diseño",
    title: "Componentes React reutilizables para la superficie de lifetracker.",
    primary: "Acción principal",
    secondary: "Secundaria",
    ghost: "Ligera",
    examples: "Ejemplos de UI Kit",
    stats: "Ejemplos de tarjetas",
    activeStreak: "Racha activa",
    completedToday: "Completado hoy",
    focusScore: "Foco",
    formControls: "Controles de formulario",
    authMode: "Ejemplo de modo de acceso",
    login: "Entrar",
    register: "Registro",
    email: "Email",
    emailHint: "Usa el input compartido del UI.",
    password: "Contraseña",
    openDashboard: "Abrir dashboard",
    statusColor: "Estado y color",
    neutral: "Neutral",
    success: "Éxito",
    info: "Info",
    warning: "Aviso",
    danger: "Error",
    selectColor: "Elegir {color}",
    selectedToken: "Token elegido:"
  },
  de: {
    titleMeta: "lifetracker UI Kit | React-Komponenten-Showcase",
    reactOnly: "Nur React",
    controls: "Anzeigeeinstellungen",
    language: "Sprache",
    themeDark: "Dunkel",
    themeLight: "Hell",
    themeToDark: "Dunkles Design aktivieren",
    themeToLight: "Helles Design aktivieren",
    eyebrow: "Designsystem-Arbeitsbereich",
    title: "Wiederverwendbare React-Komponenten für lifetracker.",
    primary: "Primäre Aktion",
    secondary: "Sekundär",
    ghost: "Dezent",
    examples: "UI-Kit-Beispiele",
    stats: "Statistik-Karten",
    activeStreak: "Aktive Serie",
    completedToday: "Heute erledigt",
    focusScore: "Fokus",
    formControls: "Formularfelder",
    authMode: "Beispiel für Anmeldemodus",
    login: "Login",
    register: "Registrieren",
    email: "Email",
    emailHint: "Nutzt die gemeinsame UI-Input-Form.",
    password: "Passwort",
    openDashboard: "Dashboard öffnen",
    statusColor: "Status und Farbe",
    neutral: "Neutral",
    success: "Erfolg",
    info: "Info",
    warning: "Warnung",
    danger: "Fehler",
    selectColor: "{color} wählen",
    selectedToken: "Gewählter Token:"
  },
  fr: {
    titleMeta: "lifetracker UI Kit | Showcase de composants React",
    reactOnly: "React seulement",
    controls: "Préférences d’affichage",
    language: "Langue",
    themeDark: "Sombre",
    themeLight: "Clair",
    themeToDark: "Activer le thème sombre",
    themeToLight: "Activer le thème clair",
    eyebrow: "Espace du design system",
    title: "Composants React réutilisables pour l’interface lifetracker.",
    primary: "Action principale",
    secondary: "Secondaire",
    ghost: "Discret",
    examples: "Exemples UI Kit",
    stats: "Exemples de statistiques",
    activeStreak: "Série active",
    completedToday: "Fait aujourd’hui",
    focusScore: "Focus",
    formControls: "Contrôles de formulaire",
    authMode: "Exemple de mode d’accès",
    login: "Connexion",
    register: "Inscription",
    email: "Email",
    emailHint: "Utilise la forme d’input partagée.",
    password: "Mot de passe",
    openDashboard: "Ouvrir le dashboard",
    statusColor: "Statut et couleur",
    neutral: "Neutre",
    success: "Succès",
    info: "Info",
    warning: "Attention",
    danger: "Erreur",
    selectColor: "Choisir {color}",
    selectedToken: "Token choisi :"
  },
  sr: {
    titleMeta: "lifetracker UI Kit | Prikaz React komponenti",
    reactOnly: "Samo React",
    controls: "Podešavanja prikaza",
    language: "Jezik",
    themeDark: "Tamna",
    themeLight: "Svetla",
    themeToDark: "Uključi tamnu temu",
    themeToLight: "Uključi svetlu temu",
    eyebrow: "Radni prostor dizajn sistema",
    title: "Ponovo upotrebljive React komponente za lifetracker interfejs.",
    primary: "Glavna akcija",
    secondary: "Sekundarna",
    ghost: "Diskretna",
    examples: "Primeri UI Kita",
    stats: "Primeri statističkih kartica",
    activeStreak: "Aktivan niz",
    completedToday: "Danas završeno",
    focusScore: "Fokus",
    formControls: "Kontrole forme",
    authMode: "Primer režima prijave",
    login: "Prijava",
    register: "Registracija",
    email: "Email",
    emailHint: "Koristi zajednički UI input.",
    password: "Lozinka",
    openDashboard: "Otvori dashboard",
    statusColor: "Status i boja",
    neutral: "Neutralno",
    success: "Uspeh",
    info: "Info",
    warning: "Upozorenje",
    danger: "Greška",
    selectColor: "Izaberi {color}",
    selectedToken: "Izabrani token:"
  }
} satisfies Record<Language, Record<string, string>>;

type CopyKey = keyof (typeof copy)["en"];

export function Showcase() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [color, setColor] = useState(colors[0] ?? "#12b886");
  const [language, setLanguage] = useState<Language>(() =>
    getStoredLanguage(localStorage.getItem("lifetracker.showcase.language"))
  );
  const [theme, setTheme] = useState<ThemeMode>(() =>
    getStoredTheme(localStorage.getItem("lifetracker.showcase.theme"))
  );
  const t = (key: CopyKey, values: Record<string, string | number> = {}) =>
    Object.entries(values).reduce(
      (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
      copy[language][key]
    );
  const nextTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    localStorage.setItem("lifetracker.showcase.language", language);
    localStorage.setItem("lifetracker.showcase.theme", theme);
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    document.title = t("titleMeta");
  }, [language, theme]);

  return (
    <main className="showcase-shell">
      <header className="showcase-header">
        <Brand name="lifetracker UI Kit" mark={<Activity size={22} aria-hidden="true" />} />
        <div className="showcase-header-actions">
          <Badge tone="success" icon={<Radio size={15} aria-hidden="true" />}>
            {t("reactOnly")}
          </Badge>
          <div className="showcase-controls" aria-label={t("controls")}>
            <label className="preference-field">
              <span className="preference-label">
                <Languages size={17} aria-hidden="true" />
                {t("language")}
              </span>
              <select
                aria-label={t("language")}
                className="preference-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              aria-label={theme === "dark" ? t("themeToLight") : t("themeToDark")}
              aria-pressed={theme === "dark"}
              className="theme-toggle"
              onClick={() => setTheme(nextTheme)}
              variant="ghost"
            >
              {theme === "dark" ? (
                <Sun size={17} aria-hidden="true" />
              ) : (
                <Moon size={17} aria-hidden="true" />
              )}
              <span>{nextTheme === "dark" ? t("themeDark") : t("themeLight")}</span>
            </Button>
          </div>
        </div>
      </header>

      <section className="showcase-hero" aria-labelledby="showcase-title">
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 id="showcase-title">{t("title")}</h1>
        </div>
        <div className="showcase-actions">
          <Button>{t("primary")}</Button>
          <Button variant="secondary">{t("secondary")}</Button>
          <Button variant="ghost">{t("ghost")}</Button>
        </div>
      </section>

      <section className="showcase-grid" aria-label={t("examples")}>
        <div className="showcase-stats" aria-label={t("stats")} role="group">
          <StatCard
            icon={<Flame size={20} aria-hidden="true" />}
            label={t("activeStreak")}
            value="14d"
          />
          <StatCard
            icon={<Check size={20} aria-hidden="true" />}
            label={t("completedToday")}
            value="6"
          />
          <StatCard
            icon={<Sparkles size={20} aria-hidden="true" />}
            label={t("focusScore")}
            value="88"
          />
        </div>

        <Card className="showcase-panel" aria-labelledby="form-controls-title">
          <div className="panel-heading">
            <h2 id="form-controls-title">{t("formControls")}</h2>
            <CalendarCheck size={18} aria-hidden="true" />
          </div>
          <SegmentedControl
            ariaLabel={t("authMode")}
            options={[
              { label: t("login"), value: "login" },
              { label: t("register"), value: "register" }
            ]}
            value={mode}
            onChange={setMode}
          />
          <Field htmlFor="showcase-email" label={t("email")} hint={t("emailHint")}>
            <TextInput
              id="showcase-email"
              autoComplete="email"
              defaultValue="demo@lifetracker.dev"
              type="email"
            />
          </Field>
          <Field htmlFor="showcase-password" label={t("password")}>
            <TextInput
              id="showcase-password"
              autoComplete="current-password"
              defaultValue="demo1234"
              type="password"
            />
          </Field>
          <Button>{t("openDashboard")}</Button>
        </Card>

        <Card className="showcase-panel" aria-labelledby="status-color-title">
          <div className="panel-heading">
            <h2 id="status-color-title">{t("statusColor")}</h2>
            <Zap size={18} aria-hidden="true" />
          </div>
          <div className="badge-row">
            <Badge tone="neutral">{t("neutral")}</Badge>
            <Badge tone="success">{t("success")}</Badge>
            <Badge tone="info">{t("info")}</Badge>
            <Badge tone="warning">{t("warning")}</Badge>
            <Badge tone="danger">{t("danger")}</Badge>
          </div>
          <div className="swatch-row">
            {colors.map((option) => (
              <Swatch
                active={option === color}
                aria-label={t("selectColor", { color: option })}
                color={option}
                key={option}
                onClick={() => setColor(option)}
              />
            ))}
          </div>
          <div className="selected-color" style={{ borderColor: color }}>
            {t("selectedToken")} <strong>{color}</strong>
          </div>
        </Card>
      </section>
    </main>
  );
}

function getStoredLanguage(value: string | null): Language {
  const resolved = resolveLanguage(value);
  if (resolved) {
    return resolved;
  }

  const candidates = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    const language = resolveLanguage(candidate);
    if (language) {
      return language;
    }
  }

  return "en";
}

function getStoredTheme(value: string | null): ThemeMode {
  if (value === "light" || value === "dark") {
    return value;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveLanguage(value: string | null | undefined): Language | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace("_", "-");
  const primary = normalized.split("-")[0] ?? "";

  if (isLanguage(normalized)) {
    return normalized;
  }
  if (primary === "hr" || primary === "bs") {
    return "sr";
  }

  return isLanguage(primary) ? primary : null;
}

function isLanguage(value: string): value is Language {
  return ["en", "ru", "es", "de", "fr", "sr"].includes(value);
}
