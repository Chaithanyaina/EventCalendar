import React, { useEffect, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { EventModal } from './EventModal'
import { EventCard } from './EventCard'
export interface Event {
  id: string
  title: string
  date: Date
  time: string
  description: string
  color: string
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom'
    interval?: number
    daysOfWeek?: number[]
    endDate?: Date
  }
}
export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null)
  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events')
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }))
      setEvents(parsedEvents)
    }
  }, [])
  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events))
  }, [events])
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      direction === 'next'
        ? addMonths(currentDate, 1)
        : subMonths(currentDate, 1),
    )
  }
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setEditingEvent(null)
    setIsModalOpen(true)
  }
  const handleEventClick = (event: Event) => {
    setEditingEvent(event)
    setSelectedDate(event.date)
    setIsModalOpen(true)
  }
  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? {
                ...eventData,
                id: editingEvent.id,
              }
            : e,
        ),
      )
    } else {
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
      }
      setEvents([...events, newEvent])
    }
    setIsModalOpen(false)
    setEditingEvent(null)
  }
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
    setIsModalOpen(false)
    setEditingEvent(null)
  }
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }
  const handleDragStart = (event: Event) => {
    setDraggedEvent(event)
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    if (draggedEvent) {
      const updatedEvent = {
        ...draggedEvent,
        date,
      }
      setEvents(
        events.map((e) => (e.id === draggedEvent.id ? updatedEvent : e)),
      )
      setDraggedEvent(null)
    }
  }
  return (
    <div className="backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 p-6 shadow-2xl">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 group"
        >
          <ChevronLeftIcon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
        </button>
        <h2 className="text-3xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 group"
        >
          <ChevronRightIcon className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
        </button>
      </div>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-slate-400 font-medium py-3"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isCurrentDay = isToday(day)
          return (
            <div
              key={day.toISOString()}
              className={`
                min-h-[120px] p-2 rounded-xl border transition-all duration-300 cursor-pointer
                ${isCurrentMonth ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white/2 border-white/5 text-slate-600'}
                ${isCurrentDay ? 'ring-2 ring-cyan-400 bg-cyan-500/10' : ''}
              `}
              onClick={() => handleDateClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div
                className={`text-sm font-medium mb-2 ${isCurrentDay ? 'text-cyan-400' : 'text-white'}`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    onDragStart={() => handleDragStart(event)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-slate-400 text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Floating Add Button */}
      <button
        onClick={() => {
          setSelectedDate(new Date())
          setEditingEvent(null)
          setIsModalOpen(true)
        }}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group"
      >
        <PlusIcon className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>
      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={
            editingEvent ? () => handleDeleteEvent(editingEvent.id) : undefined
          }
          event={editingEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}
