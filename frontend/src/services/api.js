import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  // Production fallback for deployed environments (e.g. Vercel)
  if (import.meta.env.PROD) {
    return 'https://campus-sports-production.up.railway.app/api';
  }
  // Local development default
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check API
export const getHealth = () =>
  api.get('/health');

// Auth APIs
export const verifyGoogleToken = (idToken, devEmail = null, devName = null) =>
  api.post('/auth/google', { idToken, devEmail, devName });

export const verifyAdminId = (adminId, email) =>
  api.post('/auth/admin/verify', { adminId, email });

export const getAuthConfig = () =>
  api.get('/auth/config');

// Student APIs
export const registerStudent = (studentData) =>
  api.post('/students/register', studentData);

export const getStudentByStudentId = (studentId) =>
  api.get(`/students/${studentId}`);

export const getStudentByEmail = (email) =>
  api.get(`/students/email/${email}`);

export const getAllStudents = () =>
  api.get('/students');

export const getBlockedStudents = () =>
  api.get('/students/blocked');

export const blockStudent = (studentId, reason, adminId) =>
  api.post('/students/block', { studentId, reason, adminId });

export const unblockStudent = (studentId) =>
  api.post(`/students/unblock/${studentId}`);

// Sports & Equipment APIs
export const getAllSports = () =>
  api.get('/sports');

export const getSportsByCategory = (category) =>
  api.get(`/sports/category/${category}`);

export const createSport = (sportData) =>
  api.post('/sports', sportData);

export const getAllEquipment = () =>
  api.get('/equipment');

export const getEquipmentBySport = (sportId) =>
  api.get(`/equipment/sport/${sportId}`);

export const createEquipment = (sportId, equipmentData) =>
  api.post(`/equipment?sportId=${sportId}`, equipmentData);

export const updateEquipment = (id, equipmentData) =>
  api.put(`/equipment/${id}`, equipmentData);

// Equipment Assignment & Returns
export const assignEquipment = (assignData) =>
  api.post('/equipment/assign', assignData);

export const returnEquipment = (assignmentId) =>
  api.post(`/equipment/return/${assignmentId}`);

export const getAllAssignments = () =>
  api.get('/equipment/assignments');

export const getStudentAssignments = (studentId) =>
  api.get(`/equipment/assignments/student/${studentId}`);

// Events APIs
export const getAllEvents = () =>
  api.get('/events');

export const getUpcomingEvents = () =>
  api.get('/events/upcoming');

export const createEvent = (eventData) =>
  api.post('/events', eventData);

export const updateEvent = (id, eventData) =>
  api.put(`/events/${id}`, eventData);

export const deleteEvent = (id) =>
  api.delete(`/events/${id}`);

// Achievements APIs
export const getAllAchievements = () =>
  api.get('/achievements');

export const getStudentAchievements = (studentId) =>
  api.get(`/achievements/student/${studentId}`);

export const createAchievement = (achievementData) =>
  api.post('/achievements', achievementData);

export const deleteAchievement = (id) =>
  api.delete(`/achievements/${id}`);

// Admin Stats
export const getDashboardStats = () =>
  api.get('/dashboard/stats');

export default api;
