---
title: Astro Basics
description: Quick reminders about how Astro components work.
order: 1
---

Astro components use a fenced frontmatter section for server-side script, followed by
the template. Only `.astro` files support this syntax.

- Components render to static HTML by default.
- Use `client:*` directives to hydrate interactive islands.
- Content collections (like these notes) live outside `src/pages` and get rendered
  through dynamic routes.
