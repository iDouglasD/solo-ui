import { Input, InputField, InputHint, InputLabel } from '@solo-ui/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    size: 'md',
    placeholder: 'Enter value...',
    disabled: false,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input size="sm" placeholder="small" />
      <Input size="md" placeholder="medium" />
      <Input size="lg" placeholder="large" />
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input
        placeholder="Search..."
        leftIcon={
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        }
      />
      <Input
        placeholder="Enter email..."
        leftIcon={
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        }
        rightIcon={
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <InputField>
        <InputLabel htmlFor="default-input">Default</InputLabel>
        <Input id="default-input" placeholder="Enter value..." />
        <InputHint>This is a helper text</InputHint>
      </InputField>

      <InputField state="error">
        <InputLabel htmlFor="error-input">Email</InputLabel>
        <Input id="error-input" defaultValue="invalid@" />
        <InputHint>Invalid email address</InputHint>
      </InputField>

      <InputField state="success">
        <InputLabel htmlFor="success-input">Username</InputLabel>
        <Input id="success-input" defaultValue="john_doe" />
        <InputHint>Username is available</InputHint>
      </InputField>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input disabled placeholder="Disabled input" />
      <Input disabled defaultValue="Readonly value" />
    </div>
  ),
}

export const FullExample: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <InputField state="error">
        <InputLabel htmlFor="email-full">Email</InputLabel>
        <Input
          id="email-full"
          type="email"
          defaultValue="invalid@"
          leftIcon={
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />
        <InputHint>Invalid email address</InputHint>
      </InputField>

      <InputField state="success">
        <InputLabel htmlFor="pass-full">Password</InputLabel>
        <Input
          id="pass-full"
          type="password"
          defaultValue="supersecret"
          leftIcon={
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />
        <InputHint>Strong password</InputHint>
      </InputField>
    </div>
  ),
}
