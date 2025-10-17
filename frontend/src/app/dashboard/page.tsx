'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');
  const [role, setRole] =useState('');
  const router = useRouter();

  // Load employees
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setRole(userRole || '');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_URL}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await res.json();
        setEmployees(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEmployees();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error deleting employee');
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
                <p className="text-sm text-slate-500">Manage your workforce efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              { role === 'ADMIN' && <button
                onClick={() => router.push('/employee-add')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                <Plus size={20} />
                Add Employee
              </button>}
              <button
                onClick={handleLogout}
                className="bg-slate-600 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors shadow-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 text-slate-700">
            <Users size={20} className="text-blue-600" />
            <span className="font-semibold text-lg">Total Employees:</span>
            <span className="text-2xl font-bold text-blue-600">{employees.length}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Salary</th>
                  { role === 'ADMIN' && <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <Users size={48} className="mx-auto mb-3 text-slate-300" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm mt-1">Add your first employee to get started</p>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp: any) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{emp.position}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        ${emp.salary.toLocaleString()}
                      </td>
                      { role === 'ADMIN' && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/employee-edit/${emp.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit Employee"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete Employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}