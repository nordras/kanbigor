import type { Meta, StoryObj } from '@storybook/react';

import { TaskContainer } from './Index.tsx';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof TaskContainer> = {
  component: TaskContainer,
};

export default meta;
type Story = StoryObj<typeof TaskContainer>;

export const TaskStory: Story = {
  args: {
    id: 'todo',
    title: 'To do',
    children: 'Children',
    loading: false
  }
};