# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Automatic Instagram embed

`.github/workflows/update-instagram.yml` runs daily (and can be triggered manually from the Actions tab) to pull the umcpfds account's latest post via the official [Instagram Graph API](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api) and write its permalink into `public/landingPage.txt`. A commit is only made when the URL actually changes, and pushing to `main` triggers the existing FTP deploy.

**One-time setup required** (needs someone with admin access to the umcpfds Instagram + a Facebook Page):

1. Make sure the umcpfds Instagram account is a **Professional (Business or Creator) account** linked to a **Facebook Page** you control (Instagram app → Settings → Account type).
2. Create a Meta app at [developers.facebook.com](https://developers.facebook.com/apps), add the **Instagram Graph API** product, and generate a User access token with the `instagram_basic` and `pages_show_list` permissions for that Page/IG account.
3. Exchange it for a **long-lived token** (valid ~60 days) via the [long-lived token endpoint](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/token-exchange). Long-lived tokens can be refreshed for another 60 days via `/refresh_access_token` any time before they expire — **this token will need to be periodically refreshed and re-added as a secret**, or the workflow will start failing once it expires.
4. Find the numeric **Instagram Business Account ID** (via `GET /me/accounts` then `GET /{page-id}?fields=instagram_business_account`).
5. In this repo's Settings → Secrets and variables → Actions, add:
   - `IG_ACCESS_TOKEN` — the long-lived access token
   - `IG_USER_ID` — the Instagram Business Account ID

Until those secrets are set, the workflow will fail with a clear error rather than silently doing nothing.
