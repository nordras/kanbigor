import { Card, Skeleton } from 'antd'
import Meta from 'antd/es/card/Meta'
import { task, taskContainer } from '../../types'
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';

export function TaskContainer({ id, title, children, loading }: taskContainer) {

  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const bg = isOver ? 'bg-emerald-100' :'bg-gray-100';

  const classes = `relative w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-4 ${bg} rounded-lg text-sky-400`

  return (
    <section key={id} ref={setNodeRef} className={classes}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
      {loading && <LoadingTask loading={loading} />} 
    </section>
  )
}

export function Task({ title, description, id }: task) {

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999,
  } : { position: 'relative' };

  return (
    <Card ref={setNodeRef} key={id} title={title} className={`cursor-pointer mb-2 ${isDragging ? 'z-1': 'z-0'}` } style={style} {...listeners} {...attributes}>
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