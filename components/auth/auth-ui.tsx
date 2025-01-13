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
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Welcome to Emoji Maker</h1>
            <p className="auth-description">Please sign in to create custom emojis</p>
            <SignInButton mode="modal">
              <button className="auth-button">
                Sign In to Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
} 