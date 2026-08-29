import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api/results'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Normalizes backend error payloads into a single readable message.
function extractErrorMessage(error) {
  const data = error?.response?.data
  if (data?.fieldErrors) {
    return Object.values(data.fieldErrors).join(', ')
  }
  if (data?.message) return data.message
  if (error.message) return error.message
  return 'Something went wrong. Please try again.'
}

export const resultApi = {
  async createResult(payload) {
    try {
      const { data } = await client.post('', payload)
      return data
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },

  async getAllResults() {
    try {
      const { data } = await client.get('')
      return data
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },

  async getResultById(id) {
    try {
      const { data } = await client.get(`/${id}`)
      return data
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },

  async deleteResult(id) {
    try {
      await client.delete(`/${id}`)
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },
}
