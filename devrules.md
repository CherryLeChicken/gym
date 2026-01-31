# AI Development Guidelines

These guidelines define **how code should be written, organized, and evolved** in this repository.
They are intended to be followed by AI-assisted development tools and human contributors alike.

If there is ambiguity, **prefer clarity, modularity, and explicit structure** over cleverness.

---

## 1. Documentation Discipline

### 1.1 `docs/` Directory
- Always maintain a top-level `docs/` directory.
- Use `docs/` for:
  - architecture explanations
  - decisions and tradeoffs
  - audits and refactors
  - operational notes
  - onboarding instructions

Do **not** bury important context inside code comments alone.

---

### 1.2 Audit Large Files
- If any single source file exceeds **1000 lines**:
  - Create an audit document in `docs/audit/`
  - Name it after the file, e.g.:
    ```
    docs/audit/api-user-service.md
    ```
  - The audit **must** include:
    - why the file grew large
    - logical sub-responsibilities inside the file
    - a proposed refactor plan
    - suggested new modules/files
    - risks of refactoring

- After the audit:
  - Suggest modularization
  - Prefer smaller, composable units
  - Avoid “god files”

---

## 2. Repository Structure & Organization

### 2.1 Utilities
- All utility scripts must live in **one predictable location**:
  - e.g. `libs/shared-utils/`
- Utilities must:
  - be pure where possible
  - avoid framework dependencies unless explicitly required
  - have descriptive names
  - include unit tests if logic is non-trivial

Avoid scattered helpers across the codebase.

---

### 2.2 Shared Code
- Shared types, DTOs, schemas, and interfaces should live in:
  - `libs/shared-types/`
- Do **not** duplicate interfaces between frontend and backend.
- Prefer importing shared contracts over re-defining them.

---

## 3. Readability Over Cleverness

- Optimize for **readability**, not brevity.
- Prefer:
  - explicit variable names
  - clear control flow
  - small functions
- Avoid:
  - deeply nested logic
  - magic numbers
  - unclear side effects

If a human cannot understand a file in ~2 minutes, it is too complex.

---

## 4. README & Developer Experience

### 4.1 README Requirements
- Maintain a clear, up-to-date `README.md` at the repository root.
- The README **must** include:
  - prerequisites
  - how to install dependencies
  - how to start the backend for development
  - how to start the frontend for development
  - how to run tests
  - where environment variables are defined

Assume a new developer (or AI) has **zero context**.

---

## 5. Testing Expectations

### 5.1 Unit Tests
- Write unit tests **frequently and incrementally**.
- Tests should:
  - cover core business logic
  - validate edge cases
  - be deterministic
- Prefer many small tests over few large ones.

### 5.2 Test Placement
- Keep tests close to the code they test.
- Use consistent naming:
  - `*.spec.ts`
  - `*.test.ts`

Tests are part of the codebase, not optional extras.

---

## 6. Backend-Specific Practices (NestJS)

- Use feature-based modules (`module / controller / service`).
- Prefer DTOs + validation pipes over manual validation.
- Avoid fat controllers; business logic belongs in services.
- Use TypeORM migrations — **never rely on `synchronize` in production**.
- Import `reflect-metadata` exactly once at application bootstrap.

---

## 7. Frontend-Specific Practices (React + Vite)

- Prefer composition over inheritance.
- Use Tailwind utility classes (v3) consistently.
- Prefer shadcn/ui components built on Radix primitives.
- Use React Query for server state.
- Use client-side state libraries sparingly (e.g. Zustand only when needed).
- Avoid prop drilling by extracting components or hooks.

---

## 8. File & Module Size Heuristics

- Ideal file size: **100–300 lines**
- Soft limit: **500 lines**
- Hard limit: **1000 lines (requires audit)**

If a file grows quickly:
- pause
- document
- refactor deliberately

---

## 9. Architectural Consistency

- Follow existing patterns in the codebase.
- Do not introduce:
  - new frameworks
  - alternative ORMs
  - new state management libraries
  - new build tools

…unless explicitly instructed.

Consistency beats novelty.

---

## 10. AI-Specific Guidance

When generating or modifying code:

- Always ask:
  - “Where should this live?”
  - “Is something similar already implemented?”
- Prefer extending existing abstractions over creating new ones.
- Leave breadcrumbs:
  - comments
  - docs
  - TODOs with context

If unsure, **document the uncertainty** rather than guessing.

---

## 11. Refactoring Rules

- Refactor in small, reversible steps.
- Avoid large rewrites without documentation.
- Preserve behavior unless explicitly changing it.
- Update tests alongside refactors.

Refactoring is expected — uncontrolled change is not.

---

## 12. Default Principle

> **If a decision improves clarity, predictability, or maintainability — choose it.**

This repository values:
- structure
- explicitness
- documentation
- long-term maintainability

Over speed or clever shortcuts.