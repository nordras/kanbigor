import { ReactNode } from "react"

export interface taskStack {
  todo: task[],
  inprogres: task[],
  review: task[],
  done: task[]
}

export interface task {
  id: string
  title: string
  description: string
  state: string
  index: number
}

export interface taskContainer {
  id: string
  title: string
  children?: ReactNode
  loading: boolean
}
