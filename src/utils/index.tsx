import { arrayMove } from '@dnd-kit/sortable'
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

// Retorna key de uma lista da lista que contém task
export function findListKey(stacks: taskStack, id: string) {
	for (const key in stacks) {
		const item = stacks[key as keyof taskStack].find((item: task) => item.id === id);
		if (item) {
			return key as keyof taskStack;
		}
	}
}

export function moveTask(
	taskStack: taskStack,
	target: string | number,
	taskId: string | number
) {

	const activeStackKey = findListKey(taskStack, taskId as string)

	if (!activeStackKey) return

	const currentIndex = taskStack[activeStackKey].findIndex((task: task) => task.id === taskId);

	if (Number(target) && Number(target)) {
		// Dropped between tasks
		const nextStack = findListKey(taskStack, target as string)

		if (nextStack) {
			const nextIndex = taskStack[nextStack].findIndex((task: task) => task.id === target);
			const [task] = taskStack[activeStackKey].splice(currentIndex, 1);
			taskStack[nextStack].splice(nextIndex, 0, task)
		}

	} else {
		// dropped in a container
		const currentIndex = taskStack[activeStackKey].findIndex((task: task) => task.id === taskId);
		const [task] = taskStack[activeStackKey].splice(currentIndex, 1);
		taskStack[target as keyof taskStack].push(task)
	}
	
	return taskStack
}