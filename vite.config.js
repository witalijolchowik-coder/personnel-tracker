import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project repository path. Change to '/' for a username.github.io repository,
  // or to '/your-repository-name/' if the GitHub repository name is different.
  base: '/personnel-tracker/',
});
