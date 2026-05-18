import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export const ticketAPI = {
  health: () => apiClient.get('/health'),
  classify: (ticket) =>
    apiClient.post('/api/v1/classify-ticket', { ticket }),
  process: (ticket) =>
    apiClient.post('/api/v1/process-ticket', { ticket }),
  retrievePolicy: (query, intent, topK = 3) =>
    apiClient.post('/api/v1/retrieve-policy', {
      query,
      intent,
      top_k: topK,
    }),
  getIntentAnalytics: () => apiClient.get('/api/v1/analytics/intents'),
  getEscalationAnalytics: () =>
    apiClient.get('/api/v1/analytics/escalations'),
  getEscalationQueue: (limit = 10) =>
    apiClient.get('/api/v1/analytics/escalation-queue', { params: { limit } }),
  getInferenceVolume7d: () =>
    apiClient.get('/api/v1/analytics/inference-volume-7d'),
  getInfrastructureStats: () =>
    apiClient.get('/api/v1/analytics/infrastructure'),
  getKnowledgeBaseStats: () =>
    apiClient.get('/api/v1/analytics/knowledge-base'),
}

export default apiClient
