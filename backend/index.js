const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const {userRouter} = require("./routes/user")
const {adminRouter} = require("./routes/admin")
const { GoogleGenAI } = require("@google/genai");

app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = "AIzaSyDB7nno6S22RVUo0PmrjT9t6UX5HwL4Y-Q";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/api/incubators", async (req, res) => {
  const { model, field } = req.body;

  // Dynamic prompt includes the field and asks Gemini for logos as well
  const prompt = `
    List 10 startup incubators in the "${field}" field as a JSON array with: 
    name, description, country, most_invested_field, and logo_url (give a valid company logo image URL in https//: correct form that can be accessible or official placeholder if no logo).
    Example: [{"name":"X", "description":"...", "country":"US", "most_invested_field":"${field}", "logo_url":"https://..."}, ...]
    Respond with only the JSON, nothing else.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const aiText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = aiText.match(/\[.*\]/s);
    const cleanJson = match ? match[0] : aiText;
    const incubatorArr = JSON.parse(cleanJson);
    res.json({ incubators: incubatorArr });
  } catch (e) {
    res.status(500).json({ error: e.message, details: e.response?.data });
  }
});

app.post("/api/incubator-details", async (req, res) => {
  const { model, incubator_name } = req.body;
  
  const prompt = `
    Give a concise dashboard summary in JSON only for the startup incubator "${incubator_name}".
    Include fields: founder, invested_companies (list), holdings (list), growth_stats (recent 3 years), dashboard_insights (short summary).
    Respond with ONLY JSON, eg:
    {
      "founder": "...",
      "invested_companies": ["Company A", "Company B"],
      "holdings": ["Tech", "AI", "Fintech"],
      "growth_stats": "Growth rate 25% avg, doubled number of investments last 3 years.",
      "dashboard_insights": "Leading in early-stage tech, high annual growth."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const aiText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = aiText.match(/\{.*\}/s); // Match object braces (could improve w/ validation)
    const cleanJson = match ? match[0] : aiText;
    const details = JSON.parse(cleanJson);
    res.json({ details });
  } catch (e) {
    res.status(500).json({ error: e.message, details: e.response?.data });
  }
});



app.post("/api/programs", async (req, res) => {
  const { model,field } = req.body;

  const prompt = `
    List 10 Events that are going to incubate startups in the "${field}" field  as JSON array with: name, description, country, most_invested_field.
    Example: [{"name":"X", ...}]
    Respond with only the JSON, nothing else.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const aiText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = aiText.match(/\[.*\]/s);
    const cleanJson = match ? match[0] : aiText;
    const incubatorArr = JSON.parse(cleanJson);
    res.json({ incubators: incubatorArr });
  } catch (e) {
    res.status(500).json({ error: e.message, details: e.response?.data });
  }
});

      
async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Example app listening at http:/user//user/localhost:${port}`);
    });
  }
  main()