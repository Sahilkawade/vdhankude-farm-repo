# Architecture Proposal — Hydroponic Farming Website (MVP)

> Status: **PROPOSAL — awaiting approval.** No application code has been written.
> Source of truth: `Hydroponic_Farming_Website_Master_Development_Prompt.md`.
> Private details stay as placeholders: `[FARM_NAME]`, `[LOCATION]`, `[PHONE]`, `[EMAIL]`, `[FOUNDER_NAME]`, `[FARM_SIZE]`, `[ESTABLISHED_YEAR]`, `[SOCIAL_LINKS]`.

---

## 1. Requirements summary

| Concern | What the spec asks for | What it means for the architecture |
|---|---|---|
| Purpose | Marketing, education and lead generation. Not e-commerce, a CMS, an ERP or an IoT system. | Mostly static content plus one write path (enquiries). |
| Pages | Home, About, Hydroponics, Our Farm, Training, Farm Setup, Contact/Visit | 7 static routes, and room to add `/learn`, `/blog`, `/crops`, `/projects` later. |
| Conversion | Every page moves the visitor along **Learn → Visit → Train → Plan → Build → Grow → Automate** | Reusable CTA and journey blocks. The enquiry form can be pre-filled from any CTA. |
| Data | Store enquiries for admin review. Scheduling comes later. | One small relational model. No auth in the MVP. |
| Branding | Logo not final. Colors, type, buttons and header may change. | All branding sits in one layer that can be swapped (section 5). |
| Content | Placeholders only. No invented stats, crops, testimonials or IoT features. | Copy lives in typed content files, separate from components. |
| Quality | SEO, a11y, responsive, performance, security | Pre-rendered HTML per route, semantic markup, image pipeline, rate-limited API. |

---

## 2. System architecture

```text
                        ┌─────────────────────────────────────────────┐
  Visitor (browser) ──▶ │  hydro-farm-web  (React + TS + Vite)        │
                        │  Pre-rendered static HTML per route         │
                        │  hydrates into a React SPA                  │
                        │  Hosted on static hosting / CDN             │
                        └───────────────┬─────────────────────────────┘
                                        │ HTTPS  POST /api/{contact|farm-visits|
                                        │        training-enquiries|setup-enquiries}
                                        ▼
                        ┌─────────────────────────────────────────────┐
                        │  ASP.NET Core backend (layered, section 7)  │
                        │  WebApi → Services → Repositories           │
                        │  Application (contracts) · Domain (entities)│
                        │  Infrastructure (EF Core, DbContext)        │
                        └───────────────┬─────────────────────────────┘
                                        │ EF Core
                                        ▼
                        ┌─────────────────────────────────────────────┐
                        │  SQL Server  (LocalDB in dev, Azure SQL /   │
                        │  SQL Server in prod) — Enquiries table      │
                        └─────────────────────────────────────────────┘

  Later (not built now):  Admin UI + auth ─▶ same API  │  Appointments  │
                          Email/WhatsApp notifications │  IoT platform as a SEPARATE system
```

Principles:
1. **Content is static, enquiries are dynamic.** Page copy ships with the frontend build, so most of the site works even if the API is down.
2. **One write path.** The API's only public job in the MVP is accepting enquiries safely.
3. **Seams for the future, not features.** `Enquiry.Status`, `INotificationSender` and the brand layer exist so later phases can be added without rewrites. Nothing else is built ahead of time.
4. **IoT stays separate.** When it becomes real it gets its own service and storage, linked from the marketing site.

---

## 3. Sitemap

```text
/                 Home            (storytelling + conversion)
/about            About Us
/hydroponics      Hydroponics     (education hub, includes FAQ)
/our-farm         Our Farm
/training         Training
/farm-setup       Farm Setup
/contact          Contact / Visit (enquiry form; ?interest=farm-visit|training|setup|consultation|general)
/*                404 page
```

Future routes (not built): `/learn`, `/blog`, `/crops`, `/projects`.

**Header nav:** Logo · Home · About · Hydroponics · Our Farm · Training · Farm Setup · Contact · **[Visit Our Farm]** (primary CTA)
**Mobile:** sticky compact header, a hamburger that opens a full-height panel, and the CTA kept visible in the panel.

---

## 4. Home page section hierarchy

| # | Section | H-level | Primary CTA → destination |
|---|---|---|---|
| 0 | Header (sticky) | — | Visit Our Farm → `/contact?interest=farm-visit` |
| 1 | Hero: eyebrow, H1 "Grow More. Grow Smarter. Grow Anywhere.", support line | H1 | Explore Hydroponics → `/hydroponics` · Visit Our Farm |
| 2 | What is Hydroponics? (image + plain-language definition + where it's used) | H2 | Learn About Hydroponics → `/hydroponics` |
| 3 | Why Hydroponics? (6 benefits, carefully worded, no unsupported claims) | H2 | — |
| 4 | You Don't Need a Huge Farm to Start (Home / Terrace / Small Farm / Commercial) | H2 | each tile → `/farm-setup#<scale>` |
| 5 | How We Help: Learn → Visit → Train → Build → Grow | H2 | each step → its page |
| 6 | See Hydroponics in Action (farm visit) | H2 | Schedule a Farm Visit → `/contact?interest=farm-visit` |
| 7 | Learn From Experience (training topics, no invented programs) | H2 | Enquire About Training → `/contact?interest=training` |
| 8 | Ready to Start Your Own Hydroponic Farm? (4 setup categories) | H2 | Discuss Your Setup → `/contact?interest=setup` |
| 9 | The Future of Hydroponics is Smart (labelled **"Our vision for the future"**) | H2 | — (no promises, no fake readings) |
| 10 | Final CTA: Ready to Explore Hydroponic Farming? | H2 | Visit Our Farm · Talk to Us |
| 11 | Footer (brand, description, links, contact, location, social, ©) | — | — |

Sections 4, 5, 8 and 10 are **shared blocks** that also appear on Farm Setup, About and every page footer-CTA. That's why they live in `components/blocks`, not inside the home page.

---

## 5. Branding & logo strategy (centralized, replaceable)

### 5.0 Final brand (received 2026-10)

- **Name:** V Dhankude Farm · **Tagline:** Smart Farming - Fresh Future
- **Source:** `docs/design/brand-source/brand-stationery.pdf` (vector business card, letterhead, envelope)
- **Web logo files** (extracted from the PDF vectors): `docs/design/assets/brand/`
  - `logo-full.svg` / `logo-full-inverse.svg`: mark + name + tagline (footer, large sizes)
  - `logo-compact.svg` / `logo-compact-inverse.svg`: no tagline, for the header. The tagline is unreadable below ~60px logo height. Ask the designer to confirm this variant.
  - `logo-mark.svg` / `logo-mark-inverse.svg` / `logo-mark-mono.svg`: the "D" leaf mark (favicon, mobile, watermark)
- **Palette from the logo:** Forest `#00381B`, Wordmark `#004B23`, Leaf `#009E3C`, Lime `#99CE13`, Graphite `#454646`. Lime and Leaf fail contrast as text on white, so they're used for accents, marks and buttons only.
- **Type:** logo lettering is a geometric sans (Gotham-style). Montserrat is the closest free web match for headings.
- These files move to `src/brand/assets/` in Phase 1.

Branding is a separate layer. **Components never reference a hex value, font family or logo file directly.**

```text
src/brand/                       ← the ONLY folder that changes when the final logo arrives
├── brand.config.ts              name, short name, tagline, theme-color, OG image, logo alt text
├── tokens.css                   PRIMITIVES: raw palette, font families, radius/shape scale
├── Logo.tsx                     <Logo variant="full|mark" tone="default|inverse" />
└── assets/
    ├── logo-full.svg            placeholder now → final later
    ├── logo-mark.svg
    ├── logo-full-inverse.svg
    └── og-default.jpg

src/styles/theme.css             SEMANTIC tokens mapped from primitives
                                 (--color-primary, --color-surface-inverse, --color-accent,
                                  --font-display, --radius-control, --header-height …)
```

Two token layers:

```text
brand/tokens.css (primitives)        styles/theme.css (semantic)          components
--brand-green-700: #2F6B3F   ──▶     --color-primary: var(--brand-green-700)   ──▶  .button { background: var(--color-primary) }
--brand-font-display: "…"    ──▶     --font-display: var(--brand-font-display) ──▶  h1 { font-family: var(--font-display) }
--brand-radius-shape: 999px  ──▶     --radius-control: var(--brand-radius-shape)──▶ .button { border-radius: var(--radius-control) }
```

**When the final logo arrives, the checklist is:**
1. Drop the SVGs into `src/brand/assets/` (same file names).
2. Adjust the primitive values in `src/brand/tokens.css` (colors, maybe fonts, maybe radius).
3. Update `brand.config.ts` (name, alt text, theme-color).
4. Regenerate favicon and OG image from the mark (one script: `npm run brand:icons`).

Nothing in `components/` or `pages/` should need editing. Optional guard: a Stylelint rule that rejects hex colors outside `src/brand/` and `src/styles/`.

The two design prototypes (section 11) use exactly this model. The same markup is restyled entirely by swapping token sets.

---

## 6. Frontend architecture (`hydro-farm-web`)

### 6.1 Key decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript (strict) + Vite | As specified. |
| Routing & SEO | **React Router v8 in framework mode, `ssr: false` + `prerender: true`** for the 7 routes (v8 became current before implementation; same API as v7 for this setup) | A plain Vite SPA serves one empty `index.html`, which is weak for SEO and link previews. Pre-rendering gives real HTML, titles, meta and OG tags per URL at build time, with no Node server in production. It's still a Vite app and still deploys as static files. |
| Page metadata | Route `meta` exports, generated from content files | Titles, descriptions and OG tags stay next to the content they describe. |
| Styling | **CSS Modules + CSS custom properties** (design tokens) | No runtime cost, no utility-class sprawl, and tokens make rebranding a one-file change. Tailwind would also work, but it spreads design decisions across JSX, which works against centralized branding. |
| Content | Typed TS content files in `src/content/` | Copy and placeholders change without touching components. Easy to move to an API/CMS later. |
| Images | `<SiteImage id="home.hero" />` + `src/content/images.ts` registry + `vite-imagetools` (AVIF/WebP, responsive `srcset`) | Swap a photo in one place. Lazy by default, eager + `fetchpriority="high"` for the hero. Shows a labelled placeholder until real photos exist. |
| Forms | Native form + small `useEnquiryForm` hook + shared validation rules | One form with a few variants doesn't justify react-hook-form or zod. Easy to add later if forms grow. |
| Animation | CSS transitions + one `useReveal` hook (IntersectionObserver) | Subtle fades only, disabled under `prefers-reduced-motion`. No animation library. |
| Icons | A small set of inline SVG icons in `components/ui/Icon.tsx` | The spec warns against excessive icons, so we won't add an icon package. |
| API access | `services/apiClient.ts` (fetch wrapper → typed result, ProblemDetails parsing) + `services/enquiryService.ts` | API calls stay out of UI components. |
| Dev API calls | Vite dev proxy `/api → https://localhost:<api-port>` | Same-origin in dev, so no CORS friction. CORS is configured explicitly for production. |
| Testing | Vitest + Testing Library for form logic and key components | Light and fast. No E2E suite in the MVP. |

### 6.2 Folder structure

```text
hydro-farm-web/
├── public/
│   ├── robots.txt
│   ├── favicon.svg                 (generated from brand mark)
│   └── site.webmanifest
├── scripts/
│   ├── generate-sitemap.ts         builds sitemap.xml from the route list at build time
│   └── generate-brand-icons.ts     favicon / apple-touch / OG from src/brand/assets
├── src/
│   ├── brand/                      ★ branding layer (see section 5)
│   │   ├── brand.config.ts
│   │   ├── tokens.css
│   │   ├── Logo.tsx
│   │   └── assets/
│   ├── styles/
│   │   ├── theme.css               semantic tokens
│   │   ├── base.css                reset, type scale, focus-visible, selection
│   │   └── layout.css              container, section rhythm, visually-hidden
│   ├── config/
│   │   ├── site.ts                 [FARM_NAME], [PHONE], [EMAIL], [LOCATION], [SOCIAL_LINKS], nav items
│   │   └── env.ts                  typed access to VITE_API_BASE_URL
│   ├── content/                    all page copy as typed data, no JSX
│   │   ├── home.ts
│   │   ├── about.ts
│   │   ├── hydroponics.ts          incl. systems (NFT, DWC, Dutch bucket) + soil-vs-hydro table
│   │   ├── farm.ts
│   │   ├── training.ts
│   │   ├── setup.ts
│   │   ├── contact.ts              form options ("Interested In", contact methods)
│   │   ├── faq.ts
│   │   ├── journey.ts              Learn → Visit → Train → Build → Grow (single source)
│   │   ├── scales.ts               Home / Terrace / Small Farm / Commercial (single source)
│   │   └── images.ts               image registry: id → src, alt, width, height
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── ui/                     design-system primitives
│   │   │   ├── Button.tsx          (button + link variants: primary / secondary / ghost / inverse)
│   │   │   ├── Container.tsx
│   │   │   ├── Section.tsx         (tone: default | tint | inverse)
│   │   │   ├── SectionHeading.tsx  (eyebrow + title + intro)
│   │   │   ├── Badge.tsx
│   │   │   ├── Accordion.tsx       (FAQ, built on <details>)
│   │   │   └── Icon.tsx
│   │   ├── media/
│   │   │   ├── SiteImage.tsx
│   │   │   └── ImagePlaceholder.tsx
│   │   ├── blocks/                 composed sections reused across pages
│   │   │   ├── SplitFeature.tsx    image + text, either side
│   │   │   ├── FeatureList.tsx     benefits
│   │   │   ├── ScaleOptions.tsx    Home / Terrace / Small Farm / Commercial
│   │   │   ├── JourneySteps.tsx
│   │   │   ├── ProcessSteps.tsx    Farm Setup's 8-step process
│   │   │   ├── FaqList.tsx
│   │   │   └── CtaBanner.tsx
│   │   └── forms/
│   │       ├── EnquiryForm.tsx
│   │       ├── fields/             TextField, SelectField, TextAreaField, RadioGroup
│   │       ├── useEnquiryForm.ts   state, validation, submit, loading/error/success
│   │       └── enquiryRules.ts     validation rules (mirror the API's)
│   ├── pages/                      one folder per route, sections colocated
│   │   ├── home/
│   │   │   ├── HomePage.tsx
│   │   │   └── sections/           HeroSection, WhatIsHydroponics, WhyHydroponics,
│   │   │                           AnyoneCanStart, HowWeHelp, FarmVisit, TrainingTeaser,
│   │   │                           FarmSetupTeaser, SmartFarmingVision, FinalCta
│   │   ├── about/AboutPage.tsx (+ sections/)
│   │   ├── hydroponics/HydroponicsPage.tsx (+ sections/)
│   │   ├── our-farm/OurFarmPage.tsx (+ sections/)
│   │   ├── training/TrainingPage.tsx
│   │   ├── farm-setup/FarmSetupPage.tsx
│   │   ├── contact/ContactPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   └── enquiryService.ts
│   ├── hooks/
│   │   └── useReveal.ts
│   ├── types/
│   │   ├── enquiry.ts              matches API DTOs
│   │   └── content.ts              shared content shapes (ImageRef, Cta, Faq…)
│   ├── root.tsx                    html shell, fonts, global CSS, <PageLayout>
│   └── routes.ts                   route table (also feeds prerender + sitemap)
├── react-router.config.ts          { appDirectory: "src", ssr: false, prerender: [...] }
├── vite.config.ts                  dev proxy, imagetools
├── tsconfig.json                   strict
├── eslint.config.js
├── .prettierrc
├── .env.example                    VITE_API_BASE_URL=
└── package.json
```

Changes from the spec's §20 structure, and why:
- `components/home/*` moves to `pages/home/sections/*`. Page-specific sections sit next to their page. Anything reused goes to `components/blocks`.
- `data/` is renamed `content/` and expanded. All copy lives there, not only farm, crops and training.
- New `brand/`, `styles/`, `config/` folders, required for the replaceable branding.
- `crops.ts` is **not** created yet. The spec says not to invent crop names, so it's added when real data exists.

---

## 7. Backend architecture (layered, one project per responsibility)

> **Revised 2026-10-24** at your request. This replaces the earlier single-project `HydroFarm.Api` design. It uses .NET 10 LTS, ASP.NET Core Web API (controllers), EF Core and SQL Server.

### 7.1 Projects and responsibilities

| Project | Owns | Must never contain |
|---|---|---|
| **HydroFarm.Domain** | Entities, enums, domain constants (field lengths, reference format) | EF Core, ASP.NET, DTOs. It has **no package references**. |
| **HydroFarm.Application** | Request/response DTOs, application models (read models, SP result shapes), **all interfaces** (services, repositories, unit of work, integrations), validators, application exceptions, settings consumed by services, constants (error codes) | EF Core, SQL, HTTP types |
| **HydroFarm.Services** | Business workflows that implement the service interfaces: create contact / farm-visit / training / setup enquiries, normalise input, generate references, map DTO ↔ entity, call repositories, commit via unit of work, trigger notifications | `DbContext`, SQL, `HttpContext` |
| **HydroFarm.Repositories** | Repository implementations: CRUD, LINQ queries, stored-procedure calls, entity → read-model projection | Business rules, request validation |
| **HydroFarm.Infrastructure** | `AppDbContext`, EF Core entity configurations, migrations, SP definition scripts, database settings and connection setup, interceptors, `UnitOfWork`, external integrations (notification senders) | Controllers, business rules |
| **HydroFarm.WebApi** | Controllers, middleware, filters, HTTP configuration (CORS, rate limiting, OpenAPI), `Program.cs` as the **composition root**, `appsettings*.json` | Business logic, `DbContext` use, SQL |

### 7.2 Dependency rules

```text
            ┌───────────────────────────────────────────────┐
            │ HydroFarm.WebApi  (composition root)          │
            │ controllers depend ONLY on Application        │
            │ interfaces; other references are for DI wiring│
            └──┬───────────────┬───────────────┬────────────┘
               │               │               │
               ▼               ▼               ▼
      HydroFarm.Services  HydroFarm.Repositories ──▶ HydroFarm.Infrastructure
               │               │                          │
               └───────┬───────┴──────────────────────────┘
                       ▼
             HydroFarm.Application
                       │
                       ▼
               HydroFarm.Domain   (depends on nothing)
```

| Project | References |
|---|---|
| Domain | none |
| Application | Domain |
| Services | Application, Domain |
| Infrastructure | Application, Domain |
| Repositories | Application, Domain, Infrastructure (for `AppDbContext`) |
| WebApi | Application, Services, Repositories, Infrastructure |

The key rule: **Services never reference Repositories or Infrastructure.** They only see the interfaces in Application. That has two benefits:
- Services can be unit-tested with mocked repositories.
- A repository can switch from LINQ to a stored procedure (or to Dapper) without any change in Services.

These rules are enforced by an architecture test project, so a wrong `using` fails the build pipeline.

**Changes I recommend to your starting tree:**

| Your tree | Proposed | Why |
|---|---|---|
| `Services/Interfaces`, `Repositories/Interfaces` | Move to **`Application/Interfaces/{Services,Repositories,Persistence,Integrations}`** | If interfaces stay next to their implementations, WebApi must reference the concrete Services project, and Services must reference Repositories, which drags EF Core into the business layer. With interfaces in Application, each layer depends only on contracts. |
| `Infrastructure/DbContext` folder | `Infrastructure/Persistence/AppDbContext.cs` (+ `Configurations/`, `Migrations/`, `Interceptors/`, `Sql/`) | Groups everything EF Core-specific in one place. |
| Entities (unspecified) | `Domain/Entities` | Domain defines what an enquiry *is*. Infrastructure defines how it's *stored*. |
| `Repositories/StoredProcedures` | Keep, for SP **calls** only. SP **definitions** (`.sql`) live in `Infrastructure/Persistence/Sql` and are deployed by migrations. | Schema and procedures are versioned together. Repositories only execute them. |
| — | Add **`IUnitOfWork`** (interface in Application, implementation in Infrastructure) | Repositories don't call `SaveChanges`; the service commits once per workflow. This stays correct when one workflow touches several repositories (e.g. enquiry + appointment later). |
| — | Add a `DependencyInjection.cs` to **Application** and **Infrastructure** too | Each layer registers its own types, so `Program.cs` stays a few lines. |
| `HydroFarm.sln` | `HydroFarm.slnx` | It's VS 2026's default solution format; `.sln` also works if you prefer. |

### 7.3 Folder structure

```text
src/
├── HydroFarm.Domain/
│   ├── Entities/
│   │   ├── BaseEntity.cs                 Id, CreatedAtUtc, UpdatedAtUtc
│   │   ├── Enquiry.cs                    abstract base: reference, status, name, email, phone,
│   │   │                                 location, preferred contact method, message, consent
│   │   ├── ContactEnquiry.cs             general enquiry / consultation
│   │   ├── FarmVisitRequest.cs           preferred date, time of day, group size
│   │   ├── TrainingEnquiry.cs            topics of interest, experience level
│   │   └── SetupEnquiry.cs               setup scale, available space
│   ├── Enums/
│   │   ├── EnquiryType.cs                Contact | FarmVisit | Training | Setup
│   │   ├── EnquiryStatus.cs              New | InReview | Contacted | Closed
│   │   ├── ContactMethod.cs              Phone | Email | WhatsApp
│   │   ├── ContactTopic.cs               General | Consultation
│   │   ├── SetupScale.cs                 Home | Terrace | SmallFarm | Commercial
│   │   └── ExperienceLevel.cs            None | Beginner | Experienced
│   └── Constants/
│       └── EnquiryRules.cs               max lengths, reference prefix; shared by EF config AND validators
│
├── HydroFarm.Application/
│   ├── DTOs/
│   │   └── Enquiries/
│   │       ├── Requests/
│   │       │   ├── EnquiryRequestBase.cs          shared contact fields + anti-spam fields
│   │       │   ├── CreateContactEnquiryRequest.cs
│   │       │   ├── CreateFarmVisitRequest.cs
│   │       │   ├── CreateTrainingEnquiryRequest.cs
│   │       │   └── CreateSetupEnquiryRequest.cs
│   │       └── Responses/
│   │           └── EnquiryCreatedResponse.cs      { reference }
│   ├── Models/
│   │   └── Enquiries/EnquirySummary.cs            read model (future admin list / SP result)
│   ├── Interfaces/
│   │   ├── Services/IEnquiryService.cs
│   │   ├── Repositories/IEnquiryRepository.cs
│   │   ├── Persistence/IUnitOfWork.cs
│   │   └── Integrations/INotificationSender.cs
│   ├── Validators/
│   │   └── Enquiries/                             one validator per request (+ shared base rules)
│   ├── Exceptions/
│   │   ├── AppException.cs
│   │   ├── NotFoundException.cs
│   │   └── ConflictException.cs
│   ├── Settings/
│   │   └── EnquirySettings.cs                     e.g. minimum form-fill seconds
│   ├── Constants/
│   │   └── ErrorCodes.cs
│   └── DependencyInjection.cs                     AddApplication(): validators, settings
│
├── HydroFarm.Services/
│   ├── Implementations/
│   │   ├── EnquiryService.cs
│   │   └── ReferenceGenerator.cs                  "ENQ-7K3P9Q"-style references
│   ├── Mapping/
│   │   └── EnquiryMappings.cs                     hand-written DTO ↔ entity mapping (no AutoMapper)
│   └── DependencyInjection.cs                     AddServices()
│
├── HydroFarm.Repositories/
│   ├── Implementations/
│   │   └── EnquiryRepository.cs                   Add / GetByReference / List / UpdateStatus / Delete
│   ├── Queries/
│   │   └── EnquiryQueries.cs                      reusable IQueryable filters and projections
│   ├── StoredProcedures/
│   │   ├── StoredProcedureNames.cs                constants, e.g. "dbo.usp_Enquiries_GetSummary"
│   │   └── EnquiryProcedures.cs                   typed, parameterised SP wrappers
│   └── DependencyInjection.cs                     AddRepositories()
│
├── HydroFarm.Infrastructure/
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   ├── UnitOfWork.cs
│   │   ├── Configurations/                        IEntityTypeConfiguration<T> per entity
│   │   │   ├── EnquiryConfiguration.cs            table, TPH discriminator, indexes, enum-as-string
│   │   │   ├── FarmVisitRequestConfiguration.cs
│   │   │   ├── TrainingEnquiryConfiguration.cs
│   │   │   └── SetupEnquiryConfiguration.cs
│   │   ├── Interceptors/
│   │   │   └── AuditTimestampsInterceptor.cs      sets CreatedAtUtc / UpdatedAtUtc
│   │   ├── Migrations/
│   │   └── Sql/StoredProcedures/                  *.sql, embedded, applied by migrations
│   ├── Notifications/
│   │   └── LoggingNotificationSender.cs           logs only; email/WhatsApp senders later
│   ├── Settings/
│   │   └── DatabaseSettings.cs                    command timeout, retry count
│   └── DependencyInjection.cs                     AddInfrastructure(IConfiguration)
│
└── HydroFarm.WebApi/
    ├── Controllers/
    │   ├── ContactController.cs                   POST /api/contact
    │   ├── FarmVisitsController.cs                POST /api/farm-visits
    │   ├── TrainingEnquiriesController.cs         POST /api/training-enquiries
    │   └── SetupEnquiriesController.cs            POST /api/setup-enquiries
    ├── Middleware/
    │   ├── GlobalExceptionHandler.cs              IExceptionHandler → ProblemDetails
    │   └── CorrelationIdMiddleware.cs
    ├── Filters/
    │   ├── ValidationFilter.cs                    runs Application validators → 400 ProblemDetails
    │   └── AntiSpamFilter.cs                      honeypot + minimum fill time
    ├── Configuration/
    │   ├── CorsConfiguration.cs        + CorsSettings.cs
    │   ├── RateLimitingConfiguration.cs + RateLimitSettings.cs
    │   └── OpenApiConfiguration.cs
    ├── Properties/launchSettings.json
    ├── appsettings.json                           no secrets, no connection string values
    ├── appsettings.Development.json
    └── Program.cs                                 AddApplication().AddServices().AddRepositories().AddInfrastructure()

tests/
├── HydroFarm.UnitTests/            services (mocked repositories), validators, reference generator
├── HydroFarm.IntegrationTests/     WebApplicationFactory against real SQL Server (Testcontainers or LocalDB)
└── HydroFarm.ArchitectureTests/    enforces the dependency rules in 7.2
```

### 7.4 Request flow (example: farm visit)

```text
POST /api/farm-visits
  │
  ├─ WebApi   rate limiter ("enquiries" policy)                         → 429 if exceeded
  ├─ WebApi   AntiSpamFilter (honeypot filled / form submitted too fast) → fake success, nothing saved
  ├─ WebApi   ValidationFilter → CreateFarmVisitRequestValidator (Application) → 400 ProblemDetails
  ├─ WebApi   FarmVisitsController.Create(request, ct)  → IEnquiryService.CreateFarmVisitAsync
  │
  ├─ Services EnquiryService: normalise input → map to FarmVisitRequest entity → generate reference
  │                           → IEnquiryRepository.Add(entity) → IUnitOfWork.SaveChangesAsync()
  │                           → INotificationSender.EnquiryReceivedAsync(...)
  │
  ├─ Repos    EnquiryRepository.Add → AppDbContext (no SaveChanges here)
  ├─ Infra    UnitOfWork.SaveChangesAsync → AuditTimestampsInterceptor → SQL Server
  │
  └─ WebApi   201 Created { reference }
     Any unhandled exception → GlobalExceptionHandler → ProblemDetails (no internals leaked)
```

### 7.5 Database and entity management

| Topic | Decision |
|---|---|
| Entities | `Domain/Entities`: plain C# classes with no EF attributes |
| Mapping | `Infrastructure/Persistence/Configurations`, loaded with `ApplyConfigurationsFromAssembly` |
| Inheritance | **TPH (table-per-hierarchy)**: one `Enquiries` table with an `EnquiryType` discriminator. Each enquiry type gets its own entity, DTO, validator and endpoint, while admins still get **one inbox** and one status workflow. |
| `DbContext` | `Infrastructure/Persistence/AppDbContext.cs`, registered in `AddInfrastructure` with `UseSqlServer(...)`, `EnableRetryOnFailure`, `MigrationsAssembly(Infrastructure)` |
| Migrations | Live in Infrastructure; WebApi is the startup project:<br>`dotnet ef migrations add InitialCreate --project src/HydroFarm.Infrastructure --startup-project src/HydroFarm.WebApi --output-dir Persistence/Migrations` |
| Default data access | EF Core LINQ, parameterised automatically |
| Stored procedures | **Used only where they earn their place**: reporting/aggregation, bulk operations, logic a DBA wants to own. The MVP needs none. The first likely one is an admin dashboard summary (`usp_Enquiries_GetSummary`) in roadmap phase 2. Definitions live in `Infrastructure/Persistence/Sql/StoredProcedures/*.sql`, applied via `migrationBuilder.Sql(...)`. Calls live in `Repositories/StoredProcedures`, using `Database.SqlQuery<T>($"EXEC ... {param}")` / `ExecuteSqlAsync`. Interpolated values become SQL parameters; there is never string concatenation. Result shapes live in `Application/Models`. |
| Connection string | `ConnectionStrings:Default`: **User Secrets** in development, environment variable `ConnectionStrings__Default` (or Azure Key Vault) in production. Never committed. |

### 7.6 Configuration and cross-cutting concerns: where each lives

| Concern | Location |
|---|---|
| DI registration | Each layer's `DependencyInjection.cs` (`AddApplication`, `AddServices`, `AddRepositories`, `AddInfrastructure`). `Program.cs` only chains them. |
| Settings/options classes | The layer that **consumes** them: `CorsSettings`, `RateLimitSettings` → WebApi/Configuration; `DatabaseSettings`, notification settings → Infrastructure/Settings; `EnquirySettings` → Application/Settings. All bound with `ValidateOnStart()`. |
| Validation | Rules in `Application/Validators`; execution in `WebApi/Filters/ValidationFilter` |
| Exceptions | Types in `Application/Exceptions`; HTTP mapping in `WebApi/Middleware/GlobalExceptionHandler` |
| Middleware | `WebApi/Middleware` (exception handling, correlation ID) |
| CORS, rate limiting, OpenAPI | `WebApi/Configuration` extension methods |
| Logging | `ILogger<T>` injected in every layer. The provider (console now; Serilog / Application Insights later) is configured **only** in WebApi. |
| Time | Built-in `TimeProvider` injected, so time is testable |
| Health checks | Registered in WebApi; the DB check comes from Infrastructure (`AddDbContextCheck<AppDbContext>`) |
| Secrets | User Secrets (dev), environment variables / Key Vault (prod). No secret values in any `appsettings*.json`. |

No MediatR and no AutoMapper: controllers call services directly, and mapping is hand-written. Both libraries would add indirection without solving a real problem at this size.

### 7.7 Data model (MVP: one table, TPH)

```text
Enquiries
─────────────────────────────────────────────────────────────────────────────
-- shared (Enquiry base)
Id                     uniqueidentifier   PK
EnquiryType            nvarchar(20)       discriminator: Contact | FarmVisit | Training | Setup
Reference              nvarchar(12)       human-friendly, e.g. "ENQ-7K3P9Q", unique
Status                 nvarchar(20)       New (default) | InReview | Contacted | Closed
Name                   nvarchar(100)      required
Email                  nvarchar(254)      nullable  ┐ at least one
Phone                  nvarchar(20)       nullable  ┘ required
Location               nvarchar(100)      nullable  (city/area only)
PreferredContactMethod nvarchar(20)       Phone | Email | WhatsApp
Message                nvarchar(2000)     nullable
SourcePage             nvarchar(100)      nullable  (which page/CTA it came from)
ConsentAcceptedAt      datetime2          required
CreatedAtUtc           datetime2
UpdatedAtUtc           datetime2          nullable
-- ContactEnquiry
ContactTopic           nvarchar(20)       nullable  General | Consultation
-- FarmVisitRequest
PreferredVisitDate     date               nullable
PreferredTimeOfDay     nvarchar(20)       nullable  Morning | Afternoon
GroupSize              int                nullable
-- TrainingEnquiry
TopicsOfInterest       nvarchar(500)      nullable
ExperienceLevel        nvarchar(20)       nullable
-- SetupEnquiry
SetupScale             nvarchar(20)       nullable at DB level, required by the validator for Setup
AvailableSpace         nvarchar(200)      nullable  (free text, e.g. "terrace, roughly 20 × 15 ft")
Indexes: (Status, CreatedAtUtc), (EnquiryType), unique (Reference)
```

The type-specific fields are my proposal for useful form fields. They're easy to change before the first migration.

No IP address or user-agent is stored. The spec says not to collect unnecessary personal data.

**Future path (not built):** `Appointments (Id, EnquiryId FK, SlotId, Status, …)`, `AppointmentSlots`, `Users/Admins` (ASP.NET Core Identity), `Notifications`. These all hang off `Enquiry` without changing it. IoT tables (`IoTDevices`, `SensorReadings`) belong in a separate service and database.

### 7.8 API

Routes follow the spec (section 23):

```text
POST /api/contact               CreateContactEnquiryRequest   (Contact page: general / consultation)
POST /api/farm-visits           CreateFarmVisitRequest
POST /api/training-enquiries    CreateTrainingEnquiryRequest
POST /api/setup-enquiries       CreateSetupEnquiryRequest

  shared body fields: name, email?, phone?, location?, preferredContactMethod, message?,
                      sourcePage?, consent: true, website: "" (honeypot), formStartedAt
  201 Created              { reference }
  400 Bad Request          ProblemDetails with field errors
  429 Too Many Requests
  500                      ProblemDetails (no internals)

GET /health                     200 Healthy / 503 Unhealthy
```

`GET /api/farm` and `GET /api/training` are still deferred (content stays in the frontend for the MVP).

Future (admin, authenticated): `GET /api/enquiries`, `PATCH /api/enquiries/{id}/status`, `/api/appointments` (CRUD as in the spec). Appointments will reference `Enquiries.Id`.

---

## 8. Solution / repository layout

The current repo has a Visual Studio .NET 7 template (`vdhankude-farm-app/` with WeatherForecast). Proposal: **replace it** with this layout.

```text
vdhankude-farm-repo/
├── HydroFarm.slnx                  (solution folders: src, tests; web opened as folder or .esproj)
├── Directory.Build.props           shared: net10.0, nullable, implicit usings, warnings as errors
├── Directory.Packages.props        central NuGet versions for all projects
├── src/
│   ├── HydroFarm.Domain/
│   ├── HydroFarm.Application/
│   ├── HydroFarm.Services/
│   ├── HydroFarm.Repositories/
│   ├── HydroFarm.Infrastructure/
│   ├── HydroFarm.WebApi/
│   └── hydro-farm-web/
├── tests/
│   ├── HydroFarm.UnitTests/
│   ├── HydroFarm.IntegrationTests/
│   └── HydroFarm.ArchitectureTests/
├── docs/
│   ├── ARCHITECTURE.md             (this file)
│   └── design/
│       └── homepage-directions.html (the two design prototypes)
├── .editorconfig
├── .gitignore                      (.NET + Node + .vs)
└── README.md                       (local setup)
```

The project names stay brand-neutral (`HydroFarm.*`) on purpose, so a final farm name never forces a rename of namespaces.

---

## 9. Dependencies

### npm (`hydro-farm-web`)
| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI |
| `react-router`, `@react-router/dev`, `@react-router/node` | routing, pre-rendering (build-time only) |
| `vite`, `typescript` | build |
| `vite-imagetools` | responsive AVIF/WebP images |
| `isbot` | required by React Router's default server entry used while pre-rendering |
| `@fontsource-variable/montserrat`, `@fontsource-variable/manrope` | self-hosted fonts (no third-party font requests) |
| dev: `eslint` 10 + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y-x`, `prettier` | code quality and a11y linting. `jsx-a11y-x` is the maintained fork; the original plugin doesn't support ESLint 10. |
| dev: TypeScript 6.0 | `typescript-eslint` doesn't support TypeScript 7 yet |
| dev: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom` | tests |
| dev (optional): `stylelint` | block hard-coded colors outside the brand layer |

No UI kit, CSS-in-JS, animation, icon or form libraries.

### NuGet (per project)
| Project | Packages |
|---|---|
| Domain | none |
| Application | `FluentValidation`, `FluentValidation.DependencyInjectionExtensions`, `Microsoft.Extensions.Options` |
| Services | `Microsoft.Extensions.Logging.Abstractions` |
| Repositories | none extra (EF Core comes via the Infrastructure reference) |
| Infrastructure | `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.EntityFrameworkCore.Design` (private assets), `Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore` |
| WebApi | `Microsoft.AspNetCore.OpenApi`, `Scalar.AspNetCore` (API docs, dev only), `Microsoft.EntityFrameworkCore.Design` (EF tooling startup project) |
| UnitTests | `xunit.v3`, `NSubstitute` |
| IntegrationTests | `xunit.v3`, `Microsoft.AspNetCore.Mvc.Testing`, `Testcontainers.MsSql` (needs Docker; LocalDB is the fallback) |
| ArchitectureTests | `xunit.v3`, `NetArchTest.Rules` |

Rate limiting, ProblemDetails, CORS, DI, `TimeProvider` and health checks are built into ASP.NET Core / .NET 10. Integration tests use real SQL Server rather than SQLite or InMemory, because stored procedures and SQL Server-specific mappings don't run on those.

---

## 10. Local development setup

Prerequisites:
- **.NET 10 SDK** 10.0.401+ (pinned in `global.json`, which also selects the Microsoft.Testing.Platform runner that xUnit v3 requires for `dotnet test`)
- **Visual Studio 2026** (VS 2022 can't target .NET 10), or VS Code / Rider
- Node.js 22.22+ (React Router 8 minimum). Node 24 LTS (24.22.1) is installed on this machine.
- SQL Server LocalDB (comes with VS) or SQL Server Developer/Express
- `dotnet tool install --global dotnet-ef`

Running locally:
1. API: in `src/HydroFarm.WebApi` run `dotnet user-secrets set ConnectionStrings:Default "<localdb conn>"`, then `dotnet ef database update --project src/HydroFarm.Infrastructure --startup-project src/HydroFarm.WebApi`, then run `HydroFarm.WebApi` from VS (https://localhost:7xxx).
2. Web: `npm install`, then `npm run dev` (http://localhost:5173). `/api` is proxied to the API.
3. `npm run build` outputs pre-rendered static HTML to `build/client/`.

---

## 11. UI / design structure

### 11.1 Design system foundation (shared by both directions)

- **Grid:** 12 columns, max content width 1200px, side gutter `clamp(16px, 4vw, 40px)`.
- **Breakpoints:** 480 / 768 / 1024 / 1280. Mobile layouts are designed per section (stacked, reordered, horizontal scroll only for small tiles), not just shrunk.
- **Section rhythm:** vertical padding `clamp(56px, 8vw, 112px)`. Sections alternate between default, tint and inverse tones to pace the long home page.
- **Type scale:** H1 `clamp(40px, 6vw, 72px)` · H2 `clamp(30px, 4vw, 46px)` · H3 22–24px · body 17–18px · small 14px · eyebrow 12–13px uppercase with tracking.
- **Components:** Button (primary / secondary / ghost / inverse, min height 48px for touch), Eyebrow, SectionHeading, Badge ("Coming next"), Chip, ImagePlaceholder, Accordion, form fields with visible labels, inline errors and `aria-describedby`.
- **Motion:** 150–250ms ease-out on hover/focus, one fade-up reveal per section, nothing looping, all disabled with `prefers-reduced-motion`.
- **Accessibility:** WCAG 2.2 AA contrast, visible `:focus-visible` rings from tokens, skip-to-content link, one H1 per page.

### 11.2 Two prototype directions

Both prototypes are in `docs/design/homepage-directions.html` and use **the same markup**. Only the token set and some layout rules change, which demonstrates the replaceable-branding approach.

| | **A — "Rooted"** (nature & education led) | **B — "Grow Lab"** (technology & consulting led) |
|---|---|---|
| Feeling | Calm, warm, approachable, like a good teacher | Precise, modern, confident, like an agritech consultancy |
| Palette | Logo greens on off-white, with lime for small accents (like the letterhead) | Forest panels and the brand gradient, with lime CTAs (like the business card) |
| Type | Montserrat (headings) + Manrope (body) | Montserrat 800 + IBM Plex Sans (body) + JetBrains Mono (labels, data) |
| Hero | Split: copy left, tall rounded farm photo right | Full-bleed farm photo with dark overlay and an inline journey strip |
| Shapes | Soft: 24px media radius, pill buttons | Crisp: 6px radius, square-ish buttons, hairline grids |
| Journey | Connected dots on a line | Numbered columns 01–05 (it's a real sequence) |
| Smart farming | Light vision card with parameter chips | Dark "monitoring concept" panel with units and no values, clearly labelled as not live |
| Leans on | The letterhead: white page, faint "D" watermark | The business card: dark green gradient, white mark |

**Chosen: A · Rooted.** Phase 1 builds the brand tokens and components from Direction A. Direction B stays in the prototype file for reference only.

---

## 12. Development phases

| Phase | Scope | Output |
|---|---|---|
| 1 Setup | Replace template, solution layout, Vite + React Router (prerender), brand layer + tokens, base styles, layout shell (header/footer/mobile nav), lint/format | Running empty site with routes |
| 2 Home | All 11 home sections with placeholder images/content | Complete home page |
| 3 Core pages | About, Hydroponics (incl. FAQ), Our Farm | |
| 4 Business pages | Training, Farm Setup, Contact (form UI with client-side validation) | |
| 5 Backend | Six projects + DI wiring, four enquiry endpoints, validators, services, repositories, unit of work, rate limit, anti-spam, ProblemDetails, health, unit + architecture tests | |
| 6 Database | Entities + TPH configuration, `InitialCreate` migration, LocalDB, integration tests → wire the forms end-to-end | Working enquiry flow |
| 7 Quality | SEO (meta/OG/sitemap/robots), a11y audit, Lighthouse pass, image optimization | |
| 8 Deployment | Prod config, static hosting for web, App Service (or similar) for API, SQL, HTTPS, domain, monitoring | |
| — Branding | Final logo applied via section 5 checklist, at any phase | |

---

## 13. Decisions needed from you before coding

1. **.NET version.** ✅ Settled: **.NET 10 LTS** with Visual Studio 2026 (SDK 10.0.401 installed).
2. **Replace the existing `vdhankude-farm-app` template** with the `src/` + `tests/` layout above.
3. **Layered backend (section 7)**: six projects as you requested, with these changes to your tree:
   a. all interfaces live in **Application** (not in Services/Repositories);
   b. **`IUnitOfWork`** added; repositories don't call `SaveChanges`;
   c. SP definitions in Infrastructure, SP calls in Repositories; LINQ by default;
   d. architecture tests enforce the dependency rules.
4. **Four endpoints, one `Enquiries` table (TPH)** (replaces my earlier single-endpoint proposal), plus the type-specific fields in 7.7.
5. **Defer `GET /api/farm` and `GET /api/training`** (content stays in the frontend for now).
6. **React Router (v8) framework mode with pre-rendering** for SEO (still Vite, still static hosting).
7. **CSS Modules + tokens** (no Tailwind).
8. **Design direction:** ✅ Settled: **A · Rooted** (confirmed 2026-10-24).
