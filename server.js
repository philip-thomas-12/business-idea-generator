
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.static("public"));

app.get('/api/idea', async (req, res) => {
  const topic = req.query.topic;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const prompt = `Generate a creative and practical business idea related to "${topic}". 
Include:
1. Business concept
2. Target audience
3. Revenue model
4. Steps to start`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const idea = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No idea generated.";
    console.log("Gemini response:", idea);
    res.json({ idea });

  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ idea: "Failed to generate business idea. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

