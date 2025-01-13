'use client';

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { SvgGenerator } from "@/components/svg-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
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
      </div>
    </main>
  );
}
