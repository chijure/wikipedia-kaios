import { useState, useEffect } from 'preact/hooks'
import { search } from '../api/index'

export const useSearch = (lang: string, initialQuery: string) => {
  const [query, setQuery] = useState(initialQuery)

  const [searchResults, setSearchResults] = useState(undefined)
  const [loading, setLoading] = useState(false)

  // @ts-ignore
  useEffect(() => {
    if (query && query.trim()) {
      setLoading(true)
      const [request, abort] = search(lang, query.trim())

      if (request instanceof Promise) {
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
