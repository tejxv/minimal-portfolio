// Ambient types for the View Transitions API (used in app/components/work-grid.tsx).
// TypeScript 5.3's lib.dom doesn't ship these yet, so declare the minimal surface
// the lightbox morph relies on. Remove once the project's TS lib includes them.

interface ViewTransition {
  readonly finished: Promise<void>
  readonly ready: Promise<void>
  readonly updateCallbackDone: Promise<void>
  skipTransition(): void
}

interface Document {
  startViewTransition(callback?: () => void | Promise<void>): ViewTransition
}

interface CSSStyleDeclaration {
  viewTransitionName: string
}
