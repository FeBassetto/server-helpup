import { defaultExclude, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    exclude: defaultExclude.concat('build/**'),
    coverage: {
      include: ['src/use-cases/*/*.ts', 'src/repositories/*/*.ts'],
      exclude: ['build/**', 'node_modules/**', 'test/**'],
      all: true,
    },
  },
})
