import React from 'react'
import { Calendar } from './components/Calendar'
export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 md:p-4">
      <div className="container mx-auto max-w-7xl h-screen flex flex-col">
        <header className="text-center mb-4 md:mb-8 flex-shrink-0">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Event Calendar
          </h1>
          <p className="text-slate-400 text-sm md:text-lg">
            Manage your schedule with style
          </p>
        </header>
        <div className="flex-1 min-h-0">
          <Calendar />
        </div>
      </div>
    </div>
  )
}
