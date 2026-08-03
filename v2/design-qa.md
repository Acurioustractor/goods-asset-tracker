# Design QA: Utopia story slide

## Target

The Utopia chapter at `/pitch/road#stop-5-utopia`, using the supplied 30 July 2026 screenshot as the before state.

## Implemented checks

- The desktop chapter is constrained to one viewport and clips overflow inside the slide.
- Headline, body, evidence and links use a tighter vertical rhythm at desktop widths.
- The inline video player no longer occupies the left half of the slide.
- A still of Mykel on the bed he assembled is now the primary film cover.
- A separate photograph shows the bed-making scene.
- The film opens in a contained full-screen dialog with native controls and Escape/close handling.
- Both still-image slots remain independently swappable in local edit mode.
- ESLint, TypeScript and the complete production build pass.

## Verification status

The local browser rejected automated reload and capture because browser access to `localhost:4173` is disabled by the user's browser security setting. No alternate browser or indirect capture was attempted.

**final result: blocked**

Visual comparison and click testing remain to be confirmed in the user's already-open local browser.
