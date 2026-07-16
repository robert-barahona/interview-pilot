@AGENTS.md

# Interview Pilot — Claude Code Guidelines

## Project Overview

This is an AI-powered interview simulator built with Next.js, TypeScript, and Tailwind CSS. It generates a mock interview from a pasted job posting and runs it as a fully voice-based conversation with real-time feedback.

## React

- Avoid `useEffect` except to sync with external systems (DOM APIs, timers, storage, subscriptions) — never to derive state.
- Exports: always `export const`, never `export default` (except where the framework requires it, e.g. `page.tsx`/`layout.tsx` in the App Router).
- Type components with `FC`, imported as `import type { FC } from "react"`.
- Props: define an `interface` named `<ComponentName>Props`, with every property `readonly`. Destructure props directly in the function parameters.
- Use an implicit return (no `return`, no `{ }`) whenever the component body is a single JSX expression.

## Functions

- Always use arrow functions, never `function` declarations, expressions, or object method shorthand — utilities, hooks, event handlers, API route handlers, object literal callbacks (e.g. `ReadableStream({ start: async (controller) => {...} })`), etc.

## Project Structure

- `src/components/ui`: base, reusable components with no business logic (Button, Input, Card, Badge, Modal).
- `src/components/layout`: structural wrappers with no domain content (Header, Footer, Sidebar, PageWrapper, Grid). If a structural component has domain-specific content or logic, it belongs in `feature/<name>` instead.
- `src/components/feature/<name>`: components tied to a domain/feature, including page-specific components (UserProfile, CheckoutForm, ChatHeader). Example: for `/app/auth/page.tsx`, create `/components/feature/auth/LoginForm.tsx`.
- `src/hooks/shared`: generic, reusable hooks with no business logic (useDebounce, useLocalStorage, useMediaQuery).
- `src/hooks/feature/<name>`: hooks tied to a domain/feature (useChat, useCheckout, useUserProfile).
- `src/types`: all shared and feature-specific types (e.g. `chatTypes.ts`, `themeTypes.ts`).
- `src/lib`, `src/utils`: framework-agnostic helpers and integrations. No subfolder split required unless a domain-specific group emerges — then mirror the `feature/<name>` pattern.
- Naming: components in PascalCase matching their export (`ChatHeader.tsx`); hooks in camelCase prefixed with `use` (`useChat.ts`).

## TypeScript

- Use `interface` to define object shapes (component props, API payloads, etc.); use `type` for primitives, unions (`|`), intersections (`&`), or complex mapped types.
- Always use `const` over `let`; only use `let` when a variable must be reassigned.
- Never use `any`; prefer `unknown` and narrow it before use.

## Environment Variables

- API keys must always be read from environment variables, never hardcoded.
