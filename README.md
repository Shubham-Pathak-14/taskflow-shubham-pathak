# TaskFlow

A minimal but complete task management system. Users can register, log in, create projects, add tasks, and assign them to team members.

Built as a frontend-only submission for the TaskFlow engineering take-home assignment.

---

## Stack

- React 18 + TypeScript
- Chakra UI v3
- React Router v6
- MSW (Mock Service Worker) — in-browser API mocking
- Axios
- Docker + Nginx (Especially to serve static files on /dist or /build from Docker to the client. Node
  would have handled it but I am comfortable with nginx.).

---

## Architecture Decisions

**MSW over json-server**

MSW runs as a service worker inside the browser — no separate process, no port to manage, no process to keep alive in Docker. It intercepts fetch/axios calls at the network level and responds with in-memory data. This means the mock API works identically in both `npm run dev` and the Docker production build without any additional configuration. However, the tradeoff is that data doesn't persist across page refreshes since it lives in memory. This is mitigated by backing mutations to localStorage, but in a real
implementation this would be a database.

**Context API over Zustand**

Auth is the only global state in this app; a token and a user object. That's a single slice with simple reads and writes. `AuthContext` + `useAuth()` is the correct tool for this. Adding Zustand would be over-engineering with no practical benefit, and introduces a dependency that needs justification on a follow-up call.

**No custom data-fetching hooks**

Each page owns its fetch state directly with `useState` + `useEffect`. With four pages each fetching one resource used in one place, a hooks abstraction layer adds files without adding value. The `api/` layer is the right abstraction boundary; it centralizes HTTP calls, auth header injection, and error normalization. Nothing above it needs to know how requests are made.

**Flat component structure**

Components are organized by feature (`tasks/`, `projects/`, `layout/`) rather than by atomic type (`atoms/`, `molecules/`, `organisms/`). For a project of this scope, feature grouping is faster to navigate and easier to reason about.

**Optimistic UI for task status changes**

Status changes update the UI immediately and revert on error. The previous state is captured before the mutation and restored if the API call fails. This is implemented directly in `ProjectDetailPage` where the state lives, keeping the logic close to where it's used.

---

## Running Locally

Requires: Docker

```bash
git clone https://github.com/Shubham-Pathak-14/taskflow-shubham-pathak
cd taskflow-shubham-pathak
cp .env.example .env
docker compose up --build
```

App available at **http://localhost:3000**

No manual steps required. MSW boots automatically inside the browser on first load — look for `[MSW] Mocking enabled.` in the browser console to confirm the mock API is running.

---

## Running Migrations

Not applicable — this is a frontend-only submission. There is no database. All data is seeded in-memory via `src/mocks/db.ts` and resets on page refresh.

---

## Test Credentials

Two users are seeded and available immediately without registering:

```
Email:    test@example.com
Password: password123
```

```
Email:    bob@example.com
Password: password123
```

A seeded project ("Website Redesign") with three tasks in different statuses is accessible after logging in with either account.

---

## API Reference

This submission is built against the mock API spec from Appendix A of the assignment. All endpoints are implemented as MSW handlers in `src/mocks/handlers/`.

**Auth**

| Method | Endpoint         | Description                                                |
| ------ | ---------------- | ---------------------------------------------------------- |
| POST   | `/auth/register` | Register with name, email, password — returns token + user |
| POST   | `/auth/login`    | Login — returns token + user                               |

**Projects**

| Method | Endpoint        | Description                                         |
| ------ | --------------- | --------------------------------------------------- |
| GET    | `/projects`     | List projects the current user owns or has tasks in |
| POST   | `/projects`     | Create a project                                    |
| GET    | `/projects/:id` | Get project with its tasks                          |
| PATCH  | `/projects/:id` | Update name/description (owner only)                |
| DELETE | `/projects/:id` | Delete project (owner only)                         |

**Tasks**

| Method | Endpoint              | Description                                                     |
| ------ | --------------------- | --------------------------------------------------------------- |
| GET    | `/projects/:id/tasks` | List tasks, supports `?status=` and `?assignee=` filters        |
| POST   | `/projects/:id/tasks` | Create a task                                                   |
| PATCH  | `/tasks/:id`          | Update title, description, status, priority, assignee, due date |
| DELETE | `/tasks/:id`          | Delete a task                                                   |

**Error shape**

```json
// 400
{ "error": "validation failed", "fields": { "name": "is required" } }

// 401
{ "error": "unauthorized" }

// 403
{ "error": "forbidden" }

// 404
{ "error": "not found" }
```

---

## What I'd Do With More Time

**End-to-end tests** — Playwright tests covering the core flows: register, login, create project, create task, change task status, and logout. The MSW handlers are already structured in a way that makes this straightforward to add.

**Drag and drop** — `@dnd-kit/core` for moving tasks between status columns. The three-column layout in `ProjectDetailPage` is already structured for this — it would be a matter of wrapping columns in droppables and task cards in draggables.

**Optimistic updates on all mutations** — Currently only task status changes are optimistic. Create, edit, and delete operations could also update the UI immediately and revert on failure.

**Persistent mock data** — Currently all data resets on page refresh since it lives in memory. Using `localStorage` as a backing store for the MSW handlers would make the mock feel closer to a real API during manual testing.

**Accessibility audit** — Tab navigation and screen reader testing across all forms, modals, and the task drawer. Chakra UI provides a good baseline but focus management on the drawer open/close needs explicit testing.

**Better error boundaries** — Currently errors are caught per-page with local state. A React `ErrorBoundary` component would catch unexpected runtime errors and show a graceful fallback instead of a blank screen.

---

## Project Structure

```
📦 src
├── 📁 api                  # Axios layer — handles all API communication
│   ├── 📄 client.ts        # Base axios instance (interceptors, auth token injection)
│   ├── 📄 auth.api.ts      # Auth-related API calls (login, register)
│   ├── 📄 projects.api.ts  # Project CRUD APIs
│   └── 📄 tasks.api.ts     # Task CRUD + filters APIs
│
├── 📁 contexts             # Global React state (minimal, scoped)
│   └── 📄 AuthContext.tsx  # Stores user + token, provides auth helpers
│
├── 📁 mocks                # MSW (Mock Service Worker) for API simulation
│   ├── 📁 handlers         # API route handlers (feature-wise separation)
│   │   ├── 📄 auth.handlers.ts     # Mock auth endpoints
│   │   ├── 📄 projects.handlers.ts # Mock project endpoints
│   │   └── 📄 tasks.handlers.ts    # Mock task endpoints
│   ├── 📄 browser.ts       # MSW worker setup (runs in browser)
│   ├── 📄 db.ts            # In-memory database (seed + mutations)
│   └── 📄 index.ts         # Combines all handlers
│
├── 📁 components           # Reusable UI components (feature-based grouping)
│   ├── 📁 layout           # App shell components
│   │   ├── 📄 Navbar.tsx          # Top navigation bar
│   │   └── 📄 ProtectedRoute.tsx  # Route guard for auth-protected pages
│   │
│   ├── 📁 projects         # Project-related UI
│   │   ├── 📄 ProjectCard.tsx       # Project display card
│   │   └── 📄 ProjectFormModal.tsx  # Create/Edit project modal
│   │
│   └── 📁 tasks            # Task-related UI
│       ├── 📄 TaskCard.tsx     # Individual task UI
│       ├── 📄 TaskDrawer.tsx   # Task detail/edit drawer
│       └── 📄 TaskFilters.tsx  # Filters (status, assignee, etc.)
│
├── 📁 pages                # Route-level pages (mapped to routes)
│   ├── 📄 LoginPage.tsx          # User login page
│   ├── 📄 RegisterPage.tsx       # User registration page
│   ├── 📄 ProjectsPage.tsx       # Projects listing/dashboard
│   └── 📄 ProjectDetailPage.tsx  # Single project view + tasks
│
├── 📁 theme                # 🎨 Design system / theming engine (Chakra-based)
│   ├── 📄 index.ts         # Theme entry (createSystem + config)
│   └── 📄 tokens.ts        # Design tokens (colors, spacing, typography, semantic tokens)
│
└── 📁 types                # Centralized TypeScript types
    └── 📄 index.ts         # Shared interfaces (User, Project, Task, etc.)
```
