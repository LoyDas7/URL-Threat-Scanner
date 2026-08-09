# Scan The URL — Frontend

React + Vite frontend for the Scan The URL phishing/malicious URL scanner.
Talks to the already-deployed backend at `POST /api/scan` — no mock data,
no second backend.

## Tech stack

React · Vite · JavaScript · Tailwind CSS · Axios · React Router

## Setup

```bash
npm install
```

Create a `.env` file in the project root (a `.env.example` is included):

```env
VITE_API_URL=https://scan-the-url.onrender.com
```

`.env` is already git-ignored — never commit it, and never hardcode the
backend URL inside a component. All API calls go through `src/services/api.js`,
which reads `import.meta.env.VITE_API_URL`.

## Run locally

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview   # to sanity-check the build locally
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify, Cloudflare
Pages, Render static site, etc.). Set `VITE_API_URL` as an environment
variable in that host's dashboard — it needs to be present at **build** time
since Vite inlines env vars.

## Project structure

```
src/
├── components/
│   ├── shared/
│   │   ├── SectionCard.jsx      # card shell used by every analysis card
│   │   └── MetadataField.jsx    # generic, defensive key/value renderer
│   ├── Navbar.jsx / Footer.jsx
│   ├── Hero.jsx
│   ├── UrlScanner.jsx           # input, validation, API call, loading/error
│   ├── LoadingState.jsx
│   ├── ScanResult.jsx           # top-level result layout
│   ├── VerdictBadge.jsx         # flexible verdict → color/icon mapping
│   ├── RiskScore.jsx            # handles scores above 100
│   ├── FindingsList.jsx
│   ├── MetadataDashboard.jsx    # grid of all category cards
│   ├── UrlAnalysisCard.jsx
│   ├── PatternAnalysisCard.jsx
│   ├── WhoisCard.jsx
│   ├── DnsCard.jsx
│   ├── SslCard.jsx
│   ├── RedirectCard.jsx
│   ├── VirusTotalCard.jsx
│   └── GoogleSafeBrowsingCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── HowItWorks.jsx
│   └── About.jsx
├── services/
│   └── api.js                   # the only file that talks to the backend
├── utils/
│   └── formatters.js            # null-safe formatting, verdict styling, etc.
├── App.jsx
├── main.jsx
└── index.css
```

## Notes on defensive rendering

The backend's `ssl`, `whois`, and `dns` objects don't always return the same
shape (confirmed from real responses — e.g. `ssl` sometimes includes
`issuer`/`validTo`, sometimes just `enabled`/`reachable`). Rather than
hardcode every possible field, `MetadataField` + `DnsCard`/`SslCard` iterate
over whatever keys are actually present and render them safely — `null` and
`undefined` become "Not available," nothing crashes if a field is missing.

## Deliberately not included yet (per spec)

PDF download, scan history, auth, database, admin dashboard — these were
explicitly excluded from this version and can be added later.
