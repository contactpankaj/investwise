import express from "express";
import path from "path";

import Groq from 'groq-sdk';
// const Groq = require('groq-sdk');
// const express = require("express");
// const path = require("path");

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

const API_KEY = "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";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve index.html when visiting the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use(express.json());

// API route for chatbot - cannot use 'groq' directly on frontend due to browser restrictions (since it is node.js package)
app.post("/api/chat", async (req, res) => {
    const messages = req.body.messages;
  
    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 1,
        max_completion_tokens: 150,
        top_p: 1,
        stream: false,
        stop: null
      });
  
      const content = chatCompletion.choices[0]?.message?.content;
      res.json({ reply: content });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});