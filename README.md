# TripFlow

TripFlow is a travel planning workspace with a web app, API server, shared database schema, and generated API clients.

## Local Setup On Windows / VS Code

1. Install dependencies:

   ```powershell
   pnpm run setup:windows
   pnpm install
   ```

2. If pnpm asks about ignored builds, approve `esbuild`:

   ```powershell
   pnpm approve-builds
   ```

   Select `esbuild`, then run `pnpm install` again.

3. Create a local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Start the original TripFlow mobile app in the browser:

   ```powershell
   pnpm run dev
   ```

   The Expo web app runs at `http://localhost:8081`.

   The old Replit component preview can still be opened with:

   ```powershell
   pnpm run dev:web-preview
   ```

5. Start a local Postgres database and apply the schema:

   ```powershell
   pnpm run db:docker:up
   pnpm run db:push
   ```

   This will start PostgreSQL on `localhost:5432` and create the TripFlow schema.

6. Start the API server when Postgres is running:

   ```powershell
   pnpm run dev:api
   ```

   The API runs at `http://localhost:8080/api`.

## Useful Commands

```powershell
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/db run push
```

## Project Structure

- `artifacts/mockup-sandbox` - React/Vite web app
- `artifacts/api-server` - Express API server
- `lib/db` - Drizzle database schema and connection
- `lib/api-zod` - generated Zod/API types
- `lib/api-client-react` - generated React Query API client
