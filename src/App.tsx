import { useEffect, useState } from 'react';
import { Task, TaskContainer } from './components/Task/Index'
import { taskStack } from './types'
import { getTasks } from './service/api'
import { moveTask, splitByStatus } from './utils'
import Title from 'antd/es/typography/Title';

// DragDrop Part
import { DndContext, DragEndEvent } from '@dnd-kit/core';

function App() {
  const [stacks, setStaks] = useState<taskStack>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getTasks().then(result => {
      const data = splitByStatus(result)
      setLoading(false)
      setStaks(data)
    })
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (over?.id && active?.id && stacks) {
      const virtStack: taskStack = { ...stacks }
      const taskId = active.id as string;
      const targetStack: keyof taskStack = over.id as keyof taskStack
      moveTask(virtStack, targetStack, taskId)
      setStaks(virtStack)
    }
  }

  return (
    <>
      <main className="container mx-auto px-4">
        <Title className='text-center mt-2'>Kanbam</Title>
        <section className='flex w-full gap-4 ml-4 mr-4'>
          <DndContext onDragEnd={handleDragEnd}>
            <TaskContainer id={'todo'} title={'Todo'} loading={loading}>
              {stacks?.todo?.map(tdata =>
                <Task {...tdata} key={tdata.id} />
              )}
            </TaskContainer>
            <TaskContainer id={'inprogres'} title={'In Progress'} loading={loading}>
              {stacks?.inprogres?.map(tdata =>
                <Task {...tdata} key={tdata.id} />
              )}
            </TaskContainer>
            <TaskContainer id={'review'} title={'In Review'} loading={loading}>
              {stacks?.review?.map(tdata =>
                <Task {...tdata} key={tdata.id} />
              )}
            </TaskContainer>
            <TaskContainer id={'done'} title={'Done'} loading={loading}>
              {stacks?.done?.map((tdata) =>
                <Task {...tdata} key={tdata.id} />
              )}
            </TaskContainer>
          </DndContext>
        </section>
      </main>
    </>
  )
}

export default App
