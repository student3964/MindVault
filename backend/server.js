// backend/server.js

const express = require('express');
const cors = require('cors'); // 👈 Import cors
const connectDB = require('./config/db'); // Example for DB connection

const app = express();

// Connect Database
connectDB();

// ✅ ADD CORS MIDDLEWARE ✅
// This allows requests from any origin. For production, you'd want to restrict this.
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
// ... other routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));