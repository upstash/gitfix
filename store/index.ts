import { create } from 'zustand'

import { Profile, Repository } from 'lib/types'

export interface StoreState {
  loadingUser: boolean
  setLoadingUser: (state: boolean) => void
  user: Profile | undefined
  setUser: (user: Profile | undefined) => void
  repos: Repository[]
  setRepos: (repos: Repository[]) => void
  hasRepos: () => boolean
  //
  query: string
  setQuery: (query: string) => void
  repo: Repository | undefined
  setRepo: (repo: Repository | undefined) => void
  //
  fixRepo: (username: string, repo: string) => Promise<void>
  streamText: string
  setStreamText: (text: string) => void
  isStream: boolean
  setStream: (state: boolean) => void
  isFinish: boolean
  setFinish: (state: boolean) => void
  //
  onReset: () => void
}

const store = create<StoreState>((set, get) => ({
  loadingUser: false,
  setLoadingUser: (state) => set({ loadingUser: state }),
  repos: [],
  setRepos: (repos) => set({ repos }),
  hasRepos: () => get().repos.length > 0,
  user: undefined,
  setUser: (user) => set({ user }),
  //
  query: '',
  setQuery: (query) => set({ query }),
  repo: undefined,
  setRepo: (repo) => set({ repo }),
  //
  streamText: '',
  setStreamText: (text) => set({ streamText: text }),
  isStream: false,
  setStream: (state) => set({ isStream: state }),
  isFinish: false,
  setFinish: (state) => set({ isFinish: state }),
  onReset: () => {
    set({
      repos: [],
      user: undefined,
      query: '',
      repo: undefined,
      streamText: '',
      isStream: false,
      isFinish: false,
    })
  },
  fixRepo: async (owner: string, repo: string) => {
    try {
      set({
        streamText: '',
        isStream: true,
      })

      const response = await fetch(`/api/gitfix?owner=${owner}&repo=${repo}`)

      if (!response.body) {
        return alert('No response from server')
      }

      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          set({ isStream: false })
          break
        }
        const decoder = new TextDecoder()
        const a = decoder.decode(value)
        set((state) => ({ streamText: state.streamText + a }))
      }
    } catch (error) {
      console.error(error)
    } finally {
      set({ isStream: false })
    }
  },
}))

export default store
