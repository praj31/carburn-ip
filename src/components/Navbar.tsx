import { Dispatch, SetStateAction } from 'react'

interface IProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export const Navbar = ({ setSidebarOpen }: IProps) => {
  return (
    <header className="w-full h-[54px] flex justify-between items-center border-b border-solid border-gray-200 px-4 py-2">
      <div className="flex items-center">
        <div
          className="cursor-pointer"
          role="button"
          onClick={() => setSidebarOpen((prev) => !prev)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            viewBox="0 0 448 512"
            className="w-[24px] h-[24px]">
            <path
              fill="currentColor"
              d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"></path>
          </svg>
        </div>
        <div className="ml-4">Alchimetis</div>
      </div>
      <div>Settings</div>
    </header>
  )
}
