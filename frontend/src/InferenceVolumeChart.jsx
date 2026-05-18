import { BarChart3 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card } from './components'
import { ticketAPI } from './client'

export function InferenceVolumeChart() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ticketAPI.getInferenceVolume7d()
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchData()
  }, [])

  if (error) {
    return <div className="text-sm text-red-600">Failed to load chart</div>
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <Card title="Inference Volume (7D)" subtitle="">
      <div className="flex items-end justify-between gap-1" style={{ height: '120px' }}>
        {data.map((item) => {
          const height = (item.count / maxCount) * 100
          return (
            <div key={item.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-sky-400 to-sky-300"
                style={{ height: `${Math.max(height, 5)}%` }}
              />
              <span className="text-xs text-slate-500">{item.date.slice(5)}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
