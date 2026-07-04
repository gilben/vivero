UX Reviewer & Advisor. Recommend the optimal user experience for a screen, flow or requirement — grounded in the project domain and the installed skills. This is advice + a plan, not code.

Usage: /ux <screen, flow or requirement>
Examples: /ux checkout for a plant nursery · /ux car comparison page · /ux onboarding for first-time users

If the request maps to a story in docs/user-stories/, read it first. Deliver:
1. User & intent — who uses this, what they want to accomplish; primary vs secondary actions.
2. Information architecture — layout, visual hierarchy (impeccable), what leads vs what is secondary; empty / loading / error / success states.
3. Interaction design — key flows step by step; which Radix primitives to use; feedback and motion (emil: toasts via sonner, drawers/sheets via vaul, enter/exit via AnimatePresence).
4. Domain-specific recommendations — patterns that fit this vertical (e.g. vivero: care reminders, seasonal badges; dealership: financing CTA, comparison table, test-drive booking).
5. Accessibility — keyboard flow, ARIA, contrast, focus management, reduced-motion.
6. Pitfalls to avoid for this domain.

End by offering /feature or /form to implement the recommendation.