import { useState, useEffect } from 'preact/hooks'
import { search } from '../api/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSearch = (lang: string, initialQuery: string) => {
  const [query, setQuery] = useState(initialQuery)

  const [searchResults, setSearchResults] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query && query.trim()) {
      setLoading(true)
      const [request, abort] = search(lang, query.trim())

      if (request instanceof Promise) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        request.then((data: any) => {
          setLoading(false)
          setSearchResults(data)
        })
        return abort
      }
    } else {
      setLoading(false)
      setSearchResults(undefined)
    }
  }, [lang, query])

  return [setQuery, searchResults, loading]
}
