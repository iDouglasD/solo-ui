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
        description="// the real cost of a messy git history"
      />
      <Card.Content>
        <p className="text-muted text-xs">Free card content.</p>
      </Card.Content>
      <Card.Footer>5 commits</Card.Footer>
    </Card>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <Card.Header
        title="git — conventional commits"
        description="// the real cost of a messy git history"
      />
      <Card.Content>
        <p className="text-muted text-xs">Card without footer.</p>
      </Card.Content>
    </Card>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <Card className="max-w-sm">
      <Card.Header title="title only" />
      <Card.Content>
        <p className="text-muted text-xs">Header without description.</p>
      </Card.Content>
    </Card>
  ),
}
