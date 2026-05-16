# Implementation Plan - Consignment Website with Admin Dashboard

This plan outlines the steps to build a frontend-only consignment tracking website. Since no server-side database (Supabase/Postgres) is available, all data will be managed via `localStorage` for the duration of the session to demonstrate functionality.

## Scope Summary
- **Public Site**: Landing page, "Track Shipment" interface.
- **Admin Dashboard**: Create, update, and delete consignments.
- **Tracking System**: Search by unique tracking number to see shipment status/history.
- **Data Persistence**: `localStorage` (client-side only).

## Non-Goals
- Server-side persistence or multi-user sync (beyond one browser).
- Real email notifications.
- Live GPS tracking (will use status-based updates).
- Production-grade authentication (will use a simple local admin password check).

## Affected Areas
- `src/App.tsx`: Main routing and layout.
- `src/components`: New components for tracking, admin forms, and dashboards.
- `src/lib/storage.ts`: Utility for managing consignment data in `localStorage`.

## Phases

### Phase 1: Foundation & Data Layer
- Define the `Consignment` type (ID, tracking number, sender, receiver, status, history, weight, etc.).
- Implement a simple storage utility (`src/lib/storage.ts`) to handle CRUD operations on `localStorage`.
- Set up basic routing (Home/Track, Admin Login, Admin Dashboard).
- **Owner**: `frontend_engineer`

### Phase 2: Public Tracking Interface
- Create a landing page with a hero section.
- Build the tracking search component.
- Build the "Tracking Result" view showing shipment progress (stepper component).
- **Owner**: `frontend_engineer`

### Phase 3: Admin Dashboard & Management
- Create a simple admin login page (mocked).
- Build the Dashboard overview (total shipments, active shipments).
- Build the "Create Shipment" form (auto-generates tracking numbers).
- Build the "Update Shipment" interface (change status, add history logs).
- **Owner**: `frontend_engineer`

### Phase 4: Refinement & UI/UX
- Add feedback toasts for actions (shipment created, status updated).
- Polish the "Tracking Stepper" visuals using shadcn/ui components.
- Ensure responsive design for mobile tracking.
- **Owner**: `quick_fix_engineer` (for CSS/UI polish)

## Assumptions & Open Questions
- **Assumption**: The "Tracking Number" is a string like `CONS-XXXX-XXXX`.
- **Question**: Are there specific statuses required? (Defaulting to: Pending, Picked Up, In Transit, Out for Delivery, Delivered, Cancelled).
