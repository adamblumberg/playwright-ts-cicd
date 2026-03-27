# playwright-ts-cicd

A test automation framework and CI/CD pipeline I built to demonstrate end-to-end quality engineering practices — from unit tests through API contract tests to cross-browser UI automation, all wired into GitHub Actions with published HTML reports.

[![CI](https://github.com/adamblumberg/playwright-ts-cicd/actions/workflows/ci.yml/badge.svg)](https://github.com/adamblumberg/playwright-ts-cicd/actions/workflows/ci.yml)

**Live test report →** `https://adamblumberg.github.io/playwright-ts-cicd`

---

## What this project covers

| Layer | Tool | Count |
|---|---|---|
| Unit tests | Vitest | 21 |
| API tests | Playwright (no browser) | 44 |
| UI tests | Playwright (Chrome, Firefox, WebKit, Mobile) | 46 |

The app under test is [practicesoftwaretesting.com](https://practicesoftwaretesting.com) — a realistic e-commerce site with a public REST API, which lets me show full-stack test coverage including checkout and cart flows.

---

## Why I built it this way

### Testing pyramid

I deliberately split tests across three layers rather than putting everything in UI tests. Unit tests for pure utility functions run in milliseconds. API tests exercise the contract between client and server without browser overhead. UI tests are reserved for the journeys that actually matter to a user — logging in, finding a product, and completing a purchase.

This keeps the suite fast and failures easy to locate. If an API test breaks, I know the problem is in the backend contract. If only the UI test breaks, the API is fine and the issue is in the frontend.

### Page Object Model

All UI locators live in `src/pages/`. When the site changed from `data-testid` to `data-test` attributes (which the practice app did between sprints), I updated `playwright.config.ts` in one line rather than touching every test file. The tests describe *what* they're doing; the page objects know *how* to do it.

### Custom fixtures

Test files import from `src/fixtures/` which injects fully-constructed page objects and an `ApiClient` instance. Tests destructure only what they need:

```typescript
test('add a product to the cart', async ({ productsPage, productDetailPage, cartPage }) => {
  // no setup noise — just the test
});
```

This keeps tests readable and makes the dependency graph explicit.

### Playwright over Cypress

I chose Playwright because it runs tests across Chromium, Firefox, and WebKit from a single config, has first-class support for API testing without a browser, and handles async Angular rendering more reliably in my experience. Cypress is great for component testing, but for a suite that needs to cover both the REST API and multi-browser UI flows in the same pipeline, Playwright is the better fit.

### Vitest for unit tests

I used Vitest rather than Playwright's test runner for the utility functions in `src/utils/`. Playwright spins up a browser context even when you don't need one; Vitest runs pure Node in under 300ms. Each tool is used for what it's good at.

### TypeScript throughout

The `ApiClient` class has typed interfaces for every API response. If the API changes shape, TypeScript catches it at compile time before a flaky test ever runs.

---

## Project structure

```
playwright-ts-cicd/
├── src/
│   ├── api/
│   │   └── ApiClient.ts          # Typed wrapper around Playwright's request context
│   ├── data/
│   │   └── users.ts              # Test data constants (one place to update credentials)
│   ├── fixtures/
│   │   └── index.ts              # DI-style fixture setup — page objects + API client
│   ├── pages/                    # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── CartPage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductDetailPage.ts
│   │   └── ProductsPage.ts
│   └── utils/
│       └── helpers.ts            # Pure utility functions (unit-testable in isolation)
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts          # Auth contract tests (login, token, 401/422 handling)
│   │   └── products.spec.ts      # Product & category endpoint tests
│   ├── ui/
│   │   ├── cart.spec.ts          # Add / remove / empty cart flows
│   │   ├── login.spec.ts         # Auth UI (valid, invalid, validation errors)
│   │   └── products.spec.ts      # Browse, search, sort, filter
│   └── unit/
│       └── helpers.spec.ts       # Unit tests for pure utility functions
├── .github/
│   └── workflows/
│       └── ci.yml                # Full CI/CD pipeline definition
├── playwright.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## CI/CD pipeline

The pipeline runs on every push and pull request to `master`.

```
push / PR
    │
    ├──► lint + typecheck ──────────────────────────────────┐
    │                                                       │
    └──► unit tests ────────────────────────────────────────┤
                                                            │
                        ┌───────────────────────────────────┘
                        │
              ┌─────────┴──────────┐
              ▼                    ▼
          api-tests          ui-tests × 3 shards
          (no browser)       (Chrome/Firefox/WebKit/Mobile)
              │                    │
              └─────────┬──────────┘
                        ▼
                 merge + publish report
                        │
                        ▼
                  GitHub Pages
```

**Key decisions in the pipeline:**

- **Lint and type-check gate first.** No point running 90 tests against code that doesn't compile.
- **API tests and UI tests run in parallel** after the gate passes, not sequentially. On a branch with both a backend fix and a UI fix, you get both results in one run.
- **UI tests are sharded across 3 runners.** With 46 tests across 4 browsers, sharding cuts the wall-clock time by roughly two-thirds.
- **`retries: 2` on CI only.** Locally, a failure is a failure. On CI, transient network hiccups shouldn't block a merge. Two retries surface genuine flakiness over time without masking it entirely.
- **Every run deploys to GitHub Pages.** Failures don't hide in terminal scrollback — the full HTML report, with screenshots and traces for every failure, is a click away.

---

## Running locally

### Prerequisites

Node.js 20+

### Setup

```bash
npm install
npx playwright install --with-deps
```

### Run the full suite

```bash
# Lint + type-check
npm run lint
npm run typecheck

# Unit tests (fast, no browser)
npm run test:unit

# API tests
npm run test:api

# UI tests — Chromium only (fast local feedback)
npm run test:ui

# UI tests — all browsers (matches CI)
npx playwright test tests/ui
```

### Open the HTML report

```bash
npm run report
```

---

## Enabling GitHub Pages

1. Go to **Settings → Pages** in your repository
2. Set **Source** to **GitHub Actions**
3. Push to `master` — the report URL will be printed at the end of the pipeline run

---

## What I would add next

A few things I'd invest in for a production codebase:

- **Visual regression tests** using Playwright's snapshot API — useful for catching layout regressions in payment UI components
- **API authentication for test isolation** — using a dedicated test user per run to avoid shared cart state between parallel workers
- **Contract testing with Pact** — to decouple UI and API test suites and catch breaking API changes before they reach the frontend
- **Test tagging** (`@smoke`, `@regression`) with a separate smoke job on deployment to catch critical path failures within 60 seconds of a release
- **Payment flow coverage** — the current suite stops before checkout completes. For a payments product I'd extend this to cover the full transaction, including declined cards, instalment plan selection, and order confirmation emails via a test inbox API
