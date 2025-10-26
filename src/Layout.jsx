// src/Layout.jsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 text-center text-xl font-bold">
        Par 3 Challenge
      </header>
      <main>{children}</main>
    </div>
  );
}