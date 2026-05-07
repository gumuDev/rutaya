# CLAUDE.md

## Project Reference
Project name: `RutaYa`.
Read `README.md` first for product scope, MVP goals, and business context.
This file defines architecture, coding standards, documentation rules, and AI collaboration guidelines.

## Language Rules
- All source code, variables, classes, folders, commits, and comments must be in English.
- UI must support i18n from the beginning.
- Default UI language: Spanish.
- Supported/planned languages: Spanish, English, Quechua, Aymara.
- Never hardcode user-facing text inside components.
- Use translation keys for labels, buttons, messages, errors, and notifications.

## Architecture Overview
Frontend:
- Next.js 16.x, PWA, Ant Design 6.x (antd, @ant-design/icons).
- Feature-based architecture.
- Modular UI components.
Backend:
- NestJS 11.x, Prisma 7.x, PostgreSQL.
- Modular monolith, hexagonal architecture, lightweight DDD.
Infrastructure:
- PostgreSQL locally.
- Supabase PostgreSQL may be used in production mainly as database infrastructure.
- Realtime: Supabase Realtime or NestJS WebSocket.
- Notifications: Telegram Bot API.
- WhatsApp: manual `wa.me` links only for MVP.

## Versions (stable, as of 2026-05-05)
- Next.js: 16.x
- React: 19.x
- Ant Design: 6.x (antd, @ant-design/icons, @ant-design/nextjs-registry)
- TypeScript: 6.x
- NestJS: 11.x
- Prisma: 7.x
- Always use the latest stable version within the major specified above.

## Repository Structure
```txt
apps/{web,api}/
packages/shared/
docs/
apps/web/src/{app,features,shared,i18n}/
apps/api/src/{modules,shared,config}/
```

## Layout Rules

Dashboard layout uses a responsive sidebar:
- Desktop: persistent sidebar visible alongside content
- Mobile/tablet: sidebar collapses, toggled via hamburger button
- Sidebar is shared across admin and operator views, with items filtered by role

Route structure:
```txt
/                        → public passenger flow
/login                   → company login (admin + operator)
/register                → company registration
/dashboard               → company dashboard (admin + operator, sidebar layout)
/dashboard/reservations  → reservations list and management
/dashboard/routes        → route management (admin only)
/dashboard/vehicles      → vehicle management (admin only)
/dashboard/schedules     → schedule management (admin only)
/superadmin              → superadmin panel (sidebar layout)
/superadmin/companies    → company list
/superadmin/companies/[id] → company detail
```

Sidebar visibility by role:
```txt
superadmin  → Companies
admin       → Reservations, Routes, Vehicles, Schedules
operator    → Reservations only
```

## Frontend Rules
Use feature-based architecture.
```txt
features/reservations/
  components/
  hooks/
  services/
  schemas/
  types/
```
- Keep pages thin.
- Keep components small and focused.
- Move logic into hooks, services, or feature modules.
- Avoid business logic inside UI components.
- Keep reusable UI inside `shared/components`.
- Keep domain UI inside its feature folder.
- Use schemas for form validation.
- Use translation keys for all UI text.
- Ticket view must support: save as image, copy code, manual WhatsApp share, and reservation recovery.

## Backend Rules
Use modular monolith with hexagonal architecture.
```txt
module-name/
  domain/
  application/
  infrastructure/
  presentation/
```
- Controllers must be thin.
- Use cases contain application logic.
- Domain contains business rules.
- Infrastructure contains Prisma, Telegram, external services, and adapters.
- Do not access Prisma directly from controllers.
- Do not put business rules in DTOs.
- Domain must not depend on NestJS, Prisma, HTTP, or external APIs.

## Domain Rules
Core concepts: Company, Vehicle, Route, Schedule, Reservation, Passenger, Payment, Notification.

User roles:
```txt
superadmin  - global access, can view all companies and impersonate any company admin
admin       - company owner, full access within their own company
operator    - company employee, manages reservations only (no routes/vehicles/schedules config)
passenger   - public access, can only create and view their own reservations
```
Reservation states:
```txt
pending_payment   - reservation created, waiting for passenger to pay
pending           - payment submitted, waiting for company to confirm
confirmed         - company confirmed payment, seat guaranteed
cancelled         - cancelled by passenger or company
expired           - payment not submitted or confirmed within time limit
boarded           - passenger boarded the vehicle
```

Payment methods:
```txt
bank_transfer     - passenger deposits to company bank account
qr                - passenger scans company QR and pays
```

Payment flow:
1. Passenger creates reservation and selects payment method → status: pending_payment
2. Passenger uploads payment proof (photo) → status: pending
3. Company validates proof and confirms → status: confirmed
4. Expiration applies to pending_payment and pending states
5. Company configures bank account and QR image in their profile
Vehicle types:
```txt
trufi
minibus
bus
```
- Never oversell seats or capacity.
- Reservation creation must be transactional.
- Pending reservations should expire automatically.
- Seat-based and capacity-based reservations must be handled differently.
- Trufi/minibus may use capacity-based reservations.
- Bus/flota may support seat-based reservations later.

## Database and Migration Rules
- Use Prisma migrations.
- All important mutations must be transactional.
- Use database constraints where possible.
- Avoid relying only on frontend validation.
- Use clear indexes for frequent queries.
- Store timestamps for auditable records.
- Every new table, column, relation, index, enum, or constraint change must have a documented migration note.
- Migration notes must be stored in `docs/03-database/migrations/`.
- Migration filename format: `YYYY-MM-DD-short-description.md`.
- Migration notes must include: Title, Context, Changes, Affected tables, Prisma migration name, Rollback notes, Risks.

## Obsidian Documentation Rules
All project documentation must be stored in Obsidian under `docs/`.
```txt
docs/
  00-index.md
  01-product/
  02-architecture/
  03-database/migrations/
  04-api/
  05-frontend/
  06-backend/
  07-decisions/
  08-meetings/
  09-features/{backlog,draft,pending,in-progress,done}/
  10-bugs/{pending,in-progress,done}/
  11-plans/{draft,pending,in-progress,done}/
  12-improvements/{pending,in-progress,done}/
```
ADR files go in `docs/07-decisions/` as `YYYY-MM-DD-title.md`.
ADR template: Context, Decision, Consequences, Alternatives considered.

## Work Tracking Rules
- New product ideas go to `docs/09-features/backlog/`.
- Unclear ideas go to `docs/09-features/draft/`.
- Approved but not started work goes to `pending/`.
- Active work goes to `in-progress/`.
- Completed work goes to `done/`.
- Bugs go to `docs/10-bugs/`.
- Plans and roadmaps go to `docs/11-plans/`.
- Technical or UX improvements go to `docs/12-improvements/`.

## Code Quality Rules
- Maximum file length: 200 lines.
- If a file exceeds 200 lines, split it.
- Prefer small functions and explicit types.
- Avoid duplicated logic and magic strings.
- Use enums or constants for repeated values.
- Validate inputs at boundaries.
- Handle errors consistently.
- Keep naming clear and descriptive.
- Do not create premature abstractions.
- Do not introduce microservices for MVP.

## Testing Rules
Backend: unit tests for use cases, integration tests for reservation flow, transactional seat/capacity logic, and expiration.
Frontend: test important forms, ticket display, reservation recovery, and company dashboard states.

### Mandatory test coverage rule
Every change — feature, improvement, bug fix, or refactor — must include or update tests before it is considered done:
- New use case → unit test for the use case
- New endpoint → integration test covering happy path and main error cases
- Bug fix → regression test that reproduces the bug before the fix
- Frontend form or flow change → update or add component/integration test
- Do not mark any task as done if the related tests are missing or failing.
- Run the full test suite (`pnpm test`) before marking work complete and fix any regressions.

## Responsive Rules
- Every frontend feature must work on both desktop and mobile.
- Desktop: use Ant Design Table for list views.
- Mobile (max-width 768px): replace tables with Cards, one per row.
- Use `useBreakpoint` from `antd` to detect mobile breakpoint.
- Never ship a feature with a table-only view — cards for mobile are required.

## AI Collaboration Rules
- Check existing structure before generating code.
- Follow this architecture before adding files.
- Prefer incremental changes.
- Keep business logic in backend use cases/domain.
- Keep UI text translatable.
- When a feature implementation is complete, always stop and ask the user to test and validate before marking it as done. Never move a feature to done unilaterally.
- Never install global dependencies with npm install -g or similar. Use corepack to enable package managers (e.g. corepack enable pnpm). All other dependencies must be installed at the project level only.
- Update Obsidian docs when architecture or behavior changes.
- Add a migration note when database tables or schema are created or modified.
- Reference `README.md` for project scope.

## Prohibited for MVP
Do not add unless explicitly requested: microservices, Kafka, event sourcing, complex CQRS, native mobile app, WhatsApp Business API, GPS tracking, complex seat map, SIAT integration, or heavy admin ERP features.
