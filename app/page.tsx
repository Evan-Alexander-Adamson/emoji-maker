'use client';

import { SvgGenerator } from '@/components/svg-generator';
import { Header } from '@/components/headers';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #EDF2F7, #E2E8F0, #BEE3F8)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px',
      fontFamily: 'Gayathri, sans-serif'
    }}>
      <Header />
      <main style={{
        width: '100%',
        maxWidth: '800px'
      }}>
        <SvgGenerator />
      </main>
    </div>
  )
}
