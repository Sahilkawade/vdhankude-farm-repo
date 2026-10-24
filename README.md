# V Dhankude Farm website

Marketing, education and lead-generation website for a hydroponic farm.
Architecture and decisions: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```text
HydroFarm.slnx                 .NET solution (backend + tests)
src/
  HydroFarm.Domain/            entities, enums, domain constants
  HydroFarm.Application/       DTOs, interfaces, validators
  HydroFarm.Services/          business workflows
  HydroFarm.Repositories/      database access (EF Core queries, stored procedure calls)
  HydroFarm.Infrastructure/    DbContext, migrations, integrations
  HydroFarm.WebApi/            controllers, middleware, Program.cs
  hydro-farm-web/              React + TypeScript + Vite frontend
tests/                         unit, integration and architecture tests
docs/                          architecture, design prototypes, brand source files
```

## Prerequisites

- .NET SDK 10.0.401+ (pinned in `global.json`)
- Visual Studio 2026 (or VS Code / Rider)
- Node.js 22.22+ (24 LTS recommended)
- SQL Server LocalDB (from Phase 6)

## Backend

```bash
dotnet build HydroFarm.slnx
dotnet test --solution HydroFarm.slnx
dotnet run --project src/HydroFarm.WebApi --launch-profile https
```

- API: https://localhost:7237 · health check: `/health` · API reference (Development only): `/scalar`
- Secrets (connection strings) go in User Secrets, never in `appsettings*.json`:
  `dotnet user-secrets set ConnectionStrings:Default "<connection string>" --project src/HydroFarm.WebApi`
- `tests/HydroFarm.ArchitectureTests` fails the build if a layer references something it must not (see ARCHITECTURE.md §7.2).

## Frontend

```bash
cd src/hydro-farm-web
npm install
npm run dev          # http://localhost:5173, /api is proxied to the WebApi
npm run build        # pre-renders every page to build/client
npm run typecheck
npm run lint
npm run format
```

Copy `.env.example` to `.env.local` for local overrides. `VITE_` values are public, so never put secrets in them.

## Changing the branding

Everything brand-specific lives in `src/hydro-farm-web/src/brand/`:

1. Replace the SVGs in `brand/assets/` (keep the file names).
2. Adjust colour, font and shape values in `brand/tokens.css`.
3. Update name, tagline, theme colour and logo aspect ratios in `brand/brand.config.ts`.

Components only use the semantic tokens in `styles/theme.css`, so nothing else needs to change.
