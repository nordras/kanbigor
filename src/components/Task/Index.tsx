import { Card, Skeleton } from 'antd'
import Meta from 'antd/es/card/Meta'
import { task, taskContainer } from '../../types'

export function TaskContainer(props: taskContainer) {
  const { id, title, children, loading } = props
  // const bg = isOver ? 'bg-emerald-100' : 'bg-gray-100'; // ${bg} 

  const classes = `dragZone relative w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-4 rounded-lg text-sky-400 bg-gray-100`

  // Drag and Drop Properties
  const {
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop } = props

  return (
    <section id={id} className={classes}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
      {loading && <LoadingTask loading={loading} />}
    </section>
  )
}

export function Task(props: task) {
  const { title, description, id, handleDelete } = props
  // const {
  //   attributes,
  //   isDragging,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  // } = useSortable({id: id});

  // const style = transform ? {
  //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //   transition,
  //   zIndex: 9999,
  // } : { position: 'relative' };
  const btnSt = 'bg-red-400 z-999 hover:bg-red-500 text-white font-bold py-1 px-2 rounded mt-4'

  function deleteTask() {
    if (handleDelete)
      handleDelete(id);
  }



  // ref={setNodeRef} 
  // ${isDragging ? 'z-1': 'z-0'}

  // Drag and Drop Properties
  const {
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop } = props

  return (
    <Card
      key={`card-${id}`}
      title={title}
      className={`cursor-pointer mb-2`}
      draggable
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragStart={onDragStart}
    >
      <article>{description}</article>
      <button className={btnSt} onClick={deleteTask}>⌫</button>
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