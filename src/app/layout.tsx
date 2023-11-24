'use client'
import { useEffect, useState } from 'react'
import { Navbar, Sidebar } from '@/components'
import cx from 'classnames'
import './globals.css'
import useFileStore from '@/app/_store/fileStore'

interface IProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: IProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { fetchFiles } = useFileStore()

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <html lang="en">
      <body className="w-full min-h-screen">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="relative grid grid-cols-1">
          <Sidebar open={sidebarOpen} />
          <div
            className={cx(
              `${sidebarOpen ? 'pl-[320px] pr-4 py-4' : 'p-4'}`,
              'transition-all .3s ease-in-out translate-x-0'
            )}>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
