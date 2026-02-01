import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

interface Message {
  _id: string
  sender: string | { _id: string; name: string }
  text: string
  createdAt: string
}

interface ChatState {
  messages: Message[]
  loading: boolean
  error: string | null
}

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async () => {
  const response = await api.get('/chat/messages')
  return response.data.messages
})

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false, error: null } as ChatState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'خطا در دریافت پیام‌ها'
      })
  }
})

export default chatSlice.reducer