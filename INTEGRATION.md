# NNVA Landing Page — Developer Integration Guide

An affiliate/partner landing page for the **National Neurodivergent Veterinary
Alliance (NNVA)**. NNVA members — neurodivergent veterinary professionals — claim
negotiated member pricing on virtual medical and behavioral healthcare, in
partnership with **iWILL 'til I'm Well**.

This guide covers how to connect it to the main site: hosting/routing, the lead form
endpoint, UTM/attribution handling, and the affiliate code.

---

## 1. Stack & local setup

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS v4 (tokens in `src/app/globals.css`)
- **Output:** static export (`output: 'export'` in `next.config.ts`) — builds to a
  static `out/` folder, deployable to any static host or CDN.

```bash
npm install          # restore dependencies
npm run dev          # local dev at http://localhost:3000
npm run build        # production static export -> ./out
```

---

## 2. Routing / connecting to the main site

The page is a self-contained static export; mount it via subdomain
(e.g. `nnva.iwilltilimwell.com`), subpath (set `basePath`/`assetPrefix` in
`next.config.ts` and rebuild), or a reverse proxy. Internal nav uses in-page
anchors (`#features`, `#pricing`, `#faq`, `#claim-form`), so no router changes
are needed.

---

## 3. Registration form — the main integration point

**File:** `src/components/retail/NewsletterForm.tsx`

The form creates a real iWILL 'til I'm Well account. It collects the same fields
the app's own sign-up form requires — **First name, Last name, Email, Mobile phone
(10-digit US), Date of birth (18+), Gender, Password + Confirm password, and
agreement to the Terms & Privacy Policy** — with the **affiliate code
auto-populated and read-only**.

On submit it `POST`s JSON to **`{APP_URL}/api/register`** (handled by
`App\Http\Controllers\API\RegisterController` in the iWILL app). On success the page
shows an "Account created" confirmation, then sends the member to the app's
**login screen** (`redirect_url` from the API, i.e. `{APP_URL}/login`), where they
sign in with the email and password they just chose and continue to pick a plan.

- **App base URL:** `https://dev.iwilltilimwell.com` by default (used for both the
  API and the login redirect). **For production, build with**
  `NEXT_PUBLIC_IWILL_APP_URL=https://app.iwilltilimwell.com npm run build`
  (or change the default in `NewsletterForm.tsx`).
- **Errors:** `422` field errors are shown under the matching inputs, `409` means
  the email already has an account (a "Log in" link is shown), `429` is rate
  limiting (10 attempts/minute per IP).
- **Payload:** account fields plus `promo_code`, `landing_page`, and any UTM /
  click-id params. The API stores the affiliate code and attribution on the user
  as `user_metas` rows with prefix `landing`, and links the user to the matching
  `promocodes` row when `NNVAWELL01` exists there.

---

## 4. UTM & attribution (already wired)

UTM capture is built in. On submit, `NewsletterForm.tsx` reads these from the
landing URL and forwards them in the registration payload:

```
utm_source  utm_medium  utm_campaign  utm_term  utm_content  gclid  fbclid
```

---

## 5. Affiliate code

The code **`NNVAWELL01`** is defined as a constant and referenced across the page.
To change it, search the repo for `NNVAWELL01`:

- `src/components/retail/NewsletterForm.tsx` — `const PROMO_CODE` (drives the form field)
- `src/components/retail/RetailHero.tsx` — `const PROMO_CODE` (hero callout)
- `src/components/retail/RetailAnnouncementBar.tsx` — top bar text
- `src/components/Features.tsx`, `RetailPricing.tsx`, `RetailFAQ.tsx` — body copy

---

## 6. Branding / content reference (from ndvetalliance.org)

- **Colors** (brand tokens in `src/app/globals.css` `:root`), from the NNVA
  Elementor kit palette:
  - Navy (primary / CTA) `#2c4971`
  - Deep ink navy `#17253a`
  - Blush rose `#e8bbb2` / `#e1b6aa`, pale blush wash `#f8ede5`
  - Warm cream `#fbf3e8`
  - Soft lavender `#d3c3d3`, pale lavender wash `#ebecf6`
  - Slate blue-grey `#67718d`
- **Fonts:** Work Sans (body + headings) and Poppins (accent), matching NNVA.
- **Buttons:** fully pill-shaped (`rounded-full`), echoing NNVA's `border-radius: 100px`.
- **Logos & images:** `public/images/` — `nnva-logo.svg` (NNVA partner logo, used
  on white/cream — its navy mark reads without a color block; on the navy footer
  it sits on a white chip), `nnva-favicon.png`, plus the IWTIW banner logos and a
  neutral hero photo (`Hero_image.png`).
- **Page sections** (order in `src/app/page.tsx`): Announcement bar → Header →
  Hero → Trust badges → Features → **Claim form** → Pricing → Testimonial → FAQ →
  Footer.
- **Voice:** NNVA's "Honoring how you think, learn, and live." and "Stop masking.
  Start thriving." The copy frames care as neurodivergent-affirming.

---

## 7. Pre-launch checklist

- [ ] Choose hosting model (subdomain / subpath / proxy) and set `basePath` if needed
- [ ] Deploy the iWILL app changes that add `POST /api/register` (dev first, then production)
- [ ] Point the production build at `https://app.iwilltilimwell.com` via `NEXT_PUBLIC_IWILL_APP_URL`
- [ ] Confirm `NNVAWELL01` exists in the app's `promocodes` table (and in
      `landing_promo_filters` if the plan screen should pre-fill/filter for it)
- [ ] Rebuild (`npm run build`) so `out/` contains the new registration form
- [ ] Add analytics/pixel + conversion event
- [ ] Replace placeholder IWTIW contact details in `RetailFooter.tsx`
      (`support@iwilltilimwell.com`, `1-800-555-0199`) with real ones
- [ ] Replace the placeholder testimonial with a real, attributed NNVA member quote
- [ ] Confirm legal links in the footer (`/privacy`, `/terms`, `/insurance-disclaimer`)
      resolve on the chosen host
- [ ] Confirm the hero photo is licensed / approved, or swap for an NNVA-supplied image
