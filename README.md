<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/242e24d0-5e6e-4d28-b5ae-4a7a98a4781f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Using Supabase for persistent storage 🗄️

This project can store tasks, calendar events, and documents in Supabase instead of the local filesystem.

1. **Create a Supabase project** at https://app.supabase.com.
2. Add three tables (or run the migrations shown below):
   ```sql
   create table tasks (
     id text primary key,
     title text not null,
     status text not null
   );

   create table calendar (
     id text primary key,
     title text not null,
     date timestamp with time zone not null
   );

   create table docs (
     filename text primary key,
     content text not null
   );
   ```
3. In your environment files (`.env.local`, `netlify.toml` or Netlify dashboard) set:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key      # exposed to the browser
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # used by the server only
   ```
4. Install the client library and rebuild:
   ```bash
   npm install @supabase/supabase-js
   npm run build   # or npm run dev again
   ```
5. The components will automatically switch to Supabase when `VITE_SUPABASE_URL` is defined.
   You can also call the `/api/*` endpoints — the server uses the service role key.

> **Note:** environment variables prefixed with `VITE_` are embedded in the frontend bundle. Keep the service role key secret (only set it in Netlify's UI or server `.env`).

Deploy on Netlify as usual; the server functions will talk to Supabase and your data will survive refreshes.
