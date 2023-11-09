'use client'

import useFileStore from '@/app/_store/fileStore'
import axios from 'axios'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function Database() {
  const files = useFileStore(useShallow((state) => state.files))
  const { fetchFiles } = useFileStore()

  const uploadRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [selectedFile, setSelectedFile] = useState<any>()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedFile) {
      alert('Please select a file to upload!')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('http://localhost:4000/upfile', formData)
      if (response.status == 201) {
        fetchFiles()
      }
      setSelectedFile(null)
      formRef.current?.reset()
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Database</h2>

      <form ref={formRef} onSubmit={handleSubmit} className="mb-4">
        <div
          onClick={() => uploadRef.current?.click()}
          className="w-full flex flex-col items-center bg-violet-50 text-violet-700 rounded-lg p-4 mb-2 hover:cursor-pointer">
          <input
            ref={uploadRef}
            className="hidden"
            type="file"
            accept=".csv"
            name="file"
            onChange={handleFileChange}
          />
          {!selectedFile && <span>Choose a file to upload</span>}
          {selectedFile && selectedFile.name}
        </div>

        <button
          type="submit"
          className="w-full bg-violet-700 text-violet-50 rounded-lg p-2 mb-2 hover:bg-violet-600">
          Upload
        </button>
      </form>

      <div className="w-full">
        <h3 className="text-xl font-bold mb-4">List of Files</h3>

        {files.length > 0 &&
          files.map((filename, idx) => (
            <div key={idx} className="bg-violet-50 text-violet-700 rounded-lg p-4 mb-2">
              {filename}
            </div>
          ))}
        {files.length == 0 && <p>Database is empty. Try uploading files.</p>}
      </div>
    </div>
  )
}
