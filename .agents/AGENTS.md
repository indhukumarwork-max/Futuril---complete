# Futuril Project Rules

## Single Integrated Next.js Application Rule

1. **Single Application & Server**:
   - Maintain Futuril as a single, unified Next.js application.
   - Use only one development server instance (`http://localhost:3000`).
   - Do NOT create separate apps, duplicate Next.js projects, or spin up isolated dev servers for testing.

2. **Unified Directory & Component Architecture**:
   - All App Router routes must reside exclusively in `src/app/`.
   - All UI components, styles, 3D elements, and API middleware must be integrated into `src/`.
   - Test routes (e.g., `/primitives`, `/kiki-test`) must exist inside `src/app/` in the same application.

3. **Production-Ready Implementation (No Placeholders)**:
   - Do NOT use placeholder implementations, temporary shapes, default colours, or mock layouts unless explicitly permitted in the PRD.
   - Implement production-ready screens and components adhering strictly to the Futuril design system tokens, typography, animations, and specification.

4. **Phase Delivery Workflow**:
   - After completing each phase:
     1. Integrate code directly into the main application codebase (`src/`).
     2. Verify functionality and regression on `http://localhost:3000`.
     3. Ensure all previously completed phases continue to work without regression.
     4. Report comprehensive verification results to the user for Git commit and push.
     5. Only proceed to the next phase after user confirmation.
