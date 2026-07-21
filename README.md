# Azi Catering — Website

A fast, dependency-free website for **Azi Catering**, a small seasonal
catering studio (weddings, gatherings, and private celebrations). Plain
HTML/CSS/JS — no build step, no frameworks. Open `index.html` and it works.

The brand is intentionally personal and small-scale — a one-person kitchen, not
a big commercial operation. Copy throughout reflects that ("I" / "a small
kitchen"), so keep new copy in the same voice.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, intro, services, menu highlights, pricing, kind words, CTA |
| `menus.html` | Seasonal menus by event type, dietary tags, customization note |
| `services.html` | Weddings / corporate / private breakdowns + "how it works" |
| `gallery.html` | Photo grid with accessible lightbox |
| `about.html` | Personal founder story, how I work, sourcing & values |
| `testimonials.html` | Kind words from early guests |
| `contact.html` | 3-step inquiry form with progress indicator |
| `privacy.html` | Privacy Policy (plain-English) |
| `cookies.html` | Cookies Notice (plain-English) |
| `404.html` | Friendly not-found page (served automatically by GitHub Pages) |
| `css/styles.css` | Full design system (tokens + components) |
| `js/main.js` | Nav, scroll reveal, lightbox, multi-step form, cookie notice |
| `robots.txt`, `sitemap.xml` | SEO basics |

## Hosting it free on GitHub Pages

GitHub Pages publishes your site to the public web (e.g.
`https://yourname.github.io/azi-catering/`) for free. Note: it hosts it
*online*, not "locally" — for a purely local preview, see the next section.

This repo is already a git repository with an initial commit and an auto-deploy
workflow. To publish:

1. **Create an empty repo on GitHub** (e.g. `azi-catering`). Don't add a
   README/license — this project already has files.
2. **Connect and push** (run these in this folder, filling in your username):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/azi-catering.git
   git branch -M main
   git push -u origin main
   ```
3. **Turn on Pages**: on GitHub go to **Settings → Pages → Build and
   deployment**, set **Source: GitHub Actions**. That's it — the included
   workflow (`.github/workflows/deploy.yml`) builds and deploys on every push,
   and gives you the live URL.

   *Simpler alternative:* set **Source: Deploy from a branch → `main` / root**.
   That skips the Actions workflow entirely and just serves the files.

Because a `.nojekyll` file is present, GitHub serves the files exactly as-is.

### Local preview (truly on your machine)

No server needed — double-click `index.html`. For a local server (better for
testing links and the form):
```bash
python -m http.server 8000    # then open http://localhost:8000
```

## Making it yours

### Brand name
Find/replace `Azi Catering` (and the wordmark markup
`Azi <span>Catering</span>` in each page's nav). Contact email lives in each
footer and the home-page JSON-LD.

### Colors — swap the whole palette in one line
Set the theme attribute on the `<html>` tag of any page:
```html
<html lang="en" data-theme="luxury">   <!-- black / cream / gold -->
<html lang="en" data-theme="bold">      <!-- red / orange -->
```
Or edit the raw tokens under `:root` in `css/styles.css`.

### Fonts
Playfair Display (headings) + Montserrat (body), from Google Fonts. Change the
`<link>` in each `<head>` and the `--font-display` / `--font-body` variables.

### Images
All photography currently points to Unsplash CDN URLs. Replace with your own:
drop optimized files in an `images/` folder and update each `src`/`data-full`,
keeping the descriptive `alt` text. Hero ~2000px wide, gallery thumbs ~600px.

## The inquiry form → Excel

The form is wired to POST cleanly-named fields to a single endpoint. Until you
set that endpoint it runs in **demo mode** (shows the thank-you screen, sends
nothing). To go live, set one value near the top of `js/main.js`:

```js
var INQUIRY_ENDPOINT = "";   // ← paste your connector URL
```

**`inquiries.xlsx`** in this folder is the ready-made destination: an Excel
`Inquiries` table whose columns already match the form fields. Full step-by-step
for connecting the two (Formspree, Make, or Power Automate) is in
**`FORM-SETUP.md`**.

Tip: if you host on Netlify/Vercel instead of Pages, their built-in form
handling can receive submissions with no third-party service.

## Cookies & privacy

The site sets **no tracking cookies**. `js/main.js` shows a one-time consent
notice and remembers dismissal in `localStorage` (key `azi-cookie-consent`).
`privacy.html` and `cookies.html` document this in plain English. If you later
add analytics, list it in `cookies.html` and only load it after consent.

> The legal pages are written in good faith but are **not legal advice**. Have a
> professional review them before launch if you have specific obligations.

## Built-in best practices

- **SEO** — unique titles/meta per page, canonical + Open Graph,
  `CateringService` JSON-LD on the home page, internal links, `robots.txt` +
  `sitemap.xml`.
- **Performance** — no JS libraries, `loading="lazy"` on below-fold images,
  `fetchpriority="high"` hero, width/height set to avoid layout shift.
- **Accessibility** — skip link, ordered headings, keyboard-navigable nav /
  lightbox / form, visible focus rings, `prefers-reduced-motion`.

## Still needs YOU before launch

- [ ] Replace Unsplash images with your own licensed photography (incl. a real
      founder photo on `about.html`).
- [ ] Add your real founder name/story on `about.html` (currently generic).
- [x] ~~Point the form at a real endpoint~~ — **done.** Connected to Formspree
      (`https://formspree.io/f/xjgnygyj`). Next: connect Formspree → Excel with
      Zapier (see `FORM-SETUP.md`), and confirm the form's email once in Formspree.
- [ ] Replace `azicatering.example` URLs (canonical, OG, sitemap, robots) with
      your real domain.
- [ ] Swap the placeholder reviews on `testimonials.html` and the home page for
      real, permissioned quotes as you get them.
- [ ] Confirm menus/prices and the "Summer 2026" seasonal label are accurate.
- [ ] (Optional) Add a real phone number if you want one — it was removed to
      avoid showing a fake number.
