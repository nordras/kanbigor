import { useCallback, useEffect, useMemo, useState } from 'react';
import { Task, TaskContainer } from './components/Task/Index'
import { task, taskStack } from './types'
import { deleteTask, getTasks, postTask } from './service/api'
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
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import AddTaskModal from './components/AddTask';



function App() {
  const ini: taskStack = { todo: [], inprogres: [], review: [], done: [] }
  const [stacks, setStacks] = useState<taskStack>(ini)
  const [loading, setLoading] = useState<boolean>(true)
  const strategy = verticalListSortingStrategy

  const fetchTasks = async () => {
    try {
      const result = await getTasks();
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

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );


  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    // if same id
    if (over?.id === active?.id) return

    if (over?.id && active?.id && stacks) {
      const virtStack: taskStack = { ...stacks }
      const target = over.id
      const taskId = active.id;

      moveTask(virtStack, target, taskId)
      setStacks(virtStack)
    }
  }

  // Delete a task
  function addTask(task: task) {
    const data = {...task}
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={containers} strategy={horizontalListSortingStrategy} >

              <TaskContainer id={'todo'} title={'Todo'} loading={loading}>
                <SortableContext items={stacks.todo} strategy={verticalListSortingStrategy} >
                  {stacks.todo?.map(tdata =>
                    <Task {...tdata} key={tdata.id} handleDelete={removeTask} />
                  )}
                </SortableContext>
              </TaskContainer>

              <TaskContainer id={'inprogres'} title={'In progress'} loading={loading}>
                <SortableContext items={stacks.inprogres} strategy={strategy} >
                  {stacks.inprogres?.map(tdata =>
                    <Task {...tdata} key={tdata.id} />
                  )}
                </SortableContext>
              </TaskContainer>

              <TaskContainer id={'review'} title={'In Review'} loading={loading}>
                <SortableContext items={stacks.review} strategy={strategy} >
                  {stacks.review?.map(tdata =>
                    <Task {...tdata} key={tdata.id} />
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
        <section className='flex w-full gap-4 m-4 mb-12'>
          <AddTaskModal onTaskAdd={(task) => addTask(task)} />
        </section>
      </main>
    </>
  )
}

export default App
