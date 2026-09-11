import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "256kb" }));

const saves = new Map();
const profiles = new Map();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "stellerio-api", time: new Date().toISOString() });
});

app.get("/api/games/:id/data", (req, res) => {
  res.json({
    gameId: req.params.id,
    save: saves.get(req.params.id) ?? null,
    leaderboard: [
      { rank: 1, name: "Player One", score: 0 },
      { rank: 2, name: "Player Two", score: 0 },
      { rank: 3, name: "Player Three", score: 0 }
    ]
  });
});

app.get("/api/users/:id", (req, res) => {
  res.json({ id: req.params.id, profile: profiles.get(req.params.id) ?? null });
});

app.post("/api/games/:id/save", (req, res) => {
  const payload = req.body;
  saves.set(req.params.id, payload);
  res.status(204).end();
});

app.put("/api/users/:id", (req, res) => {
  profiles.set(req.params.id, req.body);
  res.json({ ok: true });
});

app.get("/api/games/:id/leaderboard", (_req, res) => {
  res.json({ gameId: _req.params.id, entries: [] });
});

app.listen(PORT, () => {
  console.log(`Stellerio API listening on :${PORT}`);
});
