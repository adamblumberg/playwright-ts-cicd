# playwright-ts-cicd

> End-to-end and API test automation with **Playwright + TypeScript**, shipped through a **GitHub Actions CI/CD pipeline** that publishes HTML reports to **GitHub Pages**.

[![Playwright Tests](https://github.com/<YOUR_USERNAME>/playwright-ts-cicd/actions/workflows/ci.yml/badge.svg)](https://github.com/<YOUR_USERNAME>/playwright-ts-cicd/actions/workflows/ci.yml)

---

## Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & API testing |
| TypeScript | Type-safe test code |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Hosted HTML test reports |

---

## Project structure

```
playwright-ts-cicd/
├── src/
│   ├── api/
│   │   └── ApiClient.ts          # Typed wrapper around Playwright's request context
│   ├── data/
│   │   └── users.ts              # Test data constants
│   ├── fixtures/
│   │   └── index.ts              # Custom test fixtures (page objects + API client)
│   └── pages/                    # Page Object Models
│       ├── BasePage.ts
│       ├── CartPage.ts
│       ├── LoginPage.ts
│       ├── ProductDetailPage.ts
│       └── ProductsPage.ts
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts          # Auth endpoint tests
│   │   └── products.spec.ts      # Products & categories endpoint tests
│   └── ui/
│       ├── cart.spec.ts          # Cart add/remove flows
│       ├── login.spec.ts         # Authentication flows
│       └── products.spec.ts      # Browse, search, sort, filter
├── .github/
│   └── workflows/
│       └── ci.yml                # Full CI/CD pipeline
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting started

### Prerequisites

- Node.js 20+
- npm 9+

### Install

```bash
npm ci
npx playwright install --with-deps
```

### Run all tests

```bash
npm test
```

### Run only UI tests

```bash
npm run test:ui
```

### Run only API tests

```bash
npm run test:api
```

### View HTML report

```bash
npm run report
```

---

## CI/CD pipeline

The pipeline in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request to `main` / `develop`.

```
push / PR
    │
    ├─► lint          ← TypeScript type-check (fast gate)
    │
    ├─► api-tests     ← API specs, no browser needed
    │
    └─► ui-tests      ← Sharded across 3 parallel runners
            │
            └─► merge-reports → deploy to GitHub Pages
```

### Key pipeline features

- **Sharding** — UI tests split across 3 parallel runners to cut wall-clock time
- **Retries** — 2 automatic retries on CI to reduce flake noise
- **Artifacts** — HTML report and raw test results retained for 30 days
- **GitHub Pages** — every run publishes a live, browsable report

---

## Application under test

[Practice Software Testing](https://practicesoftwaretesting.com) — a realistic e-commerce demo that exposes both a UI and a REST API, making it ideal for demonstrating full-stack test coverage.

---

## Enabling GitHub Pages

1. Go to **Settings → Pages** in your repository
2. Set **Source** to **GitHub Actions**
3. Re-run the workflow — the report URL will be printed at the end of the `merge-reports` job
