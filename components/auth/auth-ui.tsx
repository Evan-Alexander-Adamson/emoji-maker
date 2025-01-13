'use client';

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { SvgGenerator } from "@/components/svg-generator";

export function AuthUI() {
  return (
    <>
      <SignedIn>
        <SvgGenerator />
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-4xl font-bold">Welcome to Emoji Maker</h1>
          <p className="text-xl">Please sign in to create custom emojis</p>
          <SignInButton mode="modal">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
} 