import api from './api'
import {type Class } from '../types'

export const classService = {
  async getAllClasses() {
    const res = await api.get('/classes')
    return res.data.classes as Class[]
  },

  async reserveClass(classId: string) {
    const res = await api.post(`/classes/${classId}/reserve`)
    return res.data
  }
}