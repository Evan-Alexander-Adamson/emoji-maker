'use client'

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignOut() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Perform sign out without any options
      await signOut();

      // Optionally clear any client-side state
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to home page
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: force reload even if there's an error
      window.location.replace('/');
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Sign out
    </button>
  );
} 