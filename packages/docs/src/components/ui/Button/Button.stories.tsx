import { Button } from '@solo-ui/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>$ submit</Button>,
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Button variant="primary">$ primary</Button>
      <Button variant="destructive">$ destructive</Button>
      <Button variant="secondary">$ secondary</Button>
      <Button variant="outline">$ outline</Button>
      <Button variant="ghost">$ ghost</Button>
      <Button variant="link">$ link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">$ small</Button>
      <Button size="md">$ medium</Button>
      <Button size="lg">$ large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button
        variant="outline"
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        }
      >
        $ configure
      </Button>
      <Button
        variant="primary"
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
      >
        $ deploy
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary" loading>$ processing</Button>
      <Button variant="destructive" loading>$ deleting</Button>
      <Button variant="outline" loading>$ loading</Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary" disabled>$ submit</Button>
      <Button variant="destructive" disabled>$ delete</Button>
      <Button variant="outline" disabled>$ configure</Button>
    </div>
  ),
}
