/**
 * Service layer — BacSi (Doctor) module
 * Tập trung tất cả API calls cho module bác sĩ.
 */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const API = `${ip3}api/v1`;

// ─────────────────────── Doctor Stats ───────────────────────

export async function getDoctorStats() {
  const res = await axios.get(`${API}/doctor/stats`);
  return res.data;
}

// ─────────────────────── Doctor Appointments ───────────────────────

export async function getUpcomingAppointments(limit: number = 10) {
  const res = await axios.get(`${API}/doctor/appointments/upcoming`, {
    params: { limit },
  });
  return res.data;
}

export async function getTodayAppointments() {
  const res = await axios.get(`${API}/doctor/appointments/today`);
  return res.data;
}

export async function getAppointments(
  page: number = 1,
  limit: number = 10,
  status?: string,
) {
  const res = await axios.get(`${API}/doctor/appointments`, {
    params: { page, limit, status },
  });
  return res.data;
}

export async function getAppointmentDetail(appointmentId: string) {
  const res = await axios.get(`${API}/doctor/appointments/${appointmentId}`);
  return res.data;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'confirmed' | 'cancelled' | 'completed',
) {
  const res = await axios.patch(
    `${API}/doctor/appointments/${appointmentId}/status`,
    { status },
  );
  return res.data;
}

// ─────────────────────── Medical Records ───────────────────────

export async function createMedicalRecord(data: {
  appointment_id: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
}) {
  const res = await axios.post(`${API}/doctor/medical-records`, data);
  return res.data;
}

export async function getMedicalRecordDetail(recordId: string) {
  const res = await axios.get(`${API}/doctor/medical-records/${recordId}`);
  return res.data;
}

export async function getPetMedicalHistory(petId: string) {
  const res = await axios.get(`${API}/doctor/pets/${petId}/medical-history`);
  return res.data;
}

// ─────────────────────── Messages / Conversations ───────────────────────

export async function getConversations(page: number = 1, limit: number = 20) {
  const res = await axios.get(`${API}/messages/conversations`, {
    params: { page, limit },
  });
  return res.data;
}

export async function getConversationDetail(conversationId: string) {
  const res = await axios.get(
    `${API}/messages/conversations/${conversationId}`,
  );
  return res.data;
}

export async function getConversationMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50,
) {
  const res = await axios.get(
    `${API}/messages/conversations/${conversationId}/messages`,
    { params: { page, limit } },
  );
  return res.data;
}

export async function sendMessage(conversationId: string, content: string) {
  const res = await axios.post(
    `${API}/messages/conversations/${conversationId}/messages`,
    { content },
  );
  return res.data;
}

export async function getUnreadCount() {
  const res = await axios.get(`${API}/messages/unread-count`);
  return res.data;
}

// ─────────────────────── Profile ───────────────────────

export async function updateProfile(data: {
  full_name?: string;
  phone?: string;
  password?: string;
  bio?: string;
  certificate_url?: string;
}) {
  const res = await axios.patch(`${API}/auth/me`, data);
  return res.data;
}
