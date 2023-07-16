import { useEffect, useMemo, useState } from 'react';
import { Task, TaskContainer } from './components/Task/Index'
import { task, taskStack } from './types'
import { deleteTask, getTasks, postTask } from './service/api'
import { findListKey, formatCamelCase, splitByStatus } from './utils'
import Title from 'antd/es/typography/Title';
import AddTaskModal from './components/AddTask';



function App() {
  const ini: taskStack = { todo: [], inprogres: [], review: [], done: [] }
  const [stacks, setStacks] = useState<taskStack>(ini)
  const [loading, setLoading] = useState<boolean>(true)

  const [draggedTask, setDraggedTask] = useState<String | null>(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);
  const [draggedOverTask, setDraggedOverTask] = useState<String | null>(null);
  const [draggedStackedId, setDraggedStackedId] = useState<String | null>(null);

  const [nextStack, setNextStack] = useState<String | null>(null);

  // Drag and drop Functions
  const handleDragStart = (taskId: string, stackKey: keyof taskStack, index: number) => {
    console.log('dragStart', taskId, stackKey)
    setDraggedTaskIndex(index);
    setDraggedTask(taskId);
    setDraggedStackedId(stackKey);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>, overTaskId: string | null) => {
    event.stopPropagation()
    console.log('handleDragEnterEvent over task', overTaskId)
    if (draggedTask && draggedTask !== overTaskId) {
      setDraggedOverTask(overTaskId);
    }
  };

  const handleDragLeave = () => {
    console.log('handleDragLeave')
    setDraggedOverTask(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, key: string) => {
    event.preventDefault();
    setNextStack(key)
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, nextStackID: string) => {
    // Is being dragged to the same stack
    if (!draggedTask && !draggedStackedId) return

    const virtStack: taskStack = { ...stacks }

    // Is being Dragged to a different column
    if (nextStackID !== draggedStackedId) {

      const stack = virtStack[draggedStackedId as keyof taskStack]
      const currentIndex = draggedTaskIndex

      if (currentIndex === undefined) {
        console.error(currentIndex, event)
        return
      }

      const [movedStack] = stack.splice(currentIndex as number, 1);

      let nextStack;

      if (Number(nextStackID)) {
        const key = findListKey(virtStack, nextStackID as string)
        nextStack = virtStack[key as keyof taskStack]
      } else {
        nextStack = virtStack[nextStackID as keyof taskStack]
      }

      if (!movedStack) return

      // Drooped over a task
      if (draggedOverTask) {
        const nextIndex = nextStack.findIndex((task: task) => task.id === draggedOverTask);
        nextStack.splice(nextIndex, 0, movedStack)
        setStacks(virtStack)
      } else {
        nextStack.push(movedStack)
        console.log(nextStack)
        setStacks(virtStack)
      }
    }


    setDraggedTask(null)
    setDraggedOverTask(null)
    setDraggedStackedId(null)

  };

  // End Drag and drop Functions
  const fetchTasks = async () => {
    try {
      const result = await getTasks();
      setStacks(ini);
      setStacks(splitByStatus(result));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  const containers = useMemo(() => Object.keys(stacks), [stacks])

  // Delete a task
  function addTask(task: task) {
    const data = { ...task }
    postTask(data)
    fetchTasks()
  }

  function removeTask(id: string) {
    deleteTask(id)
    fetchTasks()
  }

  return (
    <>
      <main className="container mx-auto px-4">
        <Title className='text-center mt-2'>Kanbam</Title>
        <section className='flex w-full gap-4 ml-4 mr-4'>
          {
            containers.map((key) => (
              <TaskContainer
                key={`container-${key}`}
                id={key}
                title={formatCamelCase(key)}
                loading={loading}
                // onDragEnter={() => handleDragEnter(null)}
                onDragOver={(event) => handleDragOver(event, key)}
                onDragLeave={handleDragLeave}
                onDrop={(event) => handleDrop(event, key)}
              >
                {stacks[key as keyof taskStack].map((tdata, index) =>
                (tdata && <Task
                  {...tdata}
                  key={tdata?.id}
                  onDrop={(event) => handleDrop(event, tdata.id)}
                  onDragEnter={(event) => handleDragEnter(event, tdata.id)}
                  onDragStart={() => handleDragStart(tdata.id, key as keyof taskStack, index)}
                  handleDelete={removeTask}
                />)
                )}
              </TaskContainer>
            ))
          }

        </section>
        <section className='flex w-full gap-4 m-4 mb-12'>
          <AddTaskModal onTaskAdd={(task) => addTask(task)} />
        </section>
      </main>
    </>
  )
}

export default App