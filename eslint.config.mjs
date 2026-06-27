import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import pluginQuery from '@tanstack/eslint-plugin-query'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  pluginQuery.configs['flat/recommended'],
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ]),
  {
    rules: {
      // Tắt hoàn toàn cảnh báo khi sử dụng kiểu "any"
      '@typescript-eslint/no-explicit-any': 'off',
      'react-refresh/only-export-components': 'off',
      'no-empty-pattern': 'off'
    }
  }
])

export default eslintConfig
