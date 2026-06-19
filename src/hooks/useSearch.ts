import { useEffect, useRef, useState } from 'react'
import type { Item } from '../types'

// Uncomment this import when you are ready to wire up the search logic:
import { searchItems } from '../services/mockApi'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
const mountedRef = useRef(true)

  // ── TODO: Implement debounced async search ──────────────────────────────

  useEffect(() => {
  mountedRef.current = true

  const currentRequestId = ++requestIdRef.current

  const timer = setTimeout(async () => {
    if (!mountedRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await searchItems(query)

      if (
        mountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        setResults(data)
      }
    } catch (err) {
      if (
        mountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong'
        )
      }
    } finally {
      if (
        mountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        setIsLoading(false)
      }
    }
  }, 300)

  return () => {
    clearTimeout(timer)
    mountedRef.current = false
  }
}, [query])

  return { query, setQuery, results, isLoading, error }
}
