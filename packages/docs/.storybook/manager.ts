import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

const darkTheme = create({
  base: 'dark',
  colorPrimary: '#00ff41',
  colorSecondary: '#00ff41',
  appBg: '#111111',
  appContentBg: '#0d0d0d',
  appPreviewBg: '#111111',
  appBorderColor: '#222222',
  textColor: '#cccccc',
  textMutedColor: '#888888',
  barBg: '#111111',
  barTextColor: '#888888',
  barSelectedColor: '#00ff41',
  barHoverColor: '#cccccc',
  inputBg: '#1a1a1a',
  inputBorder: '#222222',
  inputTextColor: '#cccccc',
})

addons.setConfig({
  theme: darkTheme,
})
