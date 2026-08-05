export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  department?: string;
  registeredAt: string;
  status: 'Active' | 'Pending' | 'Confirmed';
}

export interface StudentFormData {
  name: string;
  email: string;
  course: string;
  department: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    httpStatus: number;
  };
}

export interface AxiosLog {
  id: string;
  timestamp: string;
  method: 'POST' | 'GET' | 'DELETE';
  url: string;
  status?: number;
  statusText?: string;
  requestBody?: any;
  responseBody?: any;
  durationMs: number;
  isError?: boolean;
}
