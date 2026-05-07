# RutaYa MVP

RutaYa is a web and PWA platform for reserving interprovincial transport tickets in Bolivia.

The MVP focuses on helping small and medium transport companies publish routes, schedules, vehicle types, and receive reservations in real time.

---

## Main Goal

Allow passengers to quickly reserve a ticket or seat without needing to call or ask manually through WhatsApp.

Allow transport companies to manage routes, schedules, vehicles, and reservations from a simple dashboard.

---

## MVP Scope

The MVP includes:

- Company registration
- Company dashboard
- Vehicle registration
- Vehicle types
- Route creation
- Schedule creation
- Passenger reservation flow
- Reservation code generation
- Digital ticket view
- Save ticket as image
- Manual WhatsApp share button
- Telegram notification for companies
- Real-time reservation updates
- Reservation recovery by phone and code

---

## Vehicle Types

Supported vehicle types:

- Trufi
- Minibus
- Bus / Flota

Different vehicle types may have different reservation behavior.

Example:

- Trufi: reserve by passenger quantity
- Minibus: reserve by available capacity
- Bus / Flota: may support seat selection later

---

## Passenger Flow

1. Passenger selects origin, destination, and date.
2. Passenger sees available schedules.
3. Passenger selects a trip.
4. Passenger enters name, phone, and passenger quantity.
5. System creates a pending reservation.
6. Passenger sees a digital ticket.
7. Passenger can save the ticket as an image.
8. Passenger can copy the reservation code.
9. Passenger can manually share the ticket through WhatsApp.

---

## Company Flow

1. Company registers.
2. Company creates vehicles.
3. Company creates routes.
4. Company creates schedules.
5. Company receives reservations in real time.
6. Company receives Telegram alerts.
7. Company confirms, cancels, or marks reservations as boarded.

---

## Recommended Tech Stack

Frontend:

- Next.js
- Tailwind CSS
- PWA
- i18n support

Backend:

- NestJS
- Prisma
- PostgreSQL
- Hexagonal architecture
- Lightweight DDD

Database:

- PostgreSQL locally
- Supabase PostgreSQL optionally in production

Notifications:

- Telegram Bot API
- Manual WhatsApp links through `wa.me`

Realtime:

- Supabase Realtime or NestJS WebSocket

---

## Architecture Reference

Development rules, architecture guidelines, code standards, documentation rules, and AI collaboration rules are defined in:

```txt
CLAUDE.md
```

Read `CLAUDE.md` before making technical changes.

---

## Documentation

All documentation should be stored in Obsidian under:

```txt
docs/
```

Important architecture decisions must be documented using ADR files.

Database schema changes must be documented under:

```txt
docs/03-database/migrations/
```

Every new table, column, relation, index, enum, or constraint change should include a migration note.

---

## MVP Principle

The product should stay simple.

The main goal is not to build a large transport ERP.

The main goal is:

```txt
Make reserving a ticket faster than asking manually through WhatsApp.
```
