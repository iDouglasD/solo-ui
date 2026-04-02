import { Badge } from '@solo-ui/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
    },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    variant: 'default',
    dot: false,
    children: 'badge',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">default</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="warning">warning</Badge>
      <Badge variant="danger">danger</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default" dot>
        default
      </Badge>
      <Badge variant="success" dot>
        success
      </Badge>
      <Badge variant="warning" dot>
        pending
      </Badge>
      <Badge variant="danger" dot>
        error
      </Badge>
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <p className="font-mono text-sm text-primary">
      Deploy status: <Badge variant="success">deployed</Badge> — last run 2m ago.
    </p>
  ),
}
