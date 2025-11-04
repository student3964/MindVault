// src/pages/Planner/AIStudyPlan.tsx
import React, { useState } from "react";
import { generateAIPlan } from "../../api/planner";

const AIStudyPlan: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [subjects, setSubjects] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal || !subjects || !timeframe) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateAIPlan({
        goals: goal,
        subjects,
        timeframe,
      });

      setPlan(data.plan);
    } catch (error) {
      console.error("Error generating plan:", error);
    }
    setLoading(false);
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-semibold mb-4 text-center">Create AI Study Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter your goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="p-3 rounded-md bg-slate-800 border border-slate-700 text-white"
        />
        <input
          type="text"
          placeholder="Key Subjects (comma separated)"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          className="p-3 rounded-md bg-slate-800 border border-slate-700 text-white"
        />
        <input
          type="text"
          placeholder="Time Frame (e.g. 2 weeks)"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="p-3 rounded-md bg-slate-800 border border-slate-700 text-white"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-purple-600 px-6 py-2 rounded-md text-white hover:bg-purple-700 transition"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {plan && (
        <div className="mt-8 p-4 bg-slate-900 border border-slate-700 rounded-lg text-gray-300 whitespace-pre-line">
          {plan}
        </div>
      )}
    </div>
  );
};

export default AIStudyPlan;
