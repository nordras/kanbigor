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

// MoveTask usage example
// function handleDragEnd(event: any) {
//   const { over, active } = event;
//   // if same id
//   if (over?.id === active?.id) return

//   if (over?.id && active?.id && stacks) {
//     const virtStack: taskStack = { ...stacks }
//     const target = over.id
//     const taskId = active.id;

//     moveTask(virtStack, target, taskId)
//     setStacks(virtStack)
//   }
// }


export function formatCamelCase(camelCaseString: string): string {

	// TODO change object inprogress to camel case
	if (camelCaseString === 'inprogres') {
		return 'In Progress';
	}

	const separatedWords = camelCaseString
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

	const formattedString = separatedWords
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	return formattedString;
}
