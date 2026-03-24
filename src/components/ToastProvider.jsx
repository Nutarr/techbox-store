'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            fontFamily: 'Tajawal, sans-serif',
            borderRadius: '12px',
            padding: '12px 24px',
          },
        }}
      />
    </>
  );
}
