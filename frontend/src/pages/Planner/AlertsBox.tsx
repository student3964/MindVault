import React, { useEffect, useState, useRef } from "react";
import { fetchAlerts } from "../../api/planner";

interface AlertItem {
  id: string;
  type: "expired" | "upcoming" | "alert";
  message: string;
  deadline?: string;
  created_at?: string;
}

const AlertsBox: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [newAlert, setNewAlert] = useState<AlertItem | null>(null);
  const prevAlertCount = useRef<number>(0);

  const loadAlerts = async () => {
    try {
      const res = await fetchAlerts();
      setAlerts(res.alerts || []);

      // Detect new alert for glow animation
      if (res.alerts && res.alerts.length > prevAlertCount.current) {
        const latest = res.alerts[0];
        setNewAlert(latest);
        setTimeout(() => setNewAlert(null), 2500); // Glow effect for 2.5s
      }

      prevAlertCount.current = res.alerts?.length || 0;
    } catch (e) {
      console.error("Error fetching alerts:", e);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 60000); // Refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  const getColorClass = (type: string) => {
    switch (type) {
      case "expired":
        return "text-red-400";
      case "upcoming":
        return "text-yellow-400";
      case "alert":
        return "text-blue-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg h-full flex flex-col transition-all duration-500 ${
        newAlert ? "shadow-[0_0_15px_rgba(147,51,234,0.7)]" : ""
      }`}
    >
      <h3 className="text-xl font-semibold mb-3 border-b border-white/10 pb-2">
        ⚠️ Alerts & Reminders
      </h3>

      <ul className="text-gray-300 overflow-y-auto pr-2 flex-grow">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <li
              key={alert.id}
              className={`py-2 border-b border-slate-700 last:border-b-0 text-sm flex justify-between`}
            >
              <span className={getColorClass(alert.type)}>{alert.message}</span>
              {alert.deadline && (
                <span className="text-gray-400 text-xs">
                  {new Date(alert.deadline).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No active alerts</p>
        )}
      </ul>
    </div>
  );
};

export default AlertsBox;
