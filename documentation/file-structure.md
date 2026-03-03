# ResQ-Mobile — File structure and conventions

This doc describes where things live and how we organize the app.

---

## Root layout and routing (Expo Router)

- **`src/app/`** — Expo Router root (configured in `app.json` as `["expo-router", { "root": "src/app" }]`).
- **`src/app/_layout.tsx`** — Root layout: `SafeAreaProvider` (from `react-native-safe-area-context` only; we do not use React Native’s deprecated `SafeAreaView`), Stack navigator, font loading (`useMetropolisFonts`), splash hiding.
- **`src/app/index.tsx`** — Home screen (single route for now). Define screens **inline** here; do not re-export from other files to avoid Metro/Expo Router issues.

**Convention:** Add new routes as files under `src/app/` (e.g. `src/app/settings.tsx`). Use the `@/` path alias for imports.

---

## Path alias

- **`@/`** → **`src/`** (set in `tsconfig.json` and `metro.config.js`).
- Use `@/components/...`, `@/hooks/...`, `@/theme/...`, `@/lib/...` everywhere instead of relative paths into `src/`.

---

## UI and components

- **`src/components/ui/`** — Shared UI primitives:
  - `AppHeading.tsx`, `AppText.tsx` — Typography with theme colors and Metropolis.
  - **`src/components/ui/animated/`** — Reanimated-based wrappers: `AppAnimatedView`, `AppAnimatedText`, `AppAnimatedImage`, `AppAnimatedScrollView`, `AppAnimatedSafeAreaView` (and `index.ts` re-exports).
- Use these instead of raw `Text`/`View` when you want consistent styling and animations.

---

## Animations

- **`src/lib/animation.ts`** — Central place for animation helpers:
  - Re-exports `AppAnimated*` and Reanimated.
  - Raw presets: `FadeIn`, `FadeInUp`, `FadeInDown`, `ZoomIn`, etc.
- **`src/lib/brandAnimations.ts`** — **Brand constants** (subtle, consistent): `brandFadeIn`, `brandFadeInUp`, `brandFadeInDown`, `brandScaleIn`. Same duration (~520ms) and easing; use with `entering={brandFadeInUp.delay(80)}` on `AppAnimated*` components. Prefer these for UI so motion stays on-brand and not in-your-face.
- Do **not** use Moti (removed to fix duplicate React / invalid hook issues).

---

## Theme and fonts

- **`src/theme/fonts.ts`** — Metropolis font family constants.
- **`src/hooks/useMetropolisFonts.ts`** — Loads Metropolis fonts; used in `_layout.tsx`. Wait for this before hiding splash.
- **`tailwind.config.js`** + **`global.css`** — Theme colors (e.g. `primary`, `accent`, `surface-light`, `surface-dark`, `success`, `primaryDark`, `captionDark`) and dark variants. Use Tailwind classes like `text-primary`, `bg-surface-light`.

---

## Assets

- **`assets/`** (repo root) — Images and fonts:
  - **`assets/favicon.png`** — Favicon; shown on the home screen.
  - **`assets/icon.png`**, **`assets/splash-icon.png`** — App and splash icons.
  - **`assets/fonts/`** — Metropolis `.otf` files.
- From `src/app/` use relative require, e.g. `require('../../assets/favicon.png')`.

---

## Config files (reference)

- **`app.json`** — Expo config: scheme `resq-mobile`, Expo Router root `src/app`, splash, etc.
- **`metro.config.js`** — `@/` → `src/`, single React instance (avoids duplicate React).
- **`babel.config.js`** — NativeWind.
- **`tailwind.config.js`** — Content paths, theme (colors, font family).
- **`global.css`** — At repo root; Tailwind directives and any global styles.

---

## Summary

| Purpose            | Location / convention                                      |
|--------------------|------------------------------------------------------------|
| Routes / screens   | `src/app/*.tsx`, inline components, no re-exports          |
| Path alias         | `@/` → `src/`                                             |
| UI primitives      | `src/components/ui/` and `src/components/ui/animated/`    |
| Animations         | `src/lib/animation.ts`, Reanimated presets                 |
| Theme / fonts      | `src/theme/fonts.ts`, `src/hooks/useMetropolisFonts.ts`    |
| Assets             | `assets/` (favicon, icons, `assets/fonts/`)                |
