'use client'

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
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