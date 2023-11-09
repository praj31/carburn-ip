'use client'
import cx from 'classnames'

interface IProps {
  open: boolean
}

const links = ['Dashboard', 'UI Elements', 'Report Generator', 'Database']

export const Sidebar = ({ open }: IProps) => {
  return (
    <div
      className={cx(
        'fixed h-[calc(100vh_-_54px)] w-[300px] flex flex-col border-r border-solid border-gray-200 transform transition-transform .3s ease-in-out p-4 top-54 left-0 z-10',
        `${open ? 'translate-x-0' : '-translate-x-full'}`
      )}>
      <ul className="p-4">
        {links.map((link, idx) => (
          <li
            key={idx}
            className="rounded-full mb-4 font-normal hover:cursor-pointer hover:font-semibold">
            {link}
          </li>
        ))}
      </ul>
    </div>
  )
}
