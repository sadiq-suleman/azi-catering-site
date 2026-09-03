# Azi Catering — Website

A personal website I created for a family owned catering business. All assets and data are subject to change at any time.

## Pages Purpose

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, intro, services, menu highlights, pricing, kind words, CTA |
| `menus.html` | Seasonal menus by event type, dietary tags, customization note |
| `services.html` | Weddings / corporate / private breakdowns |
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

## Rebranding

### Brand name
Find/replace `Azi Catering` (and the wordmark markup
`Azi <span>Catering</span>` in each page's nav). Contact email lives in each
footer and the home-page JSON-LD.

### Colours, pallete swap in one line
Set the theme attribute on the `<html>` tag of any page:
```html
<html lang="en" data-theme="luxury">   <!-- black / cream / gold -->
<html lang="en" data-theme="bold">      <!-- red / orange -->
```
or edit the raw tokens under `:root` in `css/styles.css`.

### Fonts
Playfair Display (headings) + Montserrat (body), from Google Fonts. Change the
`<link>` in each `<head>` and the `--font-display` / `--font-body` variables.

### Images
All photography currently points to Unsplash CDN URLs. Replace with your own:
drop optimized files in an `images/` folder and update each `src`/`data-full`,
keeping the descriptive `alt` text. Hero ~2000px wide, gallery thumbs ~600px.



## Built-in best practices

- **SEO** — unique titles/meta per page, canonical + Open Graph,
  `CateringService` JSON-LD on the home page, internal links, `robots.txt` +
  `sitemap.xml`.
- **Performance** — no JS libraries, `loading="lazy"` on below-fold images,
  `fetchpriority="high"` hero, width/height set to avoid layout shift.
- **Accessibility** — skip link, ordered headings, keyboard-navigable nav /
  lightbox / form, visible focus rings, `prefers-reduced-motion`.

## Still needs to be done before launch

- [ ] Replace Unsplash images with personal photography (incl. a
      founder photo on `about.html`).
- [ ] Add full founder name/story on `about.html` (currently placeheld).
      (`https://formspree.io/f/xjgnygyj`). 
- [ ] Replace `azicatering.example` URLs (canonical, OG, sitemap, robots) with
      final domain.
- [ ] Swap the placeholder reviews on `testimonials.html` and the home page for
      real quotes.
- [ ] Confirm menus/prices and specials are accurate
- [ ] add real phone numb
