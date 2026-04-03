import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeader, TableRow } from '@solo-ui/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table className="w-2xl">
      <TableHeader title="deployments" description="// active services across environments" />
      <TableHead>
        <TableRow hoverable={false}>
          <TableHeadCell>service</TableHeadCell>
          <TableHeadCell>status</TableHeadCell>
          <TableHeadCell>env</TableHeadCell>
          <TableHeadCell>updated</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>api-gateway</TableCell>
          <TableCell>running</TableCell>
          <TableCell>prod</TableCell>
          <TableCell>2m ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>auth-service</TableCell>
          <TableCell>pending</TableCell>
          <TableCell>prod</TableCell>
          <TableCell>5m ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>worker</TableCell>
          <TableCell>failed</TableCell>
          <TableCell>staging</TableCell>
          <TableCell>12m ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithoutHeader: Story = {
  render: () => (
    <Table className="w-2xl">
      <TableHead>
        <TableRow hoverable={false}>
          <TableHeadCell>service</TableHeadCell>
          <TableHeadCell>status</TableHeadCell>
          <TableHeadCell>env</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>api-gateway</TableCell>
          <TableCell>running</TableCell>
          <TableCell>prod</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>auth-service</TableCell>
          <TableCell>pending</TableCell>
          <TableCell>staging</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <Table className="w-2xl">
      <TableHeader title="deployments" description="// status with badge composition" />
      <TableHead>
        <TableRow hoverable={false}>
          <TableHeadCell>service</TableHeadCell>
          <TableHeadCell>status</TableHeadCell>
          <TableHeadCell>env</TableHeadCell>
          <TableHeadCell>updated</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>api-gateway</TableCell>
          <TableCell>
            <Badge variant="success">running</Badge>
          </TableCell>
          <TableCell>prod</TableCell>
          <TableCell>2m ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>auth-service</TableCell>
          <TableCell>
            <Badge variant="warning" dot>
              pending
            </Badge>
          </TableCell>
          <TableCell>prod</TableCell>
          <TableCell>5m ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>worker</TableCell>
          <TableCell>
            <Badge variant="danger">failed</Badge>
          </TableCell>
          <TableCell>staging</TableCell>
          <TableCell>12m ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
