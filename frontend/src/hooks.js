import { useState, useEffect } from 'react'
import { ticketAPI } from './client'

export function useAPIHealth() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await ticketAPI.health()
        setHealth(res.data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setHealth(null)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return { health, loading, error }
}
