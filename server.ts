import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const DATA_DIR = path.join(__dirname, "data");
  const DOCS_DIR = path.join(__dirname, "docs");

  // Ensure directories exist
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DOCS_DIR, { recursive: true });

  // API Routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const data = await fs.readFile(path.join(DATA_DIR, "tasks.json"), "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      await fs.writeFile(path.join(DATA_DIR, "tasks.json"), JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save tasks" });
    }
  });

  app.get("/api/calendar", async (req, res) => {
    try {
      const data = await fs.readFile(path.join(DATA_DIR, "calendar.json"), "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/calendar", async (req, res) => {
    try {
      await fs.writeFile(path.join(DATA_DIR, "calendar.json"), JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save calendar events" });
    }
  });

  app.get("/api/docs", async (req, res) => {
    try {
      const files = await fs.readdir(DOCS_DIR);
      const mdFiles = files.filter(f => f.endsWith(".md"));
      res.json(mdFiles);
    } catch (e) {
      res.json([]);
    }
  });

  app.get("/api/docs/:filename", async (req, res) => {
    try {
      const content = await fs.readFile(path.join(DOCS_DIR, req.params.filename), "utf-8");
      res.json({ content });
    } catch (e) {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.post("/api/docs", async (req, res) => {
    try {
      const { filename, content } = req.body;
      if (!filename || !content) {
        return res.status(400).json({ error: "Filename and content are required" });
      }
      const safeFilename = filename.endsWith(".md") ? filename : `${filename}.md`;
      await fs.writeFile(path.join(DOCS_DIR, safeFilename), content);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save document" });
    }
  });

  app.get("/api/status", (req, res) => {
    res.json({
      status: "online",
      uptime: process.uptime(),
      memory: process.memoryUsage().heapUsed,
      platform: process.platform,
      nodeVersion: process.version
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
