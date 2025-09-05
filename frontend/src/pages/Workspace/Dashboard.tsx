// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

// --- Gemini API Call (can be moved to a separate services/api.ts file later) ---
async function callGeminiAPI(model, userQuery, systemInstruction, useSearch) {
    const API_KEY = ""; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
    };
    if (useSearch) {
        payload.tools = [{ "google_search": {} }];
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // ... (error handling) ...
        throw new Error(`API Error: ${response.status}`);
    }
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
}

const Dashboard = () => {
    const studyGoalInputRef = useRef<HTMLInputElement>(null);
    const studyPlanOutputRef = useRef<HTMLDivElement>(null);
    const generateBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const generatePlanBtn = generateBtnRef.current;
        const studyGoalInput = studyGoalInputRef.current;
        const studyPlanOutput = studyPlanOutputRef.current;
        
        const handleGeneratePlan = async () => {
            if (!studyGoalInput || !studyPlanOutput || !generatePlanBtn) return;
            
            const goal = studyGoalInput.value.trim();
            if (!goal) {
                studyPlanOutput.innerHTML = '<p class="text-red-400">Please enter a study goal.</p>';
                return;
            }

            generatePlanBtn.disabled = true;
            studyPlanOutput.innerHTML = '<p class="text-slate-400">✨ Generating your personalized study plan with Gemini...</p>';

            try {
                const systemPrompt = `You are an expert academic advisor. Create a detailed, actionable study plan. Format the output as clean markdown.`;
                const userQuery = `My study goal is: "${goal}"`;
                const responseText = await callGeminiAPI('gemini-1.5-flash-latest', userQuery, systemPrompt, false);
                studyPlanOutput.innerHTML = marked.parse(responseText);
            } catch (error) {
                console.error("Study Plan Error:", error);
                studyPlanOutput.innerHTML = `<p class="text-red-400">Sorry, there was an error. ${error.message}</p>`;
            } finally {
                generatePlanBtn.disabled = false;
            }
        };

        generatePlanBtn?.addEventListener('click', handleGeneratePlan);
        return () => generatePlanBtn?.removeEventListener('click', handleGeneratePlan);
    }, []);

    return (
        <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <div className="fade-in-up">
                        <h1 className="title-font text-5xl font-bold text-white">Welcome, Vaidehi!</h1>
                        <p className="mt-2 text-lg text-slate-400">Let's turn your notes into knowledge.</p>
                    </div>

                    <div className="mt-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* ... Create Cards section ... */}
                    </div>
                    
                    <div id="study-planner" className="mt-12 fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-2xl font-semibold text-white mb-5 flex items-center">✨ AI Study Planner</h2>
                        <div className="p-6 rounded-2xl bg-[#18181b] border border-[#3f3f46]">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input ref={studyGoalInputRef} id="study-goal-input" type="text" className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="e.g., Prepare for my History midterm" />
                                <button ref={generateBtnRef} id="generate-plan-btn" className="primary-btn font-semibold px-6 py-3 rounded-lg flex items-center justify-center">
                                    <span>Generate Plan</span>
                                </button>
                            </div>
                            <div ref={studyPlanOutputRef} id="study-plan-output" className="mt-6 prose-custom max-w-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;