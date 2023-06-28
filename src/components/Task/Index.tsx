import { Card, Skeleton } from 'antd'
import Meta from 'antd/es/card/Meta'
import { ReactNode } from 'react'
import { Droppable } from 'react-beautiful-dnd'

/* 
  Note,
  I'm assuming based on the communities standards that the 
  interfaces and 
 */

export interface task {
  title: string
  description: string
  state: string

}

export interface taskContainer {
  title: string
  children?: ReactNode
  loading: boolean
}


export function TaskContainer({ title, children, loading }: taskContainer) {
  return (
    <Droppable droppableId={title.toLocaleLowerCase()}>
      {
        (provided) => (
          <section className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-4 bg-gray-100 rounded-lg text-sky-400">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            {children}
            {loading && <LoadingTask loading={loading} />}
          </section>
        )
      }
    </Droppable>
  )
}

export function Task({ title, description }: task) {
  return (
    <Card title={title} bordered={false} className='cursor-pointer mb-2'>
      <article>{description}</article>
    </Card>
  )
}

function LoadingTask({ loading }: { loading: boolean }) {
  return (
    <Card>
      <Skeleton loading={loading} active>
        <Meta
          title="Card title"
          description="This is the description"
        />
      </Skeleton>
    </Card>
  )
}