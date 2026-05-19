import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Activity, Languages, Moon, Radio, Sun, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Badge, Brand, Button, Card, Field, SegmentedControl, TextInput } from "@lifetracker/ui";

import type { AuthState } from "./auth";
import { login, register } from "./api";
import {
  detectPreferredLanguage,
  friendlyErrorMessage,
  isLanguage,
  isThemeMode,
  languageOptions,
  resolveLanguage,
  translate,
  type Language,
  type ThemeMode
} from "./i18n";

const Dashboard = lazy(() =>
  import("./Dashboard").then((module) => ({ default: module.Dashboard }))
);

export function App() {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem("lifetracker.auth");
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      localStorage.removeItem("lifetracker.auth");
      return null;
    }
  });
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const t = useMemo(() => translateFor(language), [language]);
  const preferences = (
    <PreferenceControls
      language={language}
      theme={theme}
      onLanguageChange={setLanguage}
      onThemeChange={setTheme}
    />
  );

  useEffect(() => {
    localStorage.setItem("lifetracker.language", language);
    localStorage.setItem("lifetracker.theme", theme);

    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    document.title = t("meta.title");

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("meta.description"));
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#081113" : "#102027");
  }, [language, theme, t]);

  function saveAuth(next: AuthState) {
    localStorage.setItem("lifetracker.auth", JSON.stringify(next));
    setAuth(next);
  }

  function logout() {
    localStorage.removeItem("lifetracker.auth");
    setAuth(null);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("auth.skip")}
      </a>
      <main className="app-shell" id="main-content">
        {auth ? (
          <Suspense
            fallback={
              <div className="loading app-loading" role="status" aria-live="polite">
                {t("auth.loadingDashboard")}
              </div>
            }
          >
            <Dashboard
              auth={auth}
              language={language}
              onLogout={logout}
              preferences={preferences}
            />
          </Suspense>
        ) : (
          <div className="auth-screen">
            <div className="auth-toolbar">{preferences}</div>
            <AuthPanel language={language} onAuth={saveAuth} />
          </div>
        )}
      </main>
    </>
  );
}

function PreferenceControls({
  language,
  theme,
  onLanguageChange,
  onThemeChange
}: {
  language: Language;
  theme: ThemeMode;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: ThemeMode) => void;
}) {
  const t = translateFor(language);
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <div className="app-preferences" aria-label={t("controls.label")}>
      <label className="preference-field">
        <span className="preference-label">
          <Languages size={17} aria-hidden="true" />
          {t("controls.language")}
        </span>
        <select
          aria-label={t("controls.language")}
          className="preference-select"
          value={language}
          onChange={(event) => {
            if (isLanguage(event.target.value)) {
              onLanguageChange(event.target.value);
            }
          }}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <Button
        aria-label={t(theme === "dark" ? "controls.theme.toLight" : "controls.theme.toDark")}
        aria-pressed={theme === "dark"}
        className="theme-toggle"
        onClick={() => onThemeChange(nextTheme)}
        variant="ghost"
      >
        {theme === "dark" ? (
          <Sun size={17} aria-hidden="true" />
        ) : (
          <Moon size={17} aria-hidden="true" />
        )}
        <span>{t(nextTheme === "dark" ? "controls.theme.dark" : "controls.theme.light")}</span>
      </Button>
    </div>
  );
}

function AuthPanel({
  language,
  onAuth
}: {
  language: Language;
  onAuth: (auth: AuthState) => void;
}) {
  const t = translateFor(language);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("demo@lifetracker.dev");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<Error | string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      mode === "login"
        ? login({ email, password })
        : register({
            name,
            email,
            password,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }),
    onSuccess: (response) => onAuth(response),
    onError: (err) => setError(err instanceof Error ? err : t("auth.error"))
  });

  return (
    <section className="auth-layout" aria-labelledby="auth-title">
      <div className="auth-copy">
        <Brand
          className="brand-row"
          mark={<Activity size={24} aria-hidden="true" />}
          name="lifetracker"
        />
        <h1 id="auth-title">{t("auth.title")}</h1>
        <p>{t("auth.copy")}</p>
        <Card className="preview-panel" aria-label={t("auth.preview.label")}>
          <div className="preview-header">
            <span>{t("auth.preview.today")}</span>
            <strong>{t("auth.preview.focus")}</strong>
          </div>
          <div className="preview-bars" aria-hidden="true">
            {[48, 76, 58, 92, 68, 86, 100].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <p className="sr-only">{t("auth.preview.summary")}</p>
          <div className="preview-feed">
            <Badge tone="success" icon={<Zap size={16} aria-hidden="true" />}>
              {t("auth.preview.streak")}
            </Badge>
            <Badge tone="success" icon={<Radio size={16} aria-hidden="true" />}>
              {t("auth.preview.live")}
            </Badge>
          </div>
        </Card>
      </div>

      <form
        className="auth-card"
        aria-describedby={error ? "auth-error" : "auth-hint"}
        aria-label={t("auth.form.label")}
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          mutation.mutate();
        }}
      >
        <SegmentedControl
          ariaLabel={t("auth.mode.label")}
          className="segmented"
          options={[
            { label: t("auth.mode.login"), value: "login" },
            { label: t("auth.mode.register"), value: "register" }
          ]}
          value={mode}
          onChange={setMode}
        />
        {mode === "register" ? (
          <Field htmlFor="auth-name" label={t("auth.name")}>
            <TextInput
              id="auth-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              required
            />
          </Field>
        ) : null}
        <Field htmlFor="auth-email" label={t("auth.email")}>
          <TextInput
            id="auth-email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
        </Field>
        <Field htmlFor="auth-password" label={t("auth.password")}>
          <TextInput
            id="auth-password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={6}
            required
          />
        </Field>
        {error ? (
          <p className="error" id="auth-error" role="alert">
            {friendlyErrorMessage(language, error, "errors.auth")}
          </p>
        ) : null}
        <Button className="primary-action" disabled={mutation.isPending} type="submit">
          {mutation.isPending
            ? t("auth.submit.loading")
            : mode === "login"
              ? t("auth.submit.login")
              : t("auth.submit.register")}
        </Button>
        <p className="hint" id="auth-hint">
          {t("auth.demo")}
        </p>
      </form>
    </section>
  );
}

function getInitialLanguage(): Language {
  const stored = localStorage.getItem("lifetracker.language");
  return resolveLanguage(stored) ?? detectPreferredLanguage();
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem("lifetracker.theme");
  if (isThemeMode(stored)) {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function translateFor(language: Language) {
  return translate.bind(null, language);
}
