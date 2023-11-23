import { defaultExclude, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const coverageInclude =
  process.env.TEST_TYPE === 'e2e'
    ? ['src/repositories/prisma/*.ts', 'src/http/controllers/*/*/*.ts']
    : ['src/repositories/in-memory/*.ts', 'src/use-cases/*/*.ts']

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 60000,
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    exclude: defaultExclude.concat('build/**'),
    coverage: {
      include: coverageInclude,
      all: true,
    },
  },
})
