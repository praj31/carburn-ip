'use client'

import { FILES_UPLOAD } from '@/app/_api/router'
import useFileStore from '@/app/_store/fileStore'
import axios from 'axios'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function Dashboard() {
  const files = useFileStore(useShallow((state) => state.files))
  const { fetchFiles } = useFileStore()

  useEffect(() => {
    fetchFiles()
  }, [])

  const [selectedFile, setSelectedFile] = useState<any>()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('http://localhost:4000/upfile', formData)

      if (response.status == 200) {
        fetchFiles()
        e.currentTarget.reset()
      }
    } catch (error) {
      alert('An error occurred while uploading files.')
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    </div>
  )
}
