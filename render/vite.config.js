import { defineConfig } from 'vite';
import htmlPlugin from './plugins/html.js';

export default defineConfig({
  plugins: [
    htmlPlugin(),
  ],
});
