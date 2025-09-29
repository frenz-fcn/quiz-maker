# Quiz Maker

A lightweight quiz creation and playing single-page application built with **Vite.js**, **React 19**, **TypeScript**, **TailwindCSS 4**, and **TanStack Query 5**.

![Screenshot](docs/screenshot.png)

---

## Requirements

- **Node.js v22.18.0+** (LTS recommended)
- **npm v10+** (or pnpm / yarn ‑ adjust commands accordingly)

---

## Quick Start

```bash
# 1 ▪ Clone & install
$ git clone https://github.com/your-org/quiz-maker.git
$ cd quiz-maker
$ npm install

# 2 ▪ Environment
$ cp .env.example .env            # create your local env‐file
# edit .env with values:
#   VITE_APP_BASE_URL=<https://api.example.com>
#   VITE_APP_TOKEN=<your-jwt-token>

# 3 ▪ Run dev-server with hot reload
$ npm run dev                     # http://localhost:5173
```

### Additional scripts

| command                | purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run build`        | Type-check & produce production bundle (./dist) |
| `npm run preview`      | Serve the build locally for smoke tests         |
| `npm run lint`         | ESLint code quality check                       |
| `npm run lint:fix`     | Auto-fix ESLint issues                          |
| `npm run format`       | Format using Prettier                           |
| `npm run format:check` | Verify formatting without writing               |

---

## Architecture Decisions & Trade-offs

### Why Vite + TypeScript

- TS support keeps type-safety without complex config.

### Why TanStack Query (React Query)

- Declarative server-state management (caching, retries, background sync).
- Clean separation between UI and data layer; removes manual `useEffect`/`useState` fetch logic.
- Development UX boosted by React Query Devtools.

### Why TailwindCSS

- Utility-first approach accelerates prototyping while enforcing design consistency.
- JIT compilation yields minimal CSS bundle.
- Easy theming via **@tailwindcss/container-queries** & **typography** plugins.

Trade-offs

- Pure-SPA (CSR) — simpler deployment (static hosting) but limited SEO vs SSR.
- Tailwind utilities in markup may feel verbose; design tokens mitigated via `class-variance-authority`.
- TanStack Query introduces extra bundle size (~7 KB gzip) but saves custom boilerplate.

---

## Anti-Cheat Implementation _(optional)_

Anti-cheat is provided by `useAntiCheatContext` (src/hooks).

- **Tab switch detection** – when the window loses focus (`blur`) and regains it (`focus`), a `switch` event is logged.
- **Paste detection** – calling `logPaste()` records `paste` events (integrated in answer inputs).
- Each event is stored with a timestamp in React state.
- Consumers can call `getSummary()` to retrieve the event array, e.g. to submit alongside quiz answers for server-side analysis.

> NOTE: Events live only in memory; sending them to the backend is left to the caller.

---

## Minimal Project Structure

```text
src/
  ├─ components/        # reusable UI atoms & molecules
  ├─ hooks/             # domain-specific hooks (queries, mutations, anti-cheat)
  ├─ pages/             # route-level screens (builder, play, result)
  ├─ providers/         # React context providers (Query, AntiCheat)
  ├─ App.tsx            # router & layout root
  └─ main.tsx           # entry point
```

---

## License

Released under the **MIT License**. See [LICENSE](LICENSE) for details.
