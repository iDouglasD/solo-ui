import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.@(stories.@(ts|tsx)|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    if (config.mode === 'production') {
      config.base = '/solo-ui/'
    }
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@solo-ui/ui': path.resolve(__dirname, '../../react/src/index.ts'),
      },
    }
    return config
  },
}

export default config
