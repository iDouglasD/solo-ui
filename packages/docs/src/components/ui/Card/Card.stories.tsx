import { Card, CardContent, CardFooter, CardHeader } from '@solo-ui/ui'
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
    <Card className="w-2xl">
      <CardHeader
        title="git — conventional commits"
        description="// the real cost of a messy git history"
      />
      <CardContent>
        <p className="text-muted text-xs">Free card content.</p>
      </CardContent>
      <CardFooter>5 commits</CardFooter>
    </Card>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-2xl">
      <CardHeader
        title="git — conventional commits"
        description="// the real cost of a messy git history"
      />
      <CardContent>
        <p className="text-muted text-sm">Card without footer.</p>
      </CardContent>
    </Card>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <Card className="w-2xl">
      <CardHeader title="title only" />
      <CardContent>
        <p className="text-muted text-sm">Header without description.</p>
      </CardContent>
    </Card>
  ),
}
