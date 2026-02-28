# Auth & Cloud Coach Progress Sync

Date: 2026-02-28

## Summary

Add optional Google sign-in (Firebase Auth) to Jess so authenticated users have their Coach Mode SRS progress synced to Firestore and restored on any device. Unauthenticated users continue using `localStorage` exactly as today.

## Decisions

- **Firebase** over Supabase: no backend server needed, Google sign-in is first-class, static SPA compatible.
- **Guest mode supported**: `localStorage` path is unchanged — cloud sync is purely additive.
- **Cloud wins on conflict**: on sign-in, cloud data overwrites local (simplest UX, no merge prompt).
- **Sign-in button in Layout header**: always accessible, consistent with standard web app patterns.

## Non-goals

- No new routes or pages.
- No data migration UI or merge prompt.
- No other sign-in providers (GitHub, email/password, etc.) for now.
- Theme preference (`js-quiz-theme`) stays local-only.

---

## Implementation Steps

### Step 1 — Firebase project setup *(manual, one-time)*

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Google** under Authentication → Sign-in Providers.
3. Create a **Firestore** database (start in production mode).
4. Add Firestore security rules so only the owner can read/write their data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Add the GitHub Pages domain (e.g. `<username>.github.io`) to **Authorized Domains** in Firebase Auth settings.

---

### Step 2 — Environment variables

Create `.env.local` at the workspace root:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

- Add `.env.local` to `.gitignore`.
- Create `.env.example` with the same keys but empty values (safe to commit).
- For the GitHub Pages deploy, add the same vars as GitHub Actions secrets and reference them in the workflow.

---

### Step 3 — Install Firebase SDK

```bash
pnpm add firebase
```

No other new runtime dependencies needed.

---

### Step 4 — `src/lib/firebase.ts` *(new)*

Initialize the Firebase app using `import.meta.env.VITE_FIREBASE_*` vars. Export `auth` (`getAuth`) and `db` (`getFirestore`). Guard against double-init with `getApps().length` check.

---

### Step 5 — `src/lib/coachSync.ts` *(new)*

Two pure async helpers that keep all Firestore access isolated:

- `fetchCloudProgress(uid: string): Promise<CoachStoreV1['items'] | null>` — reads `users/{uid}/coach/v1` document.
- `writeCloudProgress(uid: string, items: CoachStoreV1['items']): Promise<void>` — writes the full items map to the same path.

---

### Step 6 — `src/context/AuthContext.tsx` *(new)*

Wraps `onAuthStateChanged` from Firebase Auth. Exposes:

```ts
{
  user: User | null;
  authLoading: boolean;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
}
```

- `signInWithGoogle` uses `signInWithPopup` with `GoogleAuthProvider`.
- Export a `useAuth()` hook.
- Context type derived via `ReturnType` pattern, matching the project convention.

---

### Step 7 — Register `AuthProvider` in `src/main.tsx`

Wrap `ThemeProvider` (and everything inside it) with `<AuthProvider>`. Final provider order:

```
HashRouter
  AuthProvider        ← new
    ThemeProvider
      QuizProvider
        App
```

---

### Step 8 — Update `src/hooks/useCoachStore.ts`

- Import `useAuth` and the two helpers from `coachSync.ts`.
- **On sign-in** (`user` changes from `null` → real user): call `fetchCloudProgress(uid)`; if non-null, overwrite `localStorage` key `js-quiz-coach-v1` with cloud data (cloud wins).
- **On every `updateItem` write**: persist to `localStorage` as today, then — if `user` is signed in — fire `writeCloudProgress(uid, updatedItems)` (fire-and-forget with a `.catch` log, no `await`).
- **On sign-out**: leave `localStorage` untouched (user keeps local progress).

---

### Step 9 — Add shadcn `Avatar` component

```bash
pnpm dlx shadcn@latest add avatar
```

Adds `src/components/ui/avatar.tsx`. Used in the header to display the signed-in user's Google profile photo / initials.

---

### Step 10 — Update `src/components/Layout/Layout.tsx`

Import `useAuth`. In the header, render based on auth state:

| State | Renders |
|---|---|
| `authLoading === true` | Small spinner |
| `user !== null` | `<Avatar>` with `user.photoURL`; tooltip shows `user.displayName`; click → `signOut()` |
| `user === null` | Secondary `<Button>` "Sign in with Google" → `signInWithGoogle()` |

Style changes in `Layout.module.css` — position the auth control in the top-right of the header.

---

### Step 11 — Type safety

- Import `type User` from `firebase/auth` in `AuthContext.tsx`.
- `useCoachStore` receives `user: User | null` from context — no changes needed to `src/types/quiz.ts`.

---

## Verification Checklist

- [ ] `pnpm dev` — app loads without auth errors; sign-in button visible in header.
- [ ] Sign in with Google → avatar appears; Firestore document `users/{uid}/coach/v1` created after answering a coach question.
- [ ] Sign out → sign-in button returns; local progress unchanged.
- [ ] Open app in a second browser / incognito → sign in with same account → coach progress restored from Firestore.
- [ ] Guest user answers coach questions → progress saved to `localStorage` only; no Firestore writes.
- [ ] `pnpm build` — no TypeScript or build errors.
- [ ] Firestore rules test: unauthenticated read of `users/any/coach/v1` → rejected.
