// src/pages/Planner/MyTasks.tsx
import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/planner";

interface Task {
  id: string;
  title: string;
  done: boolean;
}

interface MyTasksProps {
  refreshTrigger?: number;
}

const MyTasks: React.FC<MyTasksProps> = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    taskId: string | null;
    title: string;
  }>({ show: false, taskId: null, title: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  // ---------- Fetch tasks ----------
  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      console.error("Error fetching tasks:", e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  // ---------- Add task ----------
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await createTask(newTask);
      if (res.task) {
        setTasks((prev) => [...prev, res.task]);
      } else {
        loadTasks();
      }
      setNewTask("");
    } catch (e) {
      console.error("Error creating task:", e);
    }
  };

  // ---------- Toggle done ----------
  const toggleDone = (task: Task) => {
    // instant UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, done: !t.done } : t
      )
    );

    // backend update
    updateTask(task.id, !task.done).catch((e) => {
      console.error("Error updating task:", e);
      // revert if failed
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, done: task.done } : t
        )
      );
    });
  };

  // ---------- Delete with backend sync ----------
  const confirmDelete = async () => {
    if (!confirmModal.taskId) return;

    setIsDeleting(true);
    try {
      await deleteTask(confirmModal.taskId);
      setTasks((prev) => prev.filter((t) => t.id !== confirmModal.taskId));
    } catch (e) {
      console.error("Error deleting task:", e);
    } finally {
      setIsDeleting(false);
      setConfirmModal({ show: false, taskId: null, title: "" });
    }
  };

  return (
    <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg w-full">
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
          className="flex-1 p-2 rounded-md bg-slate-800 border border-slate-700 text-white"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
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
              key={task.id}
              className={`flex items-center justify-between p-2 rounded-md transition-all ${
                task.done
                  ? "opacity-60 line-through bg-slate-800 border border-slate-700"
                  : "bg-slate-900 border border-slate-700"
              }`}
            >
              <span>{task.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDone(task)}
                  className="text-green-400 hover:text-green-300"
                  title="Mark as done"
                >
                  ✔
                </button>
                <button
                  onClick={() =>
                    setConfirmModal({
                      show: true,
                      taskId: task.id,
                      title: task.title,
                    })
                  }
                  className="text-red-400 hover:text-red-300"
                  title="Delete task"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {confirmModal.show && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-center shadow-xl max-w-xs w-full scale-100">
            <h4 className="text-lg font-semibold text-white mb-2">
              Confirm Delete
            </h4>
            <p className="text-gray-300 mb-4 text-sm">
              Are you sure you want to delete{" "}
              <span className="text-purple-400 font-medium">
                “{confirmModal.title}”
              </span>
              ?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`${
                  isDeleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } px-4 py-1.5 rounded-md text-white transition`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() =>
                  setConfirmModal({ show: false, taskId: null, title: "" })
                }
                className="bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded-md text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
