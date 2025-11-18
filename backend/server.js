// backend/server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// CORS
app.use(cors());

// Body Parser
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/planner', require('./routes/planner_routes'));  // if you have planner
// add other routes here…

// ----------------------------
// ⭐ VAULT AI ROUTE (NEW)
// ----------------------------
app.post('/api/vault', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Call Gemini API
        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        return res.json({ response: reply });

    } catch (error) {
        console.error("Vault AI Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// ----------------------------

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

