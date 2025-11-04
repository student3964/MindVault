import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/planner";

interface Task {
  _id: string;
  title: string;
  done: boolean;
}

interface MyTasksProps {
  refreshTrigger?: number; // Refresh when this number changes
}

const MyTasks: React.FC<MyTasksProps> = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // ---------- Fetch tasks ----------
  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      if (data && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error("Error fetching tasks:", e);
    }
  };

  // ---------- Add task ----------
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await createTask(newTask);
      setNewTask("");
      loadTasks();
    } catch (e) {
      console.error("Error creating task:", e);
    }
  };

  // ---------- Toggle completion ----------
  const toggleDone = async (task: Task) => {
    try {
      await updateTask(task._id, !task.done);
      loadTasks();
    } catch (e) {
      console.error("Error updating task:", e);
    }
  };

  // ---------- Delete task ----------
  const removeTask = async (id: string) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  // ---------- Initial + external refresh ----------
  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">
        🗒️ My Tasks
      </h3>

      {/* Add Task */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={addTask}
          className="ml-2 bg-purple-600 px-3 py-2 rounded-md text-white hover:bg-purple-700 transition-all"
        >
          +
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm italic">
          No tasks yet. Add one from here or via your calendar.
        </p>
      ) : (
        <ul className="space-y-2 text-gray-300">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`flex items-center justify-between p-2 rounded-md ${
                task.done
                  ? "opacity-60 line-through bg-slate-800 border border-slate-700"
                  : "bg-slate-900 border border-slate-700"
              } transition-all`}
            >
              <span>{task.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDone(task)}
                  className="text-green-400 hover:text-green-300"
                  title="Mark as Done"
                >
                  ✔
                </button>
                <button
                  onClick={() => removeTask(task._id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete Task"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTasks;
