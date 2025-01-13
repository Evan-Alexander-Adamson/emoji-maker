'use client'

import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

export function Header() {
  const { isSignedIn } = useUser()

  return (
    <header style={{
      width: '100%',
      maxWidth: '800px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      padding: '12px 0',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#2D3748',
        letterSpacing: '0.5px'
      }}>
        SVG Generator
      </h1>
      <div>
        {isSignedIn ? (
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  width: '36px',
                  height: '36px'
                }
              }
            }}
          />
        ) : (
          <SignInButton mode="modal">
            <button style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'white',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#2D3748',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
            }}
            >
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}
