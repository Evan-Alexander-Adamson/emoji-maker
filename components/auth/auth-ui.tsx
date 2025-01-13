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
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Emoji Maker</h1>
              <p className="text-xl text-gray-600 mb-8">Please sign in to create custom emojis</p>
            </div>
            <div className="flex justify-center">
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Sign In to Get Started
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
} 