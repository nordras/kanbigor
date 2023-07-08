import { useEffect, useMemo, useState } from 'react';
import { Task, TaskContainer } from './components/Task/Index'
import { task, taskStack } from './types'
import { getTasks } from './service/api'
import { moveTask, splitByStatus } from './utils'
import Title from 'antd/es/typography/Title';
// import Experiment from './components/Experiment'

// DragDrop Part
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
// DragSortable
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';



function App() {
  const ini: taskStack = { todo: [], inprogres: [], review: [], done: [] }
  const [stacks, setStaks] = useState<taskStack>(ini)
  const [plain, setPlain] = useState<task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const strategy = verticalListSortingStrategy

  useEffect(() => {
    getTasks().then(result => {
      setPlain(result)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setStaks(splitByStatus([...plain]))
  }, plain)

  const containers = useMemo(() => Object.keys(stacks), [stacks])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );


  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    console.log(`active.id: ${active.id} over?.id: ${over?.id}`)

    // if same id
    if (over?.id === active?.id) return

    if (over?.id && active?.id && stacks) {
      const virtStack: taskStack = { ...stacks }
      const target = over.id
      const taskId = active.id;

      moveTask(virtStack, target, taskId)
      setStaks(virtStack)
    }
  }

  return (
    <>
      <main className="container mx-auto px-4">
        <Title className='text-center mt-2'>Kanbam</Title>
        <section className='flex w-full gap-4 ml-4 mr-4'>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={containers} strategy={strategy} >
              <TaskContainer id={'todo'} title={'Todo'} loading={loading}>
                <SortableContext items={stacks.todo} strategy={strategy} >
                  {stacks.todo?.map(tdata =>
                    <Task {...tdata} id={tdata.id} key={tdata.id} />
                  )}
                </SortableContext>
              </TaskContainer>

              <TaskContainer id={'inprogres'} title={'In progress'} loading={loading}>
                <SortableContext items={stacks.inprogres} strategy={strategy} >
                  {stacks.inprogres?.map(tdata =>
                    <Task {...tdata} id={tdata.id} key={tdata.id} />
                  )}
                </SortableContext>
              </TaskContainer>

              <TaskContainer id={'review'} title={'In Review'} loading={loading}>
                <SortableContext items={stacks.review} strategy={strategy} >
                  {stacks.review?.map(tdata =>
                    <Task {...tdata} id={tdata.id} key={tdata.id} />
                  )}
                </SortableContext>
              </TaskContainer>

              <TaskContainer id={'done'} title={'Done'} loading={loading}>
                <SortableContext items={stacks.done} strategy={strategy} >
                  {stacks.done?.map(tdata =>
                    <Task {...tdata} id={tdata.id} key={tdata.id} />
                  )}
                </SortableContext>
              </TaskContainer>

            </SortableContext>
          </DndContext>
        </section>
      </main>
    </>
  )
}

export default App
