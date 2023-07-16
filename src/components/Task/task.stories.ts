import type { Meta, StoryObj } from '@storybook/react';

import { Task } from './Index.tsx';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Task> = {
  component: Task,
};

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskStory: Story = {
  args: {
    title: 'Neque porro quisquam est qui',
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pretium justo lorem, et tempor velit aliquam non. Integer laoreet quis velit eu varius. Sed mattis vitae sem ac consectetur. Mauris tempor hendrerit nibh, id imperdiet enim sollicitudin vitae. Nulla enim lectus, dapibus ut tincidunt eu, sollicitudin et ante. Vestibulum nunc sapien, aliquam ut nunc quis, luctus fermentum ante. Duis lobortis risus non quam consequat semper. Curabitur sapien augue, commodo et magna a, convallis pharetra nulla.",
    id: '1', 
    handleDelete: () => {}
  }
};