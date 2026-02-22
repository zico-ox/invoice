import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import { randomFillSync } from 'node:crypto'

// Polyfill for environments where globalThis.crypto is missing or incomplete
if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: (arr: any) => {
        randomFillSync(arr);
        return arr;
      }
    }
  });
} else if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  // @ts-ignore
  globalThis.crypto.getRandomValues = (arr: any) => {
    randomFillSync(arr);
    return arr;
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})