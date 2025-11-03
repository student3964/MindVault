import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarBox.css";
import { createEvent, fetchEvents, createTask, fetchTasks } from "../../api/planner";

interface CalendarBoxProps {
  onTasksUpdate: () => void;
}

const CalendarBox: React.FC<CalendarBoxProps> = ({ onTasksUpdate }) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [reminder, setReminder] = useState("");
  const [deadline, setDeadline] = useState("");
  const [task, setTask] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetchEvents();
        setEvents(res.events || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadEvents();
  }, []);

  const handleDone = async () => {
    try {
      if (reminder.trim()) {
        await createEvent({ title: reminder, deadline: date?.toISOString(), description: "Reminder" });
      }
      if (deadline.trim()) {
        await createEvent({ title: deadline, deadline: date?.toISOString(), description: "Deadline" });
      }
      if (task.trim()) {
        await createTask(task);
        onTasksUpdate();
      }

      setReminder("");
      setDeadline("");
      setTask("");
      alert("✅ Plan saved successfully!");
    } catch (e) {
      console.error("Error saving plan:", e);
    }
  };

  return (
    <div className="calendar-box backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4 relative">
        <h3 className="text-xl font-semibold text-white">📅 Calendar</h3>
        <div ref={calendarRef} className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
          >
            📆
          </button>
          {showCalendar && (
            <div className="absolute right-0 mt-2 z-50">
              <Calendar
                onChange={(value) => {
                  setDate(value as Date);
                  setShowCalendar(false);
                }}
                value={date}
                className="custom-calendar"
              />
            </div>
          )}
        </div>
      </div>

      {date && (
        <div className="selected-date-box mt-4 text-gray-300">
          <h4 className="text-lg font-medium mb-3 border-b border-white/10 pb-1">
            Plan for {date.toDateString()}
          </h4>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Add a reminder..."
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Add a deadline..."
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Add a to-do task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <button
            onClick={handleDone}
            className="w-full mt-5 bg-purple-600 px-3 py-2 rounded-md text-white font-medium hover:bg-purple-700 transition"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarBox;
