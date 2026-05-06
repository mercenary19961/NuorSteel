# SSR Production Fix — Handoff Doc

> **Status as of 2026-05-03:** SSR code is wired up in this repo, but the production deploy at https://nuorsteel.hardrock-co.com is NOT actually running SSR. Googlebot sees an empty `<body>`. This doc explains exactly what's missing and how to fix it.
>
> **Reference:** the same fix was successfully applied to a sister project (`hardrock-co.com`) on 2026-05-02 with identical Laravel + Inertia + React stack. If anything is unclear, that project's `CLAUDE.md` (Production Deployment section) is the authoritative working reference.

---

## TL;DR

The SSR build pipeline works (`bootstrap/ssr/ssr.js` is produced on every deploy). What's missing is a **Node process running it in production** plus two env vars on the main Laravel service. Fix is ~30 minutes of Railway dashboard work + one tiny `package.json` change.

---

## Step 0: Verify the problem (do this first)

Run from terminal:

```bash
curl -s -A "Googlebot" --compressed https://nuorsteel.hardrock-co.com/ \
  -o /tmp/n.html

python -c "
import re
with open('/tmp/n.html') as f: html = f.read()
m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
body = m.group(1) if m else ''
inner = re.sub(r'<div id=\"app\"[^>]*>.*?</div>', '<APP/>', body, flags=re.DOTALL)
print('Body w/o <div id=app>:', len(inner), 'bytes')
text = re.sub(r'<[^>]+>', ' ', body); text = re.sub(r'\s+', ' ', text).strip()
print('Visible text length:', len(text))
"
```

(On Windows / Git Bash, replace `/tmp/n.html` with a Windows path like `C:/temp/n.html`.)

| Output | Meaning |
|---|---|
| Body w/o app-div ≈ 28 bytes, visible text = 0 | **SSR is broken** — current state. Continue with this doc. |
| Body w/o app-div ≈ 50,000+ bytes, visible text in the thousands | **SSR is working** — this doc is obsolete; investigate something else. |

---

## What's already in place (don't rebuild)

The previous developer set up most of the SSR machinery. Verified present:

| Item | Location |
|------|----------|
| SSR entry point | `resources/js/ssr.tsx` |
| Client entry with `hydrateRoot` detection | `resources/js/app.tsx` |
| Vite SSR input config | `vite.config.ts` (line: `ssr: 'resources/js/ssr.tsx'`) |
| Build script that produces both bundles | `package.json` → `"build": "vite build && vite build --ssr"` |
| Inertia config with SSR options | `config/inertia.php` |
| SSR build output | `bootstrap/ssr/ssr.js` (gitignored, regenerated on each deploy) |

Run `npm run build` locally to confirm both bundles still build cleanly. If they do, you don't need to touch any of these files.

---

## What's missing in production

1. **No Node process running `node bootstrap/ssr/ssr.js`** — the bundle exists in the deployed container but nothing executes it.
2. **No `INERTIA_SSR_ENABLED=true`** env var on the main Laravel service (Inertia defaults to client-only without it).
3. **No `INERTIA_SSR_URL=...`** env var telling Laravel where to POST page data for rendering.
4. **`axios` is in `devDependencies`** in `package.json` — pruned in production, will crash the Node SSR process with `ERR_MODULE_NOT_FOUND` on startup. Must be moved before any of this matters.

---

## The fix — five steps

### Step 1: Move `axios` to runtime dependencies

```diff
// package.json
"dependencies": {
+   "axios": "^1.11.0",
    ...
},
"devDependencies": {
-   "axios": "^1.11.0",
    ...
},
```

Then regenerate the lockfile (don't manually edit it):

```bash
npm install --package-lock-only
# or if using pnpm:
pnpm install --lockfile-only
```

Commit `package.json` + the lockfile together. Push. Don't deploy yet — finish the rest first to avoid intermediate broken states.

While you're in `package.json`, double-check these are ALL in `dependencies` (not devDependencies):

- `react`, `react-dom` ✓ (already correct)
- `@inertiajs/react` ✓ (already correct)
- `react-i18next`, `i18next` ✓ (already correct)
- `framer-motion`, `lenis` ✓ (already correct)

The rule: anything that isn't only used by Vite/TS at build time is a runtime dep. SSR's Vite externalizes node_modules packages, so they need to be there at runtime.

### Step 2: Confirm `ssr.tsx` is SSR-safe

Look at `resources/js/ssr.tsx` and any module it imports (especially `./i18n`, `./contexts/LanguageContext`, `./contexts/ToastContext`). The Node renderer crashes if any of these touch `window`, `document`, `localStorage`, or `navigator` at module top level or during render.

Common offenders to check:

- **`i18next-browser-languagedetector`** — if used, it reads `navigator.language` at init. Replace with server-side language detection via a cookie (the pattern from hardrock: read cookie in `HandleInertiaRequests::share()`, pass as Inertia prop, init i18n from prop, no auto-detect).
- **`window.x = y`** statements at module top level — guard with `if (typeof window !== 'undefined')`.
- **`localStorage.getItem(...)` in a `useState` initializer** — runs during SSR render; move to `useEffect`. Default to a safe value, then read/write localStorage after mount. Better: use a server-side cookie like above.

If you find any, fix them BEFORE deploying — otherwise the SSR Node process will crash on first request and Inertia silently falls back to client-only (you'll think it's working when it isn't).

### Step 3: Check Ziggy SSR setup (if `route()` is used in render)

Search the codebase:

```bash
grep -rn "\\broute(" resources/js/Pages resources/js/Components resources/js/Layouts 2>/dev/null
```

If any results show `route('name')` in JSX (i.e. inside render functions, not just inside event handlers), then SSR needs a `globalThis.route` shim. Pattern from the hardrock implementation:

**In `resources/js/ssr.tsx`** (inside the `setup` callback):

```tsx
import { route } from 'ziggy-js';

// Inside setup({ App, props }):
(globalThis as any).route = (name?: any, params?: any, absolute?: boolean) =>
    route(name, params, absolute, {
        ...(page.props as any).ziggy,
        location: new URL((page.props as any).ziggy.location),
    });
```

**In `app/Http/Middleware/HandleInertiaRequests.php` `share()`:**

```php
use Tighten\Ziggy\Ziggy;

return [
    ...parent::share($request),
    // ... other shared props
    'ziggy' => fn () => [
        ...(new Ziggy)->toArray(),
        'location' => $request->url(),
    ],
];
```

**In `vite.config.ts`** add a Ziggy alias so it resolves at build time without an npm dep:

```ts
resolve: {
    alias: {
        '@': path.resolve(__dirname, 'resources/js'),
        'ziggy-js': path.resolve(__dirname, 'vendor/tightenco/ziggy/dist/index.esm.js'),
    },
},
```

If `route()` is only used inside event handlers (`onClick`, `onSubmit`, etc.), skip this step — those handlers run on the client, not during SSR render.

### Step 4: Create the Railway SSR sidecar service

In the Railway project hosting nuor-steel:

1. **+ New** → **GitHub Repo** → select the same nuor-steel repo. Name the service `nuorsteel-ssr`.
2. **Settings → Deploy → Custom Start Command:** `node bootstrap/ssr/ssr.js`
3. **Variables:** the SSR service runs the same Laravel build before launching Node, so it needs the same env vars. Easiest path:
   - On the main service → Variables → click **Shared Variable** to promote all variables to project-shared.
   - On `nuorsteel-ssr` → Variables → click **+ Shared Variable** to import them.
   - **Skip** `INERTIA_SSR_ENABLED` and `INERTIA_SSR_URL` — those are main-service-only.
4. **Settings → Networking → Private Networking → Generate Private Domain.** Note the hostname (e.g. `nuorsteel-ssr.railway.internal`). Do NOT generate a public domain — SSR is internal-only.
5. Wait for first deploy → check **Deploy Logs**:
   - ✅ Expected: `Inertia SSR server started.` near startup
   - ⚠️ Crash with `ERR_MODULE_NOT_FOUND` → step 1 wasn't done correctly (a package needed at runtime is still in devDependencies). Move it to dependencies, push, redeploy.
   - ⚠️ Crash with `ReferenceError: window is not defined` (or similar) → step 2 wasn't done; some module reads browser APIs. Fix and redeploy.

### Step 5: Wire the main service

On the **main** nuor-steel service → Variables → add:

- `INERTIA_SSR_ENABLED` = `true`
- `INERTIA_SSR_URL` = `http://nuorsteel-ssr.railway.internal:13714` (substitute your actual private domain; port 13714 is Inertia's default and is hardcoded in `ssr.tsx`)

Saving the second variable triggers a redeploy of the main service. Wait ~30s for it to settle.

### Step 6: Verify

```bash
# Should jump from ~63K to 80–120K
curl -s -A "Googlebot" --compressed https://nuorsteel.hardrock-co.com/ | wc -c

# Should now show real internal links
curl -s -A "Googlebot" --compressed https://nuorsteel.hardrock-co.com/ \
  | grep -oE 'href="/[^"]+"' | sort -u | head -20
```

Then resubmit the sitemap in Google Search Console (Sitemaps tab → click the kebab on the sitemap row → Resubmit) and request indexing for each public URL via URL Inspection. Indexing typically settles within 1–7 days.

---

## Failure mode lookup table

| Symptom | Likely cause | Fix |
|---|---|---|
| Body still ~63K after Step 6 | Main service can't reach SSR | Re-check `INERTIA_SSR_URL` value: must start with `http://` (not https), must end with `:13714`, hostname must match the private domain exactly |
| `nuorsteel-ssr` crashes immediately | A runtime dep is in devDependencies | Find the package name in the error, move to dependencies, regen lockfile |
| `nuorsteel-ssr` runs but every request returns 500 | `ssr.tsx` itself throws (e.g. `route()` not defined, or window access) | Check Deploy Logs for stack trace |
| Hydration mismatch warnings in browser console | Server rendered different markup than client | Usually localStorage / theme / language flow that diverges. Server and client must read from same source (cookie, not localStorage) |
| Body has content but search engines still see empty body | CDN cache | Cloudflare may be caching an old empty version. Purge `https://nuorsteel.hardrock-co.com/` from Cloudflare cache, or wait for natural TTL |

---

## What does production architecture look like once fixed

```
┌──────────────────────────┐         ┌─────────────────────────────┐
│ nuor-steel (web)         │  POST   │ nuorsteel-ssr (Node)        │
│ FrankenPHP + Laravel     │ ──────► │ node bootstrap/ssr/ssr.js   │
│ Public: nuorsteel...     │         │ Private: ...railway.internal│
│ Reads INERTIA_SSR_URL    │ ◄────── │ Returns rendered HTML       │
└──────────────────────────┘  HTML   └─────────────────────────────┘
                                          (port 13714)
```

Both services build from the same repo. The web service handles HTTP requests, generates Inertia page payloads, and POSTs them to the SSR service for rendering. SSR returns HTML. Web service injects HTML into Blade template, returns to browser. Browser sees populated HTML on first paint, React hydrates.

If `nuorsteel-ssr` is down, Inertia falls back to client-only rendering — the site still works, but Googlebot sees an empty body until the SSR service comes back. Watch Railway logs for `[SSR] exited` or repeating crashes.

---

## Why this happens (so future-you doesn't get confused)

Laravel + Inertia + React produces a SPA where everything visible is rendered by JavaScript at runtime. Without SSR:

- Server returns a near-empty HTML shell (`<div id="app" data-page="...">{json}</div>`)
- Browser downloads JS bundle, parses Inertia page data, mounts React, renders content
- That all works for human users with JS enabled
- Google's crawler does eventually run JS in a second pass — but it's deferred, deprioritized, and unreliable. The first-pass crawler sees an empty body and no internal links → Google deprioritizes the URL and may never index it deeply

SSR fixes this by rendering the React tree to HTML server-side BEFORE returning to the browser. Crawlers see real content and real `<a href>` links on the first request.

The cost: an extra Node process. We isolate it in its own Railway service for clean supervision and independent scaling. Same code, different runtime.
