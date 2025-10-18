'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { Users, LogOut, Edit, Save, X, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone_number: string;
}

export default function EmployeeProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    setRole(userRole || '');

    if (!token || !userId) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
        console.log('Fetching profile for userId:', userId);
        console.log('API URL:', `${API_URL}/profile/${userId}`);
        console.log('Token:', token ? 'Present' : 'Missing');
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          phone_number: data.phone_number || '',
          password: '',
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone_number: user.phone_number || '',
        password: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      router.push('/login');
      return;
    }

    try {
      const updateData: {
        name: string;
        email: string;
        address: string;
        phone_number: string;
        password?: string;
      } = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone_number: formData.phone_number,
      };

      // Only include password if it's been changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await fetch(`${API_URL}/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await res.json();
      setUser(data);
      setFormData({
        ...formData,
        password: '', // Clear password field after successful update
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-orange-600 text-white flex flex-col shadow-lg">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-orange-500">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <Users className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Employee</h2>
              <p className="text-xs text-orange-200">Management</p>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="p-6 border-b border-orange-500">
          <p className="text-sm text-orange-200">Welcome,</p>
          <p className="text-lg font-semibold capitalize">{role || 'User'}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {!isEditing ? (
              <li>
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-left"
                >
                  <Edit size={20} />
                  <span className="font-medium">Edit Details</span>
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleCancel}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-left"
                >
                  <X size={20} />
                  <span className="font-medium">Cancel Edit</span>
                </button>
              </li>
            )}

            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-orange-500">
          <p className="text-xs text-orange-200 text-center">© 2025 Employee MS</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                <p className="text-sm text-slate-500">View and manage your personal information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-orange-600" size={48} />
            </div>
          ) : (
            <div className="max-w-2xl">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {success}
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                          isEditing
                            ? 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        } outline-none`}
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                          isEditing
                            ? 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        } outline-none`}
                        required
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                          isEditing
                            ? 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        } outline-none`}
                      />
                    </div>

                    {/* Address Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                          isEditing
                            ? 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        } outline-none resize-none`}
                      />
                    </div>

                    {/* Password Field - Only shown when editing */}
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Leave blank to keep current password"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Only fill this if you want to change your password
                        </p>
                      </div>
                    )}

                    {/* Save Button - Only shown when editing */}
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={20} />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={saving}
                          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}