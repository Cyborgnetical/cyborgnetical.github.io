---
title: Getting Started
description: What this notes section is and how it's kept in sync.
order: 1
---

This is a placeholder note. At build time, Astro tries to pull the real notes from
[Cyborgnetical/Notes](https://github.com/Cyborgnetical/Notes) on GitHub, preserving
whatever folder structure exists there. If that repo can't be reached (private,
offline, rate-limited), the site falls back to the dummy notes bundled here in
`src/content/notes/` so the build never breaks.

Folders in the source repo become nested sections in the sidebar, and each markdown
file becomes its own note page.
