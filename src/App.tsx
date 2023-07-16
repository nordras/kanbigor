import { useEffect, useMemo, useState } from 'react';
import { Task, TaskContainer } from './components/Task/Index'
import { task, taskStack } from './types'
import { deleteTask, getTasks, postTask } from './service/api'
import { formatCamelCase, splitByStatus } from './utils'
import Title from 'antd/es/typography/Title';
import AddTaskModal from './components/AddTask';

interface Dragged {
  task?: task,
  stackKey: string,
  index?: number
}

function App() {
  const ini: taskStack = { todo: [], inprogres: [], review: [], done: [] }
  const [stacks, setStacks] = useState<taskStack>(ini)
  const [loading, setLoading] = useState<boolean>(true)

  const [dragged, setDragged] = useState<Dragged | null>(null);
  const [draggedOver, setDraggedOver] = useState<Dragged | null>(null);
  const [nextStackKey, setNextStackKey] = useState<String | null>(null);


  // Drag and drop Functions
  const handleDragStart = (stackKey: string, task: task, index: number) => {
    setDragged({ stackKey, task, index });
  };

  // On enter event set a dragged object
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>, stackKey: string, task: task, index: number) => {
    event.stopPropagation()
    const over: Dragged = { stackKey }

    if (dragged?.task?.id !== task.id) {
      console.log(`dragged is different than enter drag`)
      over.index = index
      over.task = task
    }

    console.log(`handle enter over`, over)

    setDraggedOver(over);
  };

  const handleDragLeave = () => {
    // setDraggedOver(null); Hello silcen my old friend
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, key: string) => {
    event.preventDefault();
    if (key) {
      setNextStackKey(key)
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    // Is being dropped to the same stack
    if ((dragged?.task?.id === draggedOver?.task?.id)) return

    const inOtherColumn = dragged?.stackKey !== nextStackKey

    // Stacks
    const virtStack: taskStack = { ...stacks }

    // keys
    const currentStack = virtStack[dragged?.stackKey as keyof taskStack]
    const nextStack = virtStack[nextStackKey as keyof taskStack]

    // Is being Dragged to a different column
    if (inOtherColumn && !draggedOver?.task) {
      console.log('in other column')
      currentStack.splice(dragged?.index as number, 1)
      nextStack.push(dragged?.task as task)
    }

    // Is being Dragged to a different column and Task
    if (inOtherColumn && draggedOver?.task) {
      currentStack.splice(dragged?.index as number, 1)
      nextStack.splice(draggedOver?.index as number, 0, dragged?.task as task);
    }

    // Is being Dragged to the same column and different Task Index
    if (!inOtherColumn && draggedOver?.task) {
      currentStack.splice(dragged?.index as number, 1)
      nextStack.splice(draggedOver?.index as number, 0, dragged?.task as task);
    }

    setStacks(virtStack)
    setDragged(null)
    setDraggedOver(null)
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

  // services funcions
  function addTask(task: task) {
    const data = { ...task }
    postTask(data)
    fetchTasks()
  }

  function removeTask(id: string) {
    deleteTask(id)
    fetchTasks()
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  const containers = useMemo(() => Object.keys(stacks), [stacks])
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
                onDrop={(event) => handleDrop(event)}
              >
                {stacks[key as keyof taskStack].map((tdata, index) =>
                (tdata && <Task
                  {...tdata}
                  key={tdata?.id}
                  onDragEnter={(event) => handleDragEnter(event, key, tdata, index)}
                  onDragStart={() => handleDragStart(key, tdata, index)}
                  onDragLeave={handleDragLeave}
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