import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GraduationCap, UserPlus, Users, Terminal, Code2, Sparkles, CheckCircle2, Activity, ArrowRight, Laptop } from 'lucide-react';
import { Student, AxiosLog } from './types';
import { RegistrationForm } from './components/RegistrationForm';
import { StudentList } from './components/StudentList';
import { ApiResponseViewer } from './components/ApiResponseViewer';
import { SourceCodeViewer } from './components/SourceCodeViewer';

export default function App() {
  const [activeView, setActiveView] = useState<'form' | 'directory' | 'inspector' | 'code'>('form');
  const [students, setStudents] = useState<Student[]>([]);
  const [axiosLogs, setAxiosLogs] = useState<AxiosLog[]>([
    {
      id: 'LOG-INITIAL',
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      url: '/api/students',
      status: 201,
      statusText: 'Created',
      requestBody: {
        name: 'Elena Rostova',
        email: 'elena.rostova@university.edu',
        course: 'Computer Science & AI',
        department: 'Engineering & Tech'
      },
      responseBody: {
        success: true,
        message: 'Student registered successfully!',
        data: {
          id: 'STU-4821',
          name: 'Elena Rostova',
          email: 'elena.rostova@university.edu',
          course: 'Computer Science & AI',
          department: 'Engineering & Tech',
          registeredAt: new Date().toISOString(),
          status: 'Confirmed'
        }
      },
      durationMs: 340
    }
  ]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentRegistered = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleLogAxiosCall = (newLog: AxiosLog) => {
    setAxiosLogs((prev) => [newLog, ...prev]);
  };

  const latestRegistered = students.length > 0 ? students[0] : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-white tracking-tight">Student Portal</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Axios Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Student Registration & API Request Management</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend Express Endpoint Ready
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header & Quick Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Web Development Assignment Project
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Student Registration System
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                Built with React, Tailwind CSS, Axios client POST requests, and an Express REST API endpoint. Submit the form to register new students in real time.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Registered</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{students.length}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">HTTP Status</p>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">201 OK</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Axios Version</p>
                <p className="text-xl font-bold text-indigo-600 mt-0.5">^1.19.0</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              id="tab-form"
              onClick={() => setActiveView('form')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'form'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Registration Form
            </button>

            <button
              type="button"
              id="tab-directory"
              onClick={() => setActiveView('directory')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'directory'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" /> Student Registry ({students.length})
            </button>

            <button
              type="button"
              id="tab-inspector"
              onClick={() => setActiveView('inspector')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'inspector'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" /> Axios API Inspector ({axiosLogs.length})
            </button>

            <button
              type="button"
              id="tab-code"
              onClick={() => setActiveView('code')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'code'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> Source Code & Checklist
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeView === 'form' && (
          <div className="space-y-8">
            <RegistrationForm
              onStudentRegistered={handleStudentRegistered}
              onLogAxiosCall={handleLogAxiosCall}
            />

            {/* Quick Directory Preview below Form */}
            <StudentList
              students={students}
              onRefresh={fetchStudents}
              onLogAxiosCall={handleLogAxiosCall}
            />
          </div>
        )}

        {activeView === 'directory' && (
          <StudentList
            students={students}
            onRefresh={fetchStudents}
            onLogAxiosCall={handleLogAxiosCall}
          />
        )}

        {activeView === 'inspector' && (
          <ApiResponseViewer logs={axiosLogs} />
        )}

        {activeView === 'code' && (
          <SourceCodeViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700">Student Registration Portal</p>
            <p className="text-slate-400 mt-0.5">Demonstrating Axios HTTP POST requests and Express REST API integration.</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React 19</span>
            <span>•</span>
            <span>Axios 1.19.0</span>
            <span>•</span>
            <span>Express 4.21</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
