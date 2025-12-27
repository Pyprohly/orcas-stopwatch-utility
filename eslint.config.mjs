
import { defineConfig } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import useClientPlugin from '@naverpay/eslint-plugin-use-client'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'use-client': useClientPlugin,
    },
    "rules": {
      "no-var": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      'use-client/use-client-hook': 'warn',
      'use-client/browser-api': 'warn',
      'use-client/event-handler': 'warn',
    },
  },
])

export default eslintConfig
