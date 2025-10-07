// src/services/api.ts
import axios from 'axios';

// -- تعريف الأنواع --

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: any;
}

// ++ إضافة: نوع بيانات الكلية
export interface College {
  id: string;
  name: string;
  academicYearsCount: number;
}

// ++ إضافة: نوع بيانات إنشاء كلية جديدة
export interface CreateCollegeData {
  name: string;
  academicYearsCount: number;
}

export interface Application {
  id: string;
  fullName: string;
  phoneNumber: string;
  college: string;
  specialization: string;
  academicYear: number;
  interestedFields: Array<{ name: string; }>;
  hasExperience: boolean;
  experienceDetails?: string;
  portfolioLinks: Array<{ url: string; }>;
  equipmentDetails?: string;
  reasonToJoin: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// إضافة interceptor لإرسال التوكن مع كل طلب
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// --- دوال الـ API ---

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
};

export const getApplications = async (): Promise<Application[]> => {
  const response = await apiClient.get('/applications');
  return response.data;
};

// ++ إضافة: دالة لجلب الكليات
export const getColleges = async (): Promise<College[]> => {
  const response = await apiClient.get('/colleges');
  return response.data;
};

// ++ إضافة: دالة لإنشاء كلية جديدة
export const createCollege = async (data: CreateCollegeData): Promise<College> => {
  const response = await apiClient.post('/colleges', data);
  return response.data;
};