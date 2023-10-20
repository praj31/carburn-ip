'use client'
import cx from 'classnames'

interface IProps {
  open: boolean
}

export const Sidebar = ({ open }: IProps) => {
  return (
    <div
      className={cx(
        'fixed h-[calc(100vh_-_54px)] w-[300px] flex flex-col border-r border-solid border-gray-200 transform transition-transform .3s ease-in-out p-4 top-54 left-0 z-2',
        `${open ? 'translate-x-0' : '-translate-x-full'}`
      )}>
      Sidebar
    </div>
  )
}
