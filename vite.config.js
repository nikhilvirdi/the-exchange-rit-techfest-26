import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Enable when the sample illustrations can be included in the public build.
const showProblemStatementIllustrations = false
const disabledIllustration = '\0disabled-problem-statement-illustration'

export default defineConfig({
  plugins: [
    !showProblemStatementIllustrations && {
      name: 'disable-problem-statement-illustrations',
      enforce: 'pre',
      resolveId(source) {
        if (source.startsWith('../assets/problem-statements/') && source.endsWith('.png')) {
          return disabledIllustration
        }
      },
      load(id) {
        if (id === disabledIllustration) return 'export default undefined'
      },
    },
    react(),
    tailwindcss(),
  ],
})
