# Connecting the inquiry form to Excel

Goal: when someone submits the form on `contact.html`, a new row appears in
**`inquiries.xlsx`** (the workbook in this folder). Its `Inquiries` table already
has columns that match the form exactly:

`Submitted · Event Date · Event Type · Guest Count · Cuisine Style · Dietary Needs · Notes · Name · Email · Phone · Preferred Contact`

## Why you need a "connector"

A website page runs in the visitor's browser. It has **no access** to your
computer or your OneDrive, so it can't write to an Excel file directly. You need
a small service in the middle that (1) receives the submission and (2) adds a row
to your spreadsheet. Below are three ways, easiest first. All are free to start.

Whichever you pick, the website side is already done — you just paste **one URL**
into `js/main.js`:

```js
var INQUIRY_ENDPOINT = "";   // ← paste your connector URL here
```

While that's blank, the form works but runs in **demo mode** (shows the thank-you
screen, sends nothing).

---

## Path A — Formspree, then Excel  ★ recommended, most reliable

Formspree is built for browser forms (no CORS headaches) and has a free tier
(50 submissions/month).

1. Go to **formspree.io**, sign up, create a form. Copy its endpoint — it looks
   like `https://formspree.io/f/abcdwxyz`.
2. Open `js/main.js`, set `INQUIRY_ENDPOINT` to that URL. Done — submissions now
   arrive in your Formspree inbox and dashboard.
3. Get them into `inquiries.xlsx`, either:
   - **Quick / manual:** In Formspree, **export CSV** and open it in Excel. The
     columns already line up with `inquiries.xlsx`.
   - **Automatic / live:** Use Formspree's **Zapier / Make** connection (or
     Power Automate) with an "Excel → Add a row" step pointing at the
     `Inquiries` table in `inquiries.xlsx` on your OneDrive. Field mapping in the
     next section.

---

## Path B — Make.com → Excel on OneDrive  (fully automatic, free)

One tool, live sync into your Excel file. Make's webhooks are free.

1. Put `inquiries.xlsx` in **OneDrive** (so the cloud connector can see it).
2. At **make.com**, create a scenario. First module: **Webhooks → Custom
   webhook**. Create one and **copy its URL**.
3. Add a second module: **Microsoft 365 Excel → Add a Row**. Sign in to your
   Microsoft account, pick:
   - Workbook: `inquiries.xlsx`
   - Table: `Inquiries`
   - Map each cell to the matching webhook field (they share the same names).
4. Turn the scenario **on**, paste the webhook URL into `INQUIRY_ENDPOINT`, and
   send a test submission.

> Note: if the browser POST is ever blocked by CORS, use **Path A** to receive
> the submission and connect *that* to Excel — Formspree is designed for
> in-browser posting.

---

## Path C — Microsoft Forms → Excel  (simplest, but replaces this form)

Microsoft 365 includes **Microsoft Forms**, which syncs answers to an Excel
workbook automatically with zero setup. The trade-off: you'd swap the custom
multi-step form on `contact.html` for an embedded Microsoft Form, losing the
tailored design. Good if you value zero-maintenance over the custom look.

---

## Field mapping (for Zapier / Make / Power Automate "Add a row")

The form sends these keys — map them straight across to the columns:

| Spreadsheet column | Form field the site sends |
|--------------------|---------------------------|
| Submitted          | `Submitted` (auto ISO date-time) |
| Event Date         | `Event Date` |
| Event Type         | `Event Type` |
| Guest Count        | `Guest Count` |
| Cuisine Style      | `Cuisine Style` |
| Dietary Needs      | `Dietary Needs` (comma-separated) |
| Notes              | `Notes` |
| Name               | `Name` |
| Email              | `Email` |
| Phone              | `Phone` |
| Preferred Contact  | `Preferred Contact` |

The site posts them as form fields **already named exactly like the columns**, so
most tools auto-match them.

## Testing it

1. Set `INQUIRY_ENDPOINT`, save, reload `contact.html`.
2. Submit a test inquiry.
3. Confirm a new row appears in `inquiries.xlsx` (and/or your connector's log).
4. Delete the italic example row in the spreadsheet once real data flows.

If a submission fails, the form now shows an inline error asking the visitor to
email you instead — so nothing is silently lost.
