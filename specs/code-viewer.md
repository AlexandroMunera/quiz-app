# Code Viewer Enhancement

## Summary

Improve the display of code snippets within quiz questions to resemble a modern code editor.

## Problem

Currently, when a quiz question includes a code snippet, it is rendered as plain text (or basic markdown). This makes it harder to read and doesn't match the developer-focused aesthetic of the app.

## Requirements

### Visual Design
- Render code snippets inside a styled container that resembles a code editor window.
- Include a **title bar** with:
  - Three colored dots (red, yellow, green) mimicking macOS window controls.
  - An optional filename or language label (e.g., `index.js`, `TypeScript`).
- Use the **JetBrains Mono** font (already loaded) for code text.
- Apply the app's existing neon/glassmorphism theme tokens for the container styling.

### Syntax Highlighting
- Add syntax highlighting appropriate for JavaScript/TypeScript code.
- Support dark and light mode via the existing ThemeContext.

### Line Numbers
- Display line numbers in a gutter on the left side of the code block.

### Behavior
- Code should be **read-only** (no editing).
- Horizontal scrolling for long lines; no wrapping.
- Responsive — should look good on mobile and desktop.

## Technical Approach

- Create a new `CodeViewer` component following the project's component conventions:
  ```
  src/components/CodeViewer/
    CodeViewer.tsx
    CodeViewer.module.css
  ```
- Use a lightweight syntax highlighting library (e.g., **Prism.js** via `prism-react-renderer`) or CSS-only highlighting to keep the bundle small.
- Integrate with the existing question rendering logic — detect when a question's code field is present and render it through `CodeViewer`.

## Out of Scope
- Copy-to-clipboard button (can be added later).
- Editable code / live execution.
- Multi-file tabs.