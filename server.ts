import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// load .env first, then override with .env.local if present
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Supabase client (service role key used on server)
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // keep this secret
  const supabase = createClient(supabaseUrl, supabaseKey);

  // legacy filesystem directories (only used in development fallback)
  const DATA_DIR = path.join(__dirname, "data");
  const DOCS_DIR = path.join(__dirname, "docs");

  // Ensure directories exist (dev only)
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DOCS_DIR, { recursive: true });

  // API Routes
  app.get("/api/tasks", async (req, res) => {
    if (supabaseUrl) {
      // read from Supabase table `tasks`
      const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true });
      if (error) {
        console.error('supabase tasks select error', error);
        return res.json([]);
      }
      return res.json(data);
    }

    // fallback to local filesystem for development
    try {
      const data = await fs.readFile(path.join(DATA_DIR, "tasks.json"), "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/tasks", async (req, res) => {
    if (supabaseUrl) {
      try {
        // Upsert whole list; you could also insert individual rows or perform transactions
        const { data, error } = await supabase.from('tasks').upsert(req.body);
        if (error) throw error;
        return res.json({ success: true, data });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to save tasks" });
      }
    }

    // fallback to filesystem
    try {
      await fs.writeFile(path.join(DATA_DIR, "tasks.json"), JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save tasks" });
    }
  });

  app.get("/api/calendar", async (req, res) => {
    if (supabaseUrl) {
      const { data, error } = await supabase.from('calendar').select('*').order('date');
      if (error) {
        console.error('supabase calendar select error', error);
        return res.json([]);
      }
      return res.json(data);
    }

    try {
      const data = await fs.readFile(path.join(DATA_DIR, "calendar.json"), "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/calendar", async (req, res) => {
    if (supabaseUrl) {
      try {
        const { data, error } = await supabase.from('calendar').upsert(req.body);
        if (error) throw error;
        return res.json({ success: true, data });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to save calendar events" });
      }
    }

    try {
      await fs.writeFile(path.join(DATA_DIR, "calendar.json"), JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save calendar events" });
    }
  });

  app.get("/api/docs", async (req, res) => {
    if (supabaseUrl) {
      const { data, error } = await supabase.from('docs').select('filename');
      if (error) {
        console.error('supabase docs list error', error);
        return res.json([]);
      }
      return res.json(data.map((r: any) => r.filename));
    }

    try {
      const files = await fs.readdir(DOCS_DIR);
      const mdFiles = files.filter(f => f.endsWith(".md"));
      res.json(mdFiles);
    } catch (e) {
      res.json([]);
    }
  });

  app.get("/api/docs/:filename", async (req, res) => {
    if (supabaseUrl) {
      const { data, error } = await supabase.from('docs').select('content').eq('filename', req.params.filename).single();
      if (error) {
        return res.status(404).json({ error: "File not found" });
      }
      return res.json({ content: data.content });
    }

    try {
      const content = await fs.readFile(path.join(DOCS_DIR, req.params.filename), "utf-8");
      res.json({ content });
    } catch (e) {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.post("/api/docs", async (req, res) => {
    if (supabaseUrl) {
      try {
        const { filename, content } = req.body;
        if (!filename || !content) {
          return res.status(400).json({ error: "Filename and content are required" });
        }
        const safeFilename = filename.endsWith(".md") ? filename : `${filename}.md`;
        const { data, error } = await supabase.from('docs').upsert({ filename: safeFilename, content });
        if (error) throw error;
        return res.json({ success: true, data });
      } catch (e) {
        res.status(500).json({ error: "Failed to save document" });
      }
    }

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
