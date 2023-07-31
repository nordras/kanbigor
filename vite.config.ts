import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

/**
 * 
 * https://articles.wesionary.team/react-component-library-with-vite-and-deploy-in-npm-579c2880d6ff
 * // vite.config.js
  export default {
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/main.js'), // or 'src/main.ts'
        name: 'MyLibrary',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['vue'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }
 */