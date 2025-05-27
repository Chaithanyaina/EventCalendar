import React from 'react';
import { Calendar } from './components/Calendar';
export function App() {
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Event Calendar
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your schedule with style
          </p>
        </header>
        <Calendar />
      </div>
    </div>;
}