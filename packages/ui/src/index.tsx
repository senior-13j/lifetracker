import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode
} from "react";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export type Tone = "neutral" | "success" | "info" | "warning" | "danger";

export function Brand({
  name,
  mark,
  className
}: {
  name: string;
  mark?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("lt-brand", className)}>
      <span className="lt-brand-mark">{mark ?? name.slice(0, 2).toUpperCase()}</span>
      <span>{name}</span>
    </div>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("lt-card", className)} {...props} />;
}

export function Badge({
  tone = "neutral",
  icon,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <span className={cx("lt-badge", `lt-badge-${tone}`, className)} {...props}>
      {icon}
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cx("lt-button", `lt-button-${variant}`, `lt-button-${size}`, className)}
      type={type}
      {...props}
    />
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("lt-input", className)} {...props} />;
}

export function Field({
  label,
  hint,
  children,
  className,
  htmlFor,
  hintId
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  hintId?: string;
}) {
  return (
    <label className={cx("lt-field", className)} htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {hint ? <small id={hintId}>{hint}</small> : null}
    </label>
  );
}

export function SegmentedControl<TValue extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel
}: {
  options: ReadonlyArray<{ label: string; value: TValue }>;
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div aria-label={ariaLabel} className={cx("lt-segmented", className)} role="group">
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={cx("lt-segmented-option", option.value === value && "active")}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  className
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <article className={cx("lt-stat-card", className)}>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function Swatch({
  color,
  active = false,
  className,
  style,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  color: string;
  active?: boolean;
}) {
  return (
    <button
      aria-label={props["aria-label"] ?? color}
      aria-pressed={active}
      className={cx("lt-swatch", active && "active", className)}
      style={{ background: color, ...style }}
      type="button"
      {...props}
    />
  );
}
