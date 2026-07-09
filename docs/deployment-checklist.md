# Deployment Checklist

## Recommended Hosting

Use **Vercel** first.

Why:

- It is the simplest fit for a small TanStack Start/Vite app.
- The app already builds with Nitro through the Lovable TanStack config.
- Player Lookup uses the existing `/api/nhl/player/:id` server proxy, so assets-only static hosting is not enough for the full app.

Netlify can also work if it runs the TanStack Start/Nitro server output. GitHub Pages is not recommended for the current app because it only serves static assets and would break the player detail proxy.

## Build Settings

- Install command: `npm install`
- Build command: `npm run build`
- Local preview command: `npm run preview`
- Local preview URL: `http://localhost:3000/`
- Public assets directory from the default local build: `.output/public`
- Server output directory from the default local build: `.output/server`

`npm run preview` intentionally builds a local `node-server` Nitro output and starts it. This avoids requiring Wrangler or the Vercel CLI just to smoke-test the production app locally.

Do not publish `.output/public` by itself unless you intentionally accept that Player Lookup details may fail.

## Static Hosting / Rewrites

- Normal use happens at `/`; the selected app tab does not depend on the URL.
- A same-origin `/api/nhl/player/:id` route is required for player detail cards.
- A pure SPA fallback is not enough because `/api/nhl/player/:id` must reach the server proxy.
- No environment variables are required for normal use.
- Tracker data and saved sessions use browser `localStorage`.

## Vercel

- Import the Git repository.
- Use the default framework detection unless Vercel asks for settings.
- Set build command to `npm run build`.
- Do not override the output directory unless the platform asks for one.
- The Lovable TanStack config lets Nitro auto-detect Vercel in Vercel's build environment.
- After deploy, verify `/api/nhl/player/8478402` returns JSON or that selecting Connor McDavid loads a player card.

## Netlify

- Use only if the deploy is configured to run the TanStack Start/Nitro server output.
- Build command: `npm run build`.
- Do not publish `.output/public` as a static-only site for the full app.
- If Netlify is configured as a static-only deploy, Player Lookup details will not work.

## GitHub Pages

Not recommended for this version.

Reasons:

- GitHub Pages is static-only.
- The app currently needs the same-origin NHL player detail proxy.
- GitHub Pages may also require Vite base-path changes for project pages.

## Phone Smoke Test After Deploy

1. Open the deployed URL on desktop.
2. Open the deployed URL on phone.
3. Search/select `Connor McDavid`.
4. Switch tabs and confirm selected player remains.
5. Add opponent `John`.
6. Add several question/answer rows.
7. Save session as `Test Game`.
8. Refresh page.
9. Confirm saved session still exists.
10. Load `Test Game`.
11. Clear ALL and confirm saved sessions remain.
12. Delete `Test Game`.
13. Confirm no horizontal overflow on phone.

## Known Caveats

- Saved sessions are local to each browser/device because they use `localStorage`.
- Clearing the browser's site data removes active tracker data and saved sessions.
- The NHL player detail proxy depends on the public NHL API being reachable from the deployment host.
