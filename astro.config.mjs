import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [],
  server: { host: true },

  vite: {
    plugins: [tailwindcss()]
  },
  collections: {
    units: {
      slug: ({data}) => {
        // Preserve numbers and meaningful separators
        return data.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/\./g, '')
          .replace(/---+/g, '-');
      }
    }
  }
});