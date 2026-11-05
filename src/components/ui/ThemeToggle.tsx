import { useTheme } from "../../hooks/useTheme";

type ThemeToggleProps = {
  showLabel?: boolean;
};

function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const label = "Dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-5">
        {theme === "dark"
          ? <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          : <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />}
      </svg>
      <span className={showLabel ? "" : "sr-only"}>{label}</span>
    </button>
  );
}

export default ThemeToggle;
