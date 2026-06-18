# 🧮 Gumbel Math

A small, modular math practice web app built with **React**, **Vite**, and
**TypeScript**.

Gumbel Math is designed as a simple place to practice mathematical speed,
accuracy, and problem solving. It starts with **Arithmetic Practice** and
**Sequence Practice**, with a structure that makes it straightforward to add more
games later.

---

## ✨ Features

| Area | What it does |
| --- | --- |
| 🏠 Home page | Introduces the project with a clean, classic layout |
| 🎮 Games page | Lists available practice modules from the module registry |
| ➕ Arithmetic Practice | Timed drills for addition, subtraction, multiplication, and division |
| 🔢 Sequence Practice | Find the missing sixth number from five visible sequence terms |
| ⚙️ Settings screen | Configure duration, operators, and number range before starting |
| ⌨️ Auto-submit | Correct answers advance immediately when typed exactly |
| 📊 Results | Shows score, attempts, correct answers, and accuracy |
| 💾 Storage abstraction | Settings are persisted through a small adapter interface |

---

## 🧱 Tech Stack

| Tool | Purpose |
| --- | --- |
| React | UI components |
| Vite | Development server and build tooling |
| TypeScript | Strict typing across app, module, and core logic |
| Vitest | Unit tests |
| Plain CSS | Simple classic styling without a heavy styling framework |

No backend, database, Redux, Tailwind, Prisma, Supabase, Firebase, or similar
infrastructure is included.

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

> Note: Vite may warn if your Node.js version is below its recommended version.
> Use Node `20.19+` or `22.12+` for best compatibility.

---

## 🗂️ Project Structure

```text
src/
  app/
    App.tsx
    App.css

  core/
    engine/
      ProblemModule.ts
      PracticeResult.ts
      PracticeSession.ts
      Scoring.ts
      ValidationResult.ts
    storage/
      BrowserStorageAdapter.ts
      InMemoryStorageAdapter.ts
      StorageAdapter.ts

  features/
    arithmetic/
      ArithmeticSettingsPage.tsx
      ArithmeticSessionPage.tsx
    home/
      GameCard.tsx
      GamesPage.tsx
      HomePage.tsx
    practice/
      PracticeSessionView.tsx
      usePracticeSession.ts
    results/
      ResultsSummary.tsx

  modules/
    index.ts
    arithmetic/
      arithmeticModule.ts
      arithmeticSettings.ts
      arithmeticTypes.ts
      generateArithmeticPrompt.ts
      validateArithmeticAnswer.ts

  shared/
    components/
      Button.tsx
      Card.tsx
      NumberInput.tsx
    utils/
      random.ts
```

---

## 🧠 Architecture

The app separates **domain logic** from **React UI**.

| Layer | Responsibility |
| --- | --- |
| `core/engine` | Generic practice contracts and scoring primitives |
| `modules/` | Problem generation, validation, settings, and module metadata |
| `features/` | Screens and user flows |
| `shared/` | Small reusable UI and utility helpers |
| `core/storage` | Replaceable storage adapters |

The arithmetic module implements a generic `ProblemModule` interface:

```ts
type ProblemModule<TSettings, TSession, TPrompt> = {
  id: string;
  title: string;
  shortDescription: string;
  iconLabel: string;
  defaultSettings: TSettings;
  createSession: (settings: TSettings) => TSession;
  generatePrompt: (session: TSession) => TPrompt;
  validateAnswer: (prompt: TPrompt, rawAnswer: string) => ValidationResult;
  applyResult: (
    session: TSession,
    prompt: TPrompt,
    result: ValidationResult
  ) => TSession;
};
```

This keeps problem generation and validation outside React components.

---

## 🎮 Current Module

| Module | Description | Status |
| --- | --- | --- |
| Arithmetic Practice | Timed arithmetic drills with configurable operators and number ranges | ✅ Available |
| Sequence Practice | Timed sequence drills with easy, medium, and hard pattern sets | ✅ Available |

Planned module ideas:

- Fractions
- Equations
- Logic puzzles
- Challenge-style problem sets

---

## 🧩 Adding a New Game

To add another game module:

1. Create a new folder under `src/modules/`.
2. Define settings, session, prompt, generator, and validator files.
3. Implement the `ProblemModule` interface.
4. Register it in `src/modules/index.ts`.
5. Add a feature screen if the module needs custom setup or rendering.

The games page renders module metadata from the registry, so new games can be
listed without hardcoding cards into the page.

---

## 💾 Persistence

Settings are stored through this small interface:

```ts
type StorageAdapter = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};
```

`BrowserStorageAdapter` wraps `localStorage`, but the rest of the app depends on
the adapter interface. A future API-backed or database-backed implementation can
replace it without changing domain logic.

---

## 🧪 Testing

Current test coverage includes:

| Test area | Coverage |
| --- | --- |
| Arithmetic generator | Deterministic prompt generation and whole-number division |
| Arithmetic validator | Correct, incorrect, and invalid numeric answers |
| Sequence generator | Five visible values, sixth answer, and difficulty-specific patterns |
| Sequence validator | Correct, incorrect, and invalid numeric answers |
| Practice hook | Auto-submit only on exact correct answers |

Run tests with:

```bash
npm test
```

---

## 🎨 Design Direction

The UI intentionally uses a restrained, classic style:

- simple centered pages
- plain borders
- muted backgrounds
- small navigation bar
- no glossy dashboard styling
- no heavy component framework

The visual direction is inspired by classic problem-solving websites, while
keeping the implementation lightweight and easy to change.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite dev server |
| `npm test` | Run Vitest tests |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
