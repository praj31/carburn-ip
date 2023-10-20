'use client'
import type { Metadata } from 'next'
import { useState } from 'react'
import { Navbar, Sidebar } from '@/components'
import cx from 'classnames'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page Description',
}

interface IProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: IProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
