import React, { useEffect, useState } from "react";
import { fetchEvents } from "../../api/planner";

interface EventItem {
  _id: string;
  title: string;
  deadline: string;
}

const UpcomingDeadlines: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  const loadDeadlines = async () => {
    try {
      const now = new Date();
      const from = now.toISOString();
      const to = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
      const res = await fetchEvents(from, to);
      setEvents(res.events || []);
    } catch (e) {
      console.error("Error fetching deadlines:", e);
    }
  };

  useEffect(() => {
    loadDeadlines();
    const interval = setInterval(loadDeadlines, 60000); // auto-refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  const renderEvent = (event: EventItem) => {
    const daysLeft =
      (new Date(event.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);

    let colorClass = "";
    if (daysLeft <= 0) colorClass = "text-red-400";
    else if (daysLeft <= 2) colorClass = "text-yellow-400";
    else colorClass = "text-green-400";

    const isPast = daysLeft <= 0;

    return (
      <li
        key={event._id}
        className={`flex justify-between items-center py-1 border-b border-slate-700 last:border-b-0 text-sm ${
          isPast ? "line-through opacity-60" : ""
        }`}
      >
        <span className={`${colorClass}`}>{event.title}</span>
        <span className="text-gray-400">
          {new Date(event.deadline).toLocaleDateString()}
        </span>
      </li>
    );
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3 border-b border-white/10 pb-2">
        ⏳ Upcoming Deadlines
      </h3>
      <ul className="text-gray-300 overflow-y-auto pr-2 flex-grow">
        {events.length > 0 ? (
          events.map((event) => renderEvent(event))
        ) : (
          <p className="text-gray-500 text-sm italic">No upcoming deadlines</p>
        )}
      </ul>
    </div>
  );
};

export default UpcomingDeadlines;
