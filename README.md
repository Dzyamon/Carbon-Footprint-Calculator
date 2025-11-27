# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jscvKsL7e8YqenXCNs5r3OobqSocxYWI

## Run Locally (Node.js)

1. Install Node.js 18+ or check if installed `node -v` and `npm -v`
2. Install dependencies:  
   `npm install`
3. Start the dev server:  
   `npm run dev`
4. Open `http://localhost:3000`

## Run Locally with Docker

1. Install Docker Desktop (with Docker Compose) and ensure it is running.
2. From the project root run:  
   `docker compose up --build`
3. Visit `http://localhost:3000` for the frontend UI.  
   The backend FastAPI service is exposed at `http://localhost:8000`.
4. To stop the stack press `Ctrl+C`, or run `docker compose down`.  
   Add `-v` to also remove the Postgres volume if you want to wipe stored data.

## Check data in Postres
docker compose exec db psql -U user -d ecocalc
\dt
SELECT id, total, created_at FROM calculations ORDER BY created_at DESC LIMIT 5;
SELECT * FROM usage_summary;
