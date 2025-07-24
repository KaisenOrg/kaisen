import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/useThemeStore";
import type { Theme } from "@/stores/useThemeStore";

const themes = [
  {
    value: "dark",
    label: "Dark",
    img: "/dark-theme.png",
  },
  {
    value: "light",
    label: "Light",
    img: "/light-theme.png",
  },
  {
    value: "system",
    label: "System",
    img: "/system-theme.png",
    overlay: true,
  },
];

export function ThemeSwitch() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex flex-col sm:flex-row gap-2.5">
      {themes.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => setTheme(t.value as Theme)}
          aria-pressed={theme === t.value}
          className={cn(
            "group flex flex-col w-full sm:w-[228px] h-[140px] rounded-xl overflow-hidden border-2 transition-all focus:outline-none p-0",
            theme === t.value
              ? "border-orange-500 ring-2 ring-orange-500"
              : "border-muted hover:border-zinc-700"
          )}
        >
          <div className="relative w-full h-[98px] bg-muted">
            <img
              src={t.img}
              alt={t.label}
              className={cn(
                "object-cover w-full h-full",
                t.overlay && "opacity-60"
              )}
              draggable={false}
            />
          </div>
          <div className="flex items-center gap-2 w-full h-fit px-4 py-2.5 bg-background justify-start">
            <span className="w-4 h-4 flex items-center justify-center">
              <span
                className={cn(
                  "block w-3 h-3 rounded-full border-2",
                  theme === t.value
                    ? "border-orange-500 bg-orange-500"
                    : "border-muted-foreground bg-transparent"
                )}
              />
            </span>
            <span
              className={cn(
                "font-medium text-sm text-foreground",
                theme === t.value && "text-orange-500"
              )}
            >
              {t.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}