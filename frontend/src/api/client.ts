import axios from 'axios'
import toast from 'react-hot-toast'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor: log outgoing requests in dev
client.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`→ ${config.method?.toUpperCase()} ${config.url}`)
  }
  return config
})

// Response interceptor: unwrap data, handle errors globally
client.interceptors.response.use(
  (response) => {
    // Backend returns { success: true, data: ... } or { success: true, message: ..., data: ... }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error?.message
      || error.message
      || 'Something went wrong'

    if (error.response?.status !== 404) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default client
