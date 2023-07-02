import { task, taskStack } from '../types'


export function splitByStatus(list: task[]) {
	const stacks: taskStack = {
		todo: [],
		inprogres: [],
		review: [],
		done: []
	}

	list.forEach(tdata => {
		const state = tdata.state
		if (stacks[state as keyof taskStack]) {
			stacks[state as keyof taskStack].push(tdata)
		}
	})
	return stacks
}

export function moveTask(
	stacks: taskStack,
	targetStack: keyof taskStack,
	taskId: string
) {
	let sourceStack: keyof taskStack | undefined;

	console.log(stacks, targetStack, taskId)

	for (const stackName in stacks) {

		const stack = stacks[stackName as keyof taskStack];
		const taskIndex = stack.findIndex(task => task.id === taskId);

		if (taskIndex !== -1) {
			sourceStack = stackName as keyof taskStack;
			const [removedItem] = stack.splice(taskIndex, 1);
			removedItem.state = targetStack;
			stacks[targetStack].push(removedItem);
			break;
		}
	}

	if (!sourceStack) {
		console.error('Item not found');
	}

	return stacks;
}