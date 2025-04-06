import express from "express";
import path from "path";

// const express = require("express");
// const path = require("path");
const __dirname = new URL('.', import.meta.url).pathname;

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve index.html when visiting the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});