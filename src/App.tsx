import { useEffect, useState } from 'react';
import { task, Task, TaskContainer } from './components/Task/Index'
// DragDrop Part
import { DragDropContext } from 'react-beautiful-dnd'
import Title from 'antd/es/typography/Title';

// TODO move it to a util or service layer
async function getTasks(): Promise<task[]> {
  const apiUrl = "https://5da4daf857f48b0014fba3e4.mockapi.io/v1/task"
  const response = await fetch(apiUrl);
  const jsonData: task[] = await response.json();
  return jsonData;
}

// TODO temporary interface, it must be done in the api
interface taskStack {
  todo: task[],
  inprogres: task[],
  review: task[],
  done: task[]
}

// TODO temporary function, it must be done in the api
function splitByStatus(list: task[]) {
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

  ondragend = result => {
    console.log(result)
  }

  return (
    <>
      <main className="min-h-screen min-w-screen">
        <Title className='text-center mt-2'>Kanbam</Title>
        <DragDropContext onDragEnd={ondragend}>
          <section className='flex w-full gap-4 ml-4 mr-4'>
            <TaskContainer title={'Todo'} loading={loading}>
              {stacks?.todo?.map(tdata =>
                <Task {...tdata} />
              )}
            </TaskContainer>
            <TaskContainer title={'In Progress'} loading={loading}>
              {stacks?.inprogres?.map(tdata =>
                <Task {...tdata} />
              )}
            </TaskContainer>
            <TaskContainer title={'In Review'} loading={loading}>
              {stacks?.review?.map(tdata =>

                <Task {...tdata} />

              )}
            </TaskContainer>
            <TaskContainer title={'Done'} loading={loading}>
              {stacks?.done?.map(tdata =>
                <Task {...tdata} />
              )}
            </TaskContainer>
          </section>
        </DragDropContext>
      </main>
    </>
  )
}

export default App
