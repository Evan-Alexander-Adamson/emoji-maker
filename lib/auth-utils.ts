import { cookies } from 'next/headers';

export async function getAuthData() {
  const cookieStore = cookies();
  return {
    // Add any auth-related data you need
    isAuthenticated: cookieStore.has('__session'),
  };
} 