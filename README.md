# Nelli Photography

Static photography site with a small Google Drive based admin. Google Sheets stores sessions, site text, and booking requests. Google Drive stores uploaded photos.

## One-time setup

Follow [`SETUP.md`](SETUP.md) to install the Apps Script backend, connect its URL in `config.js`, and deploy the site to GitHub Pages.

The archive did not include the previous Apps Script project or the original spreadsheet IDs. The included script creates a new spreadsheet and photo folder in the same Google Drive account. It does not delete or alter the old data. Existing sessions and photos are not automatically migrated.

## Use the admin

Open `/admin/`, enter the private key created by `setupNelliDrive()`, then use:

- **Фотосесії** to create sessions, upload photos, choose a cover, and set visibility on the public site.
- **Тексти сайту** to edit translated headings and descriptions, add the site photos and social links, save a draft, or publish.
- **Заявки** to read contact form submissions saved to the Google Sheets database.

The admin key is checked by Apps Script and held in memory only. It is not embedded in the website or saved in browser storage. Google Apps Script is a temporary backend; it can later be replaced while keeping the same browser API contract.

## Photos

Upload JPG, PNG, or WebP images up to 5 MB each. Photos belonging to a session marked visible are displayed publicly on the site; uploaded Drive files are shared with “Anyone with the link — Viewer” so the public page can display them. Do not upload private client photos to a visible session.

## Deployment

GitHub Pages publishes the repository root on pushes to `main` using `.github/workflows/deploy-pages.yml`.
