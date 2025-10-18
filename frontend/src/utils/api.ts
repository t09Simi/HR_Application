/* For localdevelopment
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
*/
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hr-application-backend-qlb6.onrender.com/api';

//export const API_URL = 'https://hr-application-backend-qlb6.onrender.com/api';
export async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || response.statusText);
  }

  return response.json();
}
