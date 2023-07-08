import { useEffect, useState } from 'react';
import { Task, TaskContainer } from './components/Task/Index'
import { task, taskStack } from './types'
import { getTasks } from './service/api'
import { moveTask, splitByStatus } from './utils'
import Title from 'antd/es/typography/Title';
import Experiment from './components/Experiment'
// DragDrop Part
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
// DragSortable
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';



function App() {
  const ini: taskStack = {todo: [], inprogres: [], review: [], done: []}
  const [stacks, setStaks] = useState<taskStack>(ini)
  const [plain, setPlain] = useState<task[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getTasks().then(result => {
      setPlain(result)
      const data = splitByStatus(result)
      setLoading(false)
      setStaks(data)
    })
  }, [])

  function handleDragEnd(event: { active: any; over: any; }) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setPlain((plain) => {
        const oldIndex = plain.findIndex(task => task.id === active.id);
        const newIndex = plain.findIndex(task => task.id === over.id);
        
        return arrayMove(plain, oldIndex, newIndex);
      });
    }
  }

  // function handleDragEnd(event: DragEndEvent) {
  //   console.log(event)    
  //   const { over, active } = event;
  //   if (over?.id && active?.id && stacks) {
  //     const virtStack: taskStack = { ...stacks }
  //     const taskId = active.id as string;
  //     const targetStack: keyof taskStack = over.id as keyof taskStack
  //     moveTask(virtStack, targetStack, taskId)
  //     setStaks(virtStack)
  //   }
  // }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <main className="container mx-auto px-4">
        <Title className='text-center mt-2'>Kanbam</Title>
        <Experiment />
        <section className='flex w-full gap-4 ml-4 mr-4'>
          <DndContext sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={plain}
              strategy={verticalListSortingStrategy}
            >
              <TaskContainer id={'todo'} title={'Todo'} loading={loading}>
                {plain?.map(tdata =>
                  <Task {...tdata} id={tdata.id} key={tdata.id} />
                )}
              </TaskContainer>
            </SortableContext>
            {/* <TaskContainer id={'inprogres'} title={'In Progress'} loading={loading}>
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
            </TaskContainer> */}
          </DndContext>
        </section>
      </main>
    </>
  )
}

export default App
