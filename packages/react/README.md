# @solo-ds/ui

Biblioteca de componentes React do design system **solo-ui**.

- Documentação (Storybook): https://idouglasd.github.io/solo-ui/

## Instalação

> O `@solo-ds/ui` depende de tokens (CSS variables). Instale também `@solo-ds/tokens`.

```bash
npm install @solo-ds/ui @solo-ds/tokens
```

## Setup (CSS)

Importe os estilos no global.css ou equivalente.

```css
@import '@solo-ds/tokens/styles/tokens.css';
@import '@solo-ds/ui/styles.css';
```

## Uso

```tsx
import { Button } from '@solo-ds/ui'

export function App() {
  return <Button variant="primary">Click me</Button>
}
```

## Requisitos

- React `>=18`
- React DOM `>=18`

## Licença

MIT
