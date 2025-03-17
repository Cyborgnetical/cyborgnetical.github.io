import { defineConfig } from 'astro/config';
import { mermaid } from "./src/plugins/mermaid";

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [],
  server: { host: true },

  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [
      // ...
      mermaid,
    ],
  },
  build: {
    rollupOptions: {
      external: ['mermaid']
    }
  }
});