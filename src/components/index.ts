import { Key } from 'react'

export type TKey = Key | undefined | null

export interface IDefaultProps {
  id?: TKey
  key?: TKey
  className?: string
  style?: React.CSSProperties
}

export interface IDefaultWrapperProps extends IDefaultProps {
  children: React.ReactNode
}

//C
export * from './CombineChart'
// H
export * from './Head'
// P
export * from './PieChart';

