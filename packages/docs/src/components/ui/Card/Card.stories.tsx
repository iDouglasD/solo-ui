import { Card } from '@solo-ui/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <Card.Header
        title="git — conventional commits"
        description="// o custo real de um histórico de git bagunçado"
      />
      <Card.Content>
        <p className="text-muted text-xs">Conteúdo livre do card.</p>
      </Card.Content>
      <Card.Footer>5 commits</Card.Footer>
    </Card>
  ),
}

export const SemFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <Card.Header
        title="git — conventional commits"
        description="// o custo real de um histórico de git bagunçado"
      />
      <Card.Content>
        <p className="text-muted text-xs">Card sem footer.</p>
      </Card.Content>
    </Card>
  ),
}

export const SemDescricao: Story = {
  render: () => (
    <Card className="max-w-sm">
      <Card.Header title="apenas título" />
      <Card.Content>
        <p className="text-muted text-xs">Header sem description.</p>
      </Card.Content>
    </Card>
  ),
}
