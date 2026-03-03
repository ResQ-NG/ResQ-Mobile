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

- **`cn()`** — **`@/lib/cn`** merges Tailwind classes with conflict resolution (`clsx` + `tailwind-merge`). Use when combining base styles with a `className` prop so overrides win: `cn('text-base', className)`.

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
- **`src/theme/constants.ts`** — Shared UI constants: **`DEFAULT_APP_TEXT_VARIANT`** (`'body'` — base is never caption), **`APP_TEXT_VARIANT_STYLES`**, **`PADDING_SIZE_CLASSES`** (`none` | `sm` | `md` | `lg`) for optional padding (e.g. **`AppAnimatedSafeAreaView`** `paddingSize` prop).
- **`src/hooks/useMetropolisFonts.ts`** — Loads Metropolis fonts; used in `_layout.tsx`. Wait for this before hiding splash.
- **`tailwind.config.js`** + **`global.css`** — Theme colors (e.g. `primary`, `accent`, `surface-light`, `surface-dark`, `success`, `primaryDark`, `captionDark`) and dark variants. Use Tailwind classes like `text-primary`, `bg-surface-light`.

---

## Icons (Monicon)

- **Install:** `@monicon/core`, `@monicon/metro`, `react-native-svg` (required for SVG icons).
- **`monicon.config.ts`** (project root) — Declares **`icons`** (e.g. `mdi:camera-outline`) and optionally **`collections`** (e.g. `['lucide']`). Plugins: **`clean`** (patterns to clear) and **`reactNative`** (outputPath, e.g. `src/components/icons`). Generated components land in **`src/components/icons/`** (e.g. `@/components/icons/mdi/camera-outline`).
- **Metro** — `metro.config.js` uses **`withMonicon(config)`** so icons are generated when the dev server starts. Run **`npm run generate:icons`** to generate once without starting the app.
- **Usage:** Import the default export and pass `color`, `width`, `height`: e.g. `<HomeIcon color="aqua" width={32} height={32} />`.

---

## Assets

- **`assets/`** (repo root) — Images and fonts:
  - **`assets/favicon.png`** — Favicon; shown on the home screen.
  - **`assets/icon.png`**, **`assets/splash-icon.png`** — App and splash icons.
  - **`assets/fonts/`** — Metropolis `.otf` files.
- Use the **`@assets/`** alias: `require('@assets/favicon.png')`, `require('@assets/fonts/...')`.

---

## Linting, formatting, and typed routes

- **ESLint** — Strong rules via `eslint.config.js` (extends `eslint-config-expo/flat` + `eslint-config-prettier/flat`): `@typescript-eslint/no-explicit-any`, `no-unused-vars`, `react-hooks/*`, `prefer-const`, `no-console` (warn). Run **`npm run lint`**.
- **Prettier** — Config in `.prettierrc` (semi, singleQuote, tabWidth 2, trailingComma es5, printWidth 80); `.prettierignore` excludes node_modules, .expo, dist, generated icons. Run **`npm run format`** to fix, **`npm run format:check`** to verify. ESLint is configured so it doesn’t conflict with Prettier.
- **Typed routes** — Enabled with `experiments.typedRoutes` in `app.json`. `router.push('/wrong')` or `<Link href="/typo" />` will **throw a TypeScript error** once route types are generated. Types are generated when you run **`npx expo start`** (or open the app); then run **`npm run typecheck`** to catch invalid routes without starting the server. Keep `expo-env.d.ts` and `.expo/` in `.gitignore`; CI should run `npx expo customize tsconfig.json` (or start the app once) so typecheck has the route types.

---

## Config files (reference)

- **`app.json`** — Expo config: scheme `resq-mobile`, Expo Router root `src/app`, splash, etc.
- **`metro.config.js`** — `@/` → `src/`, single React instance (avoids duplicate React).
- **`babel.config.js`** — NativeWind.
- **`tailwind.config.js`** — Content paths, theme (colors, font family).
- **`global.css`** — At repo root; Tailwind directives and any global styles.

---

## Summary

| Purpose          | Location / convention                                   |
| ---------------- | ------------------------------------------------------- |
| Routes / screens | `src/app/*.tsx`, inline components, no re-exports       |
| Path alias       | `@/` → `src/`                                           |
| UI primitives    | `src/components/ui/` and `src/components/ui/animated/`  |
| Animations       | `src/lib/animation.ts`, Reanimated presets              |
| Theme / fonts    | `src/theme/fonts.ts`, `src/hooks/useMetropolisFonts.ts` |
| Assets           | `assets/` (favicon, icons, `assets/fonts/`)             |
