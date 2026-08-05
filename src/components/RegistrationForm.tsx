import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { User, Mail, GraduationCap, Building, CheckCircle2, AlertCircle, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { StudentFormData, ApiResponse, AxiosLog } from '../types';

interface RegistrationFormProps {
  onStudentRegistered: (student: any) => void;
  onLogAxiosCall: (log: AxiosLog) => void;
}

const SAMPLE_COURSES = [
  'Computer Science & AI',
  'Full Stack Web Development',
  'Data Science & Analytics',
  'Cybersecurity & Networking',
  'UI/UX Design & Frontend',
  'Cloud Architecture & DevOps',
  'Business Administration'
];

const SAMPLE_DEPARTMENTS = [
  'Engineering & Tech',
  'Software Engineering',
  'Mathematics & Stats',
  'Design & Digital Arts',
  'Business & Management'
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onStudentRegistered,
  onLogAxiosCall
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    course: '',
    department: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [successResponse, setSuccessResponse] = useState<ApiResponse | null>(null);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.course) {
      errors.course = 'Please select or type a course';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (successResponse) setSuccessResponse(null);
    if (errorResponse) setErrorResponse(null);
  };

  const handleQuickFill = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const names = ['Alex Mercer', 'Sophia Chen', 'David Miller', 'Aisha Khan', 'Liam O\'Connor'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const chosenCourse = SAMPLE_COURSES[Math.floor(Math.random() * SAMPLE_COURSES.length)];
    const chosenDept = SAMPLE_DEPARTMENTS[Math.floor(Math.random() * SAMPLE_DEPARTMENTS.length)];

    setFormData({
      name: `${chosenName}`,
      email: `${chosenName.toLowerCase().replace(/[^a-z]/g, '')}${randomNum}@university.edu`,
      course: chosenCourse,
      department: chosenDept
    });
    setValidationErrors({});
    setSuccessResponse(null);
    setErrorResponse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessResponse(null);
    setErrorResponse(null);

    if (!validate()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      // Step 3 & Step 5: Send POST request using Axios and handle API response
      const response = await axios.post<ApiResponse>('/api/students', {
        name: formData.name,
        email: formData.email,
        course: formData.course,
        department: formData.department || 'General Academics'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const durationMs = Date.now() - startTime;

      // Log the Axios call for live API inspection
      onLogAxiosCall({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'POST',
        url: '/api/students',
        status: response.status,
        statusText: response.statusText,
        requestBody: formData,
        responseBody: response.data,
        durationMs
      });

      if (response.data && response.data.success) {
        setSuccessResponse(response.data);
        onStudentRegistered(response.data.data);
        // Clear form fields
        setFormData({
          name: '',
          email: '',
          course: '',
          department: ''
        });
      }
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      let errorMsg = 'Failed to submit registration. Please try again.';
      let status = 500;
      let responseBody = null;

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiResponse>;
        status = axiosError.response?.status || 500;
        responseBody = axiosError.response?.data;
        if (axiosError.response?.data?.message) {
          errorMsg = axiosError.response.data.message;
        } else if (axiosError.message) {
          errorMsg = axiosError.message;
        }
      }

      setErrorResponse(errorMsg);

      onLogAxiosCall({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'POST',
        url: '/api/students',
        status,
        statusText: 'Error',
        requestBody: formData,
        responseBody,
        durationMs,
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="student-registration-container" className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Form Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Axios HTTP POST Handler
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Student Registration Form</h2>
            <p className="text-slate-400 text-sm mt-1">
              Enter student details below to send an asynchronous POST request using Axios.
            </p>
          </div>
          <button
            type="button"
            id="quick-fill-btn"
            onClick={handleQuickFill}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Auto-Fill Demo Data
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Success Alert Banner */}
        {successResponse && (
          <div id="success-message-banner" className="mb-6 p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in duration-300">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-semibold text-emerald-950 text-base">
                    {successResponse.message}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-xs font-mono font-medium">
                    HTTP 201 Created
                  </span>
                </div>
                <p className="text-emerald-800 text-sm mt-1">
                  Server responded with validated student record payload:
                </p>
                {successResponse.data && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-100/60 font-mono text-xs text-emerald-900 space-y-1 border border-emerald-200/50">
                    <p><span className="font-semibold text-emerald-950">Student ID:</span> {successResponse.data.id}</p>
                    <p><span className="font-semibold text-emerald-950">Name:</span> {successResponse.data.name}</p>
                    <p><span className="font-semibold text-emerald-950">Email:</span> {successResponse.data.email}</p>
                    <p><span className="font-semibold text-emerald-950">Course:</span> {successResponse.data.course}</p>
                    <p><span className="font-semibold text-emerald-950">Department:</span> {successResponse.data.department}</p>
                    <p><span className="font-semibold text-emerald-950">Registered At:</span> {new Date(successResponse.data.registeredAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorResponse && (
          <div id="error-message-banner" className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-rose-950 text-sm">Registration Failed</h4>
                <p className="text-rose-800 text-xs mt-0.5">{errorResponse}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Student Name */}
            <div>
              <label htmlFor="student-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="student-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    validationErrors.name
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="student-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="student-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. jane.doe@university.edu"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    validationErrors.email
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.email}
                </p>
              )}
            </div>

            {/* Select Course */}
            <div>
              <label htmlFor="student-course" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Enrolled Course <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="student-course"
                  name="course"
                  list="course-suggestions"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Type or select a course..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    validationErrors.course
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <datalist id="course-suggestions">
                  {SAMPLE_COURSES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              {validationErrors.course && (
                <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.course}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="student-department" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Department <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  id="student-department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-100 focus:outline-none focus:ring-2 bg-white"
                >
                  <option value="">Select Department...</option>
                  {SAMPLE_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Submitting triggers <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">axios.post('/api/students', data)</code>
            </p>

            <button
              type="submit"
              id="submit-registration-btn"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Axios Request...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Registration (Axios POST)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
