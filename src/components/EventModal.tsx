import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { XIcon, TrashIcon } from 'lucide-react'
import { Event } from './Calendar'
interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<Event, 'id'>) => void
  onDelete?: () => void
  event?: Event | null
  selectedDate: Date | null
}
export function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate,
}: EventModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('blue')
  const [recurrenceType, setRecurrenceType] = useState<
    'none' | 'daily' | 'weekly' | 'monthly'
  >('none')
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDate(format(event.date, 'yyyy-MM-dd'))
      setTime(event.time)
      setDescription(event.description)
      setColor(event.color)
      setRecurrenceType(event.recurrence?.type || 'none')
    } else {
      setTitle('')
      setDate(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '')
      setTime('')
      setDescription('')
      setColor('blue')
      setRecurrenceType('none')
    }
  }, [event, selectedDate])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return
    const eventData: Omit<Event, 'id'> = {
      title: title.trim(),
      date: new Date(date),
      time,
      description,
      color,
      recurrence:
        recurrenceType !== 'none'
          ? {
              type: recurrenceType,
            }
          : undefined,
    }
    onSave(eventData)
  }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {event ? 'Edit Event' : 'Add Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="Enter event title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [&::-webkit-calendar-picker-indicator]:invert"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="Enter event description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {['blue', 'purple', 'pink', 'green', 'orange', 'red'].map(
                (colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${color === colorOption ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{
                      backgroundColor: {
                        blue: '#3b82f6',
                        purple: '#8b5cf6',
                        pink: '#ec4899',
                        green: '#10b981',
                        orange: '#f59e0b',
                        red: '#ef4444',
                      }[colorOption],
                    }}
                  />
                ),
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Recurrence
            </label>
            <select
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              style={{
                colorScheme: 'dark',
              }}
            >
              <option value="none" className="bg-slate-700 text-white">
                No recurrence
              </option>
              <option value="daily" className="bg-slate-700 text-white">
                Daily
              </option>
              <option value="weekly" className="bg-slate-700 text-white">
                Weekly
              </option>
              <option value="monthly" className="bg-slate-700 text-white">
                Monthly
              </option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
