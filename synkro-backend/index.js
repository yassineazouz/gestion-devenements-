const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successful"))
    .catch((err) => console.error("DB Connection Error:", err));

// Server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}!`);
});