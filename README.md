# Nelli Photography

## Online URLs

- Public site: https://vasjapopovich46-beep.github.io/nelli-site/
- Admin: https://vasjapopovich46-beep.github.io/nelli-site/admin/

GitHub Pages deploys the repository root on every push to `main` through `.github/workflows/deploy-pages.yml`.

## CMS and backend contract

The public site reads published content through the existing Google Apps Script URL using a no-store CORS JSON request:

- `GET ?action=publicData`
- response: `{ success: true, siteContent: { ... } }`

The current deployed endpoint returns `NELLI API OK` for `publicData`, so the public site keeps its static fallback until the backend returns this JSON contract with browser CORS enabled.

The admin sends authenticated JSON POST requests to the same URL:

- `adminData`
- `saveSiteContent`
- `publishSiteContent`
- existing `saveSession`, `deleteSession`, `uploadPhoto`, `deletePhoto`, and `setCover`

`siteContent` contains translations for `uk`, `ru`, `en`, and `cz`, plus `media`, `links`, `sections`, `services`, `social`, `seo`, `portfolio`, `published`, and `version`.

The existing admin read action remains JSONP-compatible: `GET ?action=adminData&token=...&callback=...`. Writes currently use the existing opaque `no-cors` POST format; the UI reports them as unconfirmed requests until the backend returns a confirmable response.

## Authentication requirement

The repository contains no Google Apps Script source. The deployed endpoint must validate the in-memory admin password server-side using the Script Properties key `ADMIN_PASSWORD`, then return the requested admin data. No admin password is stored in this repository or browser storage. Until that backend contract is deployed, the admin UI is integration-ready but cannot provide real authentication or persistence by itself.
