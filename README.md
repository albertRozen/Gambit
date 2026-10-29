# Gambit: cloud resource applications

Browse cloud resources, group a selection into a named **Application**, and see
each application as a graph of its resources. No backend: all state lives in
the browser.

## How to run it

```bash
npm install && npm run dev
```

Open http://localhost:5173. Needs Node 20.19+ or 22.12+ (required by Vite 8).
Other scripts: `build`, `preview`, `lint`, `format:check`.

## What I built

**Resources page**

- Table of 12 resources (name, type, provider, environment, criticality, open
  issues), sorted most critical first. It shows 8 rows and scrolls inside.
- Name search plus multi-select filters for provider, environment and
  criticality. The header shows how many match ("8 of 12").
- Filters live in the URL (`/resources?q=pay&provider=AWS,GCP&criticality=critical`),
  so a refresh keeps them and filtered views can be shared. Unknown values are
  ignored, typing doesn't add browser-history entries, and switching pages
  starts with clean filters.
- Select rows by clicking them; select-all acts on the visible rows, and the
  selection survives filter changes. A selection bar shows the count and opens
  **Create application**: a name (required, unique ignoring case and extra
  spaces), an optional description, and the resources to include. Remove one
  with ✕, or add more with a searchable combobox (type to filter, ↑/↓ and
  Enter to add). Saving opens the new application.

**Applications page**

- A searchable list of applications (12 visible, then scrolls). Each row shows
  its most severe criticality and has a kebab menu, on hover or keyboard focus,
  with **Edit** and **Delete**. Edit reuses the create dialog; Delete asks for
  confirmation, and deleting the open application returns to `/applications`.
- A detail panel for the selected application: name, description, summary
  badges, and an **SVG graph**: the application in the centre, connected to
  its resources, each coloured by criticality and showing its open issues.

**Also**

- Applications are saved to `localStorage`. Saved data is checked on load, and
  ids of resources that no longer exist are dropped.
- Routing with React Router: `/resources`, `/applications` and
  `/applications/:applicationId`. A refresh keeps the page and the selected
  application, links can be shared, back/forward work, and an unknown
  application id falls back to the first one. Unknown paths redirect to
  `/resources`.
- Responsive: the table and list keep 8 and 12 rows when there's room and
  shrink on shorter windows; filters wrap; below 760px the layout stacks and
  the page scrolls.

**Key decisions**

- **State:** applications in a context with `useState`, since the header, both
  pages and the dialogs use them. Resources are a static import, since they
  never change. Filters are kept in the URL's search params; the selection
  is local to the page. Anything derivable is calculated during render, not
  stored.
- **Data:** applications store resource ids, not copies. The spec's sample has
  `openIssues` but its interface doesn't, so I added it.
- **Dataset:** every provider, environment and criticality appears; the
  `payments` team spans AWS and GCP; similar names test search; and there's a
  very long name plus several resources with 0 issues.
- **Structure:** `models/` (types), `data/` (seed data), `state/`, `ui/`
  (generic building blocks), `components/` (app-specific shared pieces), and
  `pages/<page>/` with its own `components/` folder.
- **Routing:** React Router (`BrowserRouter`, `NavLink` tabs, `useParams`,
  `useSearchParams`). It replaced an earlier hand-written query-param hook, so
  the code relies on a standard library instead of custom history handling.
  Each page is loaded with `lazy()` as its own chunk, so the graph code loads
  only when the Applications page opens.
- **UI:** styled-components with theme tokens taken from gambit.security's
  palette. Actions use the brand plum, because red is reserved for
  criticality. Units are `rem` with 1rem = 4px (`html { font-size: 25% }`).
  Dialogs use the native `<dialog>` with `closedby="any"`, so the browser
  handles Escape and backdrop clicks. Shared building blocks live in `ui/`:
  `Dialog`, `Menu` (kebab), `MultiSelect`, `Combobox`, `Panel` and more. The
  React Compiler is on, so there's no manual `useMemo` or `useCallback`, and
  ESLint enforces braces on every `if` (`curly`).

## What I'd do next

- **Tests:** Vitest for the pure functions (`filterResources`, `radialLayout`,
  `summarizeApplication`, `applicationsStorage`), then one Testing Library test
  of the create-application flow.
- **End-to-end tests:** one Playwright test covering create → deep link →
  edit → delete, on top of the Vitest unit tests.
- **Accessibility:** add accessible names for screen readers to icon-only
  buttons, checkboxes and search fields, and return focus to the button that
  opened a dialog once it closes.
- **Scale:** clickable column sorting, pagination for the table once the data
  grows to around 1,000 rows, and a zoomable or grouped graph for large
  applications.

## Where I used AI

I led the product and architecture decisions and paired with Claude Code to
implement them faster, reviewing every change before keeping it. I asked it to
propose only the graph and the styling details, and refined what it suggested.
My decisions:

- **Stack:** TypeScript, styled-components, ESLint and Prettier on the latest
  React.
- **Types:** the spec's literal union types as written, rather than types
  derived from arrays.
- **State:** a context to show how shared state is managed, with `useState`,
  and the React Compiler instead of manual memoization.
- **Persistence:** applications saved to `localStorage` so they survive a
  refresh.
- **Code style:** named exports and arrow functions everywhere, braces on
  every `if`, no code comments, and `rem` units with 1rem = 4px.
- **Structure:** `models/` and `data/`, `pages/`, `ui/` at the top level, and a `components/` folder inside
  each page.
- **Layout:** a fixed-height table showing 8 rows and a list showing 12, and a
  list-and-detail Applications page instead of a card grid that wouldn't
  scale.
- **Interactions:** a kebab menu on hover as the only place for Edit and
  Delete, and adding or removing resources in the dialog, with search when
  adding.
- **Navigation:** React Router, with the selected application in the path
  and the resource filters in search params, so a refresh keeps them, links
  can be shared, and switching pages starts clean.
- **Responsive:** content resizes with the window.
