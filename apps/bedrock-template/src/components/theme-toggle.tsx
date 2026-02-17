import { $, component$, isServer, useSignal, useTask$ } from "@builder.io/qwik";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "scry-theme";

export const ThemeToggle = component$(() => {
  const currentTheme = useSignal<ThemeMode>("dark");

  useTask$(() => {
    if (isServer) {
      return;
    }

    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      savedTheme = null;
    }

    const theme: ThemeMode = savedTheme === "light" ? "light" : "dark";
    currentTheme.value = theme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  });

  const toggleTheme = $(() => {
    const nextTheme: ThemeMode = currentTheme.value === "dark" ? "light" : "dark";
    currentTheme.value = nextTheme;

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;

    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore persistence failures for private browsing modes.
    }
  });

  return (
    <button
      aria-label="Toggle dark and light theme"
      class="btn btn-ghost h-9 px-3 text-xs sm:text-sm"
      onClick$={toggleTheme}
      type="button"
    >
      {currentTheme.value === "dark" ? "Dark" : "Light"}
    </button>
  );
});
