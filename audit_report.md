# 360° Architectural & Security Audit: The Wild Oasis

### PHASE 1 — PROJECT BLUEPRINT

#### 1.1 Tech Stack Fingerprint
| Layer | Technology | Version | Status |
|-------|------------|---------|--------|
| **Framework** | Next.js | 14.2.35 | Current (App Router) |
| **UI/View** | React | 18 | Current |
| **Styling** | Tailwind CSS | 3.4.1 | Current |
| **Auth** | NextAuth.js | 4.24.13 | Current |
| **Networking** | Axios | 1.13.5 | Current |
| **Utilities** | date-fns / react-day-picker | 4.1.0 / 9.14.0 | Current |

#### 1.2 Architecture Classification
- **Pattern:** **BFF (Backend-For-Frontend) / API Gateway pattern.** Next.js is acting as the presentation layer and BFF, handling authentication (via NextAuth) and routing requests to an underlying Django REST/Python backend (`http://127.0.0.1:8000`).
- **Consistency:** Mixed. You are utilizing Next.js Server Actions (`app/_lib/action.ts`) for mutations, but data fetching (`app/_lib/data-service.ts`) relies heavily on `axios` instead of native `fetch`. This breaks Next.js caching and revalidation paradigms in several places.
- **Data Flow:** `Client Component → Server Action → Axios (axiosPrivate) → Django API → DB`

#### 1.3 Logic Anchors (Top 5 Critical Files)
| # | File | Why It's Critical | Risk Level |
|---|------|------------------|------------|
| 1 | `app/_lib/data-service.ts` | The central nervous system for all data fetching. Bypasses Next.js caching mechanisms in favor of raw Axios calls. | 🔴 High |
| 2 | `app/_lib/axiosClient.js` | Configures the HTTP clients talking to your backend. Lacks interceptors to attach auth tokens. | 🔴 High |
| 3 | `app/api/auth/[...nextauth]/route.js` | Handles session creation and JWT strategy. Syncs NextAuth users with Django `getGuest`/`createGuest`. | 🟡 Med |
| 4 | `app/_lib/action.ts` | Next.js Server Actions handling sensitive mutations (profile updates, booking). Form validation is manual and prone to bypasses. | 🟡 Med |
| 5 | `app/_lib/helpers.ts` | Contains hardcoded API URLs (`http://127.0.0.1:8000/`) and manual validation logic instead of a schema library like Zod. | 🔴 High |

---

### PHASE 2 — SECURITY AUDIT (Highest Priority)

#### Authentication & Authorization
- ✅ **Secrets in ENV:** `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are read from environment variables.
- ❌ **Token Propagation to Backend:** `axiosPrivate` is set to `withCredentials: true`, but NextAuth JWTs are **not** being explicitly passed to the Django backend via `Authorization: Bearer <token>` headers. Unless Django is specifically configured to read the `next-auth.session-token` cookie directly (which is an anti-pattern across different domains), your backend API calls are likely unauthenticated or relying on a flawed session mechanism.
- ❌ **RBAC & Authorization:** Server actions (like `handleBookingUpdateFormAction`) do not verify if the `bookingId` belongs to the currently authenticated user before sending the patch request. This is a severe IDOR (Insecure Direct Object Reference) vulnerability.
- ⚠️ **Missing Middleware:** There is no `middleware.ts` protecting the `/account` routes at the edge. Protection is likely done manually inside the Server Components (`getServerSession`), which is error-prone.

#### Data & Input Security
- ❌ **Input Validation:** Form validation in `validateBookingForm` (`helpers.ts`) is manually parsing `FormData`. It lacks strict type coercion, XSS sanitization, and deep validation. You need to use a library like `zod`.
- ⚠️ **Type Safety:** The `UpdateBookingData` type in `data-service.ts` allows any data to pass through. TypeScript types do not validate runtime data.

#### Transport & Infrastructure
- ❌ **Hardcoded Base URL:** `export const BASE_URL = "http://127.0.0.1:8000/";` is hardcoded in `helpers.ts`. This will break in production and potentially leak local routing structures.
- ⚠️ **Error Leaks:** `getError` in `helpers.ts` blindly returns `error.response.data.detail`. If the backend throws an unhandled exception, this could leak stack traces to the frontend.

---

### PHASE 3 — CODE QUALITY AUDIT

#### 3.1 Numerical Scorecard
| Dimension | Score | Justification |
|-----------|-------|---------------|
| Architecture Quality | 5/10 | Mixing Axios with Next.js App Router breaks native data caching (`fetch`). |
| Code Organization | 7/10 | Clean domain-driven folders (`cabins/`, `account/`), but `_lib` is a dumping ground. |
| Security Posture | 3/10 | IDOR vulnerabilities in Server Actions, hardcoded URLs, loose validation. |
| Performance Design | 6/10 | Good use of Server Components, but React Query is referenced in comments while not being used, indicating architectural confusion. |
| Readability & Naming | 8/10 | Variables and functions are generally well-named and intent is clear. |
| Modularity & Reuse | 6/10 | `data-service.ts` is a 361-line God file. Needs to be split by domain (auth, bookings, cabins). |
| Error Handling | 4/10 | Using generic `try/catch` and swallowing errors or returning strings. Lacks a unified error boundary strategy. |
| Testing Coverage | ?/10 | No evidence of unit/E2E tests in the provided file structure. |
| Documentation | 5/10 | Only a standard README. No JSDoc comments on complex data transforms. |

#### 3.2 Code Smell Inventory
- **God File:** `app/_lib/data-service.ts` (361 lines). Handles Guests, Bookings, Cabins, and Settings.
- **Dead Code:** `app/_lib/data-service.ts:36-54` contains commented-out mock `getCountries` logic.
- **Magic Strings:** `http://127.0.0.1:8000/` in `helpers.ts:4`.
- **Inconsistent Error Handling:** `createBooking` returns an object `{ success: false, message }` but `getCabins` throws an error. This inconsistency makes consuming these functions unpredictable.
- **Orphaned Logic:** `axiosClient.js` imports `BASE_URL` from `helpers.ts`, creating a circular dependency risk given that `helpers.ts` imports from `data-service.ts`, which imports from `axiosClient.js`.

---

### PHASE 4 — PERFORMANCE AUDIT

#### Frontend & BFF
- ❌ **Missing Cache Utilization:** Next.js 14 App Router relies heavily on `fetch` for memoization and caching. Because you are using `axios` in `data-service.ts` (e.g., `axiosPrivate.get("api/cabins/")`), **Next.js cannot cache these requests**. Every render of a server component will hit the Django backend directly.
- ⚠️ **Unnecessary Waterfalls:** In Server Components fetching multiple resources (e.g., Settings and Cabins), if you use sequential `await`, you create network waterfalls. Use `Promise.all()`.
- ✅ **Image Optimization:** `next/image` is used correctly in `app/page.tsx` with `placeholder="blur"` and `priority` for LCP images.

---

### PHASE 5 — SCALABILITY STRESS TEST

1. **10x Traffic:** **Breaks First:** The Django backend. Because `axios` bypasses Next.js Data Cache, your Next.js server will act as a transparent proxy, hammering Django with 10x the database queries instead of serving statically cached ISR (Incremental Static Regeneration) pages.
2. **Horizontal Scaling:** **Breaks First:** The auth session. If you rely on `axiosPrivate` with `withCredentials` and Django sessions instead of passing the NextAuth JWT, you'll run into sticky-session requirements unless Django is purely stateless (JWT).

---

### PHASE 6 — DEVELOPER EXPERIENCE (DX) AUDIT
- ❌ **Circular Dependencies:** `data-service.ts` <-> `helpers.ts` <-> `axiosClient.js`. This will eventually cause "Cannot access uninitialized variable" errors on runtime.
- ❌ **Environment Management:** `BASE_URL` is hardcoded. Moving from Dev to Staging to Prod requires a code change instead of an environment variable swap.

---

### PHASE 7 — PRIORITIZED REMEDIATION PLAN

#### 🔴 P0 — CRITICAL (Fix before any deployment)
| # | Issue | File | Action |
|---|-------|------|--------|
| 1 | Hardcoded Backend URL | `app/_lib/helpers.ts` | Remove `http://127.0.0.1:8000/`. Use `process.env.NEXT_PUBLIC_API_URL` instead. |
| 2 | IDOR Vulnerability in Server Actions | `app/_lib/action.ts` | In `handleBookingUpdateFormAction` and `handleBookingDeleteFormAction`, verify that the `bookingId` belongs to the `guestId` from the NextAuth session before sending the mutation to the backend. |
| 3 | Missing API Authentication | `app/_lib/axiosClient.js` | Add an Axios interceptor to attach the NextAuth session token to the `Authorization: Bearer <token>` header, or ensure your backend strictly validates the session. |

#### 🟠 P1 — HIGH (Fix within 1 sprint)
| # | Issue | File | Action |
|---|-------|------|--------|
| 1 | Bypassed Next.js Caching | `app/_lib/data-service.ts` | Refactor all `axios.get` calls to native Next.js `fetch()` calls. This enables Next.js Data Cache, ISR, and Request Memoization. |
| 2 | Manual Form Validation | `app/_lib/helpers.ts` | Replace `validateBookingForm` with a `Zod` schema definition. Parse the `FormData` against the Zod schema for foolproof runtime type safety. |
| 3 | Circular Dependencies | `app/_lib/helpers.ts` | Move `BASE_URL` to a dedicated `config.ts` or `constants.ts` file to break the import cycle between helpers, data-service, and axios. |

#### 🟡 P2 — MEDIUM (Fix within 1 month)
| # | Issue | File | Action |
|---|-------|------|--------|
| 1 | God File Refactoring | `app/_lib/data-service.ts` | Split into `cabins.service.ts`, `bookings.service.ts`, and `auth.service.ts`. |
| 2 | Edge Route Protection | `/` (root) | Implement a `middleware.ts` to protect `/account/*` routes at the Edge, preventing unauthenticated users from even rendering the server components. |
| 3 | Dead Code / Comments | `app/_lib/data-service.ts` | Delete commented-out blocks like `getCountries` mock array and redundant `console.log` statements. |

---

### PHASE 8 — SENIOR ARCHITECT VERDICT

1. **Honest Impression:** "This looks like a React developer's first foray into the Next.js App Router. They understand the component model but are fighting the framework by bringing in SPA habits (Axios, manual validation) instead of leaning into Server Components (`fetch`, `zod`, `middleware`)."
2. **Strongest Aspect:** The separation of concerns between Server Actions (`action.ts`) and data fetching (`data-service.ts`), combined with clean Tailwind integrations, shows a strong foundational grasp of modern UI patterns.
3. **Biggest Risk:** The IDOR vulnerability in the server actions combined with the hardcoded local backend URL. A malicious user could iterate through `bookingId`s in the `handleBookingUpdateFormAction` and modify or delete reservations belonging to other users.
4. **Developer Level Assessment:** **Mid-Level.** Strong UI/React fundamentals, but lacks the system-design foresight (caching, security middleware, environment config) expected at a Senior level.
5. **Elevation Roadmap:**
   - Rip out Axios in favor of native `fetch` to unlock Next.js caching.
   - Implement `zod` for all Server Action payloads.
   - Introduce Edge `middleware.ts` for route protection and JWT propagation.

---

### Executive Summary
The Wild Oasis frontend is visually on the right track and correctly utilizes modern React concepts. However, underneath the hood, the application is currently fighting the Next.js framework rather than working with it. By relying on tools designed for older single-page applications (like Axios) and hardcoding critical infrastructure links, the app is currently unscalable and unable to be deployed safely. More concerningly, missing authorization checks mean users could potentially modify other people's bookings. By addressing the critical security flaws and refactoring data fetching to use native Next.js features, this application can be rapidly elevated to a secure, production-ready standard.
