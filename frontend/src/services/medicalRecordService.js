// medicalRecordService.js — Medical record API calls
import api from './api.js'
import { API } from '../constants/apiEndpoints.js'
import { buildQueryString } from '../utils/helpers.js'

export const medicalRecordService = {
  // Create a medical record (doctor)
  async createRecord(data) {
    const response = await api.post(API.MEDICAL_RECORDS.CREATE, data)
    return response.data
  },

  // Get medical records (role-scoped)
  async getRecords(params = {}) {
    const query    = buildQueryString(params)
    const response = await api.get(`${API.MEDICAL_RECORDS.LIST}${query}`)
    return response.data
  },

  // Get single record by ID
  async getRecordById(id) {
    const response = await api.get(API.MEDICAL_RECORDS.DETAIL(id))
    return response.data
  },

  // Update a medical record (doctor)
  async updateRecord(id, data) {
    const response = await api.patch(API.MEDICAL_RECORDS.UPDATE(id), data)
    return response.data
  },

  // Get patient health summary
  async getPatientSummary(patientId) {
    const response = await api.get(API.MEDICAL_RECORDS.SUMMARY(patientId))
    return response.data
  },
}