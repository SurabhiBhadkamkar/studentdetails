import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, RefreshCw, GraduationCap, User, Mail, Calendar, ShieldCheck, Database, Filter } from 'lucide-react';
import { Student, AxiosLog } from '../types';

interface StudentListProps {
  students: Student[];
  onRefresh: () => void;
  onLogAxiosCall: (log: AxiosLog) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onRefresh,
  onLogAxiosCall
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // Extract unique courses for filter
  const courseOptions = ['All', ...Array.from(new Set(students.map((s) => s.course)))];

  const filteredStudents = students.filter((student) => {
    const matchesQuery =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourseFilter === 'All' || student.course === selectedCourseFilter;

    return matchesQuery && matchesCourse;
  });

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete student record ${id}?`)) return;

    setDeletingId(id);
    const startTime = Date.now();

    try {
      const response = await axios.delete(`/api/students/${id}`);
      const durationMs = Date.now() - startTime;

      onLogAxiosCall({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'DELETE',
        url: `/api/students/${id}`,
        status: response.status,
        statusText: response.statusText,
        requestBody: null,
        responseBody: response.data,
        durationMs
      });

      onRefresh();
    } catch (err: any) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    const startTime = Date.now();

    try {
      const response = await axios.post('/api/students/reset');
      const durationMs = Date.now() - startTime;

      onLogAxiosCall({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'POST',
        url: '/api/students/reset',
        status: response.status,
        statusText: response.statusText,
        requestBody: null,
        responseBody: response.data,
        durationMs
      });

      onRefresh();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div id="student-directory-container" className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Registered Students Directory</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold">
              {students.length} Total
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time backend registry populated via Axios requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            id="refresh-students-btn"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh (GET)
          </button>
          <button
            type="button"
            onClick={handleResetData}
            id="reset-students-btn"
            disabled={resetting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-rose-600" /> {resetting ? 'Resetting...' : 'Reset Demo Data'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {courseOptions.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Courses' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List View */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">No registered students found</p>
          <p className="text-xs mt-1">Try clearing filters or register a new student using the form above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Student Info</th>
                <th className="py-3 px-6">Course & Dept</th>
                <th className="py-3 px-6">Registered Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-indigo-600 whitespace-nowrap">
                    {student.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {student.name}
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      {student.course}
                    </div>
                    {student.department && (
                      <p className="text-[11px] text-slate-400 mt-1 pl-1">
                        {student.department}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(student.registeredAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete student via Axios DELETE"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
