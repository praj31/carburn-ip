import { create } from 'zustand'
import axios from 'axios'
import { GET_FILES } from '@/app/_api/router'

interface FileStore {
  files: string[]
  setFiles: (files: string[]) => void
  fetchFiles: () => Promise<void>
}

const useFileStore = create<FileStore>((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
  fetchFiles: async () => {
    try {
      const response = await axios.get<string[]>(GET_FILES) // Adjust the endpoint as needed
      set({ files: response.data })
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  },
}))

export default useFileStore
