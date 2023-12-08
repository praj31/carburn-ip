'use client'

import React from 'react'
import useAuthStore from '@/app/_store/authStore'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()
  const { setLoggedIn } = useAuthStore()

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoggedIn(true)
    router.push('/dashboard')
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-purple-100">
      <div className="w-full max-w-md p-4 bg-white shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              name="username"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 focus:outline-none focus:ring focus:border-purple-400"
            onClick={(e) => handleSubmit(e)}>
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}
