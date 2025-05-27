import React from 'react'
import { Event } from './Calendar'
interface EventCardProps {
  event: Event
  onClick: () => void
  onDragStart: () => void
}
export function EventCard({ event, onClick, onDragStart }: EventCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-400/50 text-blue-300',
    purple: 'bg-purple-500/20 border-purple-400/50 text-purple-300',
    pink: 'bg-pink-500/20 border-pink-400/50 text-pink-300',
    green: 'bg-green-500/20 border-green-400/50 text-green-300',
    orange: 'bg-orange-500/20 border-orange-400/50 text-orange-300',
    red: 'bg-red-500/20 border-red-400/50 text-red-300',
  }
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`
        px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer
        hover:scale-105 transition-all duration-200
        ${colorClasses[event.color as keyof typeof colorClasses] || colorClasses.blue}
      `}
    >
      <div className="truncate">{event.title}</div>
      {event.time && <div className="text-xs opacity-75">{event.time}</div>}
    </div>
  )
}
