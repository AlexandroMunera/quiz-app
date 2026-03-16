# Monetization Spec

Date: 2026-03-15
Last updated: 2026-03-15

## Overview

Monetization strategies for Jess (JS or Guess?), a static React SPA quiz app with Firebase Auth and Firestore sync already in place.

## Goals

- Introduce revenue streams without degrading the free user experience.
- Leverage existing Firebase Auth + Firestore infrastructure.
- Keep the app deployable as a static SPA (no custom backend required).

## Non-goals

- No pay-to-win mechanics (free users can still learn effectively).
- No intrusive advertising that harms UX.
- No custom payment backend — use third-party checkout (Stripe / Lemon Squeezy).

## Strategy 1 — Freemium Content Gating

### Free tier (current)
- 180 questions across 6 categories (JavaScript, TypeScript, React, CSS, DevOps, Web Fundamentals).
- Easy level for all categories.
- Basic results page.

### Pro tier (paid)
- **Premium question packs**: Advanced topics (Node.js, Next.js, System Design, AWS, Testing, Accessibility).
- **Medium / Hard level access**: Gate higher difficulty behind Pro.
- **Coach Mode (SRS)**: Free users get limited daily reviews; Pro unlocks unlimited.
- **Detailed answer explanations**: Show why each option is correct/incorrect.

### Implementation notes
- Store `plan: "pro" | "free"` on Firestore user document.
- Check plan client-side before unlocking gated features.
- Question packs loaded dynamically (code-split per category).

## Strategy 2 — Subscription via Stripe / Lemon Squeezy

### Pricing
- ~$5/month or ~$29/year.
- One-time lifetime option at ~$49.

### Pro features unlocked
- All premium question packs.
- Unlimited Coach Mode sync across devices.
- Analytics dashboard (accuracy by topic over time, weak-area reports).
- Timed challenge modes and streaks.
- Ad-free experience.

### Implementation notes
- Use Stripe Checkout or Lemon Squeezy (no custom backend needed — webhook to Firebase Cloud Function or Lemon Squeezy overlay).
- Store subscription status in Firestore, validate on client.
- Add `SubscriptionContext` alongside existing `AuthContext`.

## Strategy 3 — Ads (supplemental)

- **Carbon Ads** (developer-focused, non-intrusive) or **Google AdSense**.
- Placement: between quiz rounds, on results page, or sidebar on desktop.
- Only on free tier — Pro users are ad-free.
- Low priority; only viable at higher traffic volumes.

## Strategy 4 — Sponsorships

- Approach developer tool companies (hosting providers, bootcamps, IDE makers).
- Offer sponsored question categories or branded quiz challenges.
- Developer audiences provide high B2B sponsor value.
- Could be implemented as a "Sponsored by X" badge on specific category cards.

## Strategy 5 — Digital Products

- **Interview Prep Bundle**: Export quiz content as downloadable PDF with detailed explanations.
- **Team Licenses**: Bulk access for bootcamps or engineering teams.
- Sold via Gumroad or Lemon Squeezy (no backend needed).

## Strategy 6 — Donations / Tip Jar

- "Buy Me a Coffee" or GitHub Sponsors link.
- Add to results page and footer.
- Lowest friction, supplements other strategies.

## Implementation Order

1. **Grow free users** — add more categories/questions, social sharing on results, leaderboard.
2. **Add Pro tier** — gate premium content behind Stripe/Lemon Squeezy subscription.
3. **Add answer explanations** — high-value Pro feature, drives conversions.
4. **Analytics dashboard** — Pro-only feature, increases retention.
5. **Sponsorships / Ads** — layer on once traffic is steady.
6. **Digital products** — passive income supplement.

## Existing Infrastructure to Leverage

- **Firebase Auth** (Google sign-in) → already handles user identity.
- **Firestore** → store subscription status, sync Pro content access.
- **Coach Mode SRS** → natural upsell from limited → unlimited.
- **Code splitting** (Vite manual chunks) → lazy-load premium question packs.
- **GitHub Pages deployment** → keep free tier hosting costs at zero.
