# EngineersHub — Post-Auth Roadmap

## What Was Fixed
- ✅ **Login not redirecting to dashboard** — `handleLogin` was not `await`ing the async `login()` call, causing the Promise to be treated as a truthy error value.

---

## Current State Overview

| Area | Status | Notes |
|---|---|---|
| Auth (login/register/logout) | 🟡 Partial | Works locally; API integration needs verification |
| Dashboard | 🟡 Basic | Shows profile summary, my jobs (client), drafts, profile completion meter |
| Profile Edit | 🟡 Partial | Freelancers only; clients can't edit their profile |
| Engineers Listing | 🟢 Done | Filters, search, availability toggle, view profile |
| Jobs Listing | 🟢 Done | Filters, bid modal (freelancers only) |
| Bidding Flow | 🔴 Incomplete | Bids stored locally; not persisted per-user or synced to API |
| Gigs | 🟢 Done (view) | Order modal shows packages but order is not persisted |
| Gig Ordering | 🔴 Incomplete | Alert only; no real order storage |
| Post Job | 🟢 Done (local) | Modal exists; saves to localStorage |
| Messages/Conversations | 🔴 Incomplete | Local seed data only; no real API sync |
| Auth Persistence | 🟡 Untested | Token saved to localStorage; needs page-refresh test |

---

## Priority Tasks

### P0 — Critical (Auth & Core Flow)

1. **[ ] Verify login redirects properly**
   - After successful login, `setPage("dashboard")` should fire
   - Dashboard should render user data immediately
   - Test: login → modal closes → dashboard shows correct user name/stats

2. **[ ] Add client profile editing**
   - Currently only freelancers have `EditProfileModal`
   - Clients need ability to update company name, location, phone, bio

3. **[ ] Freelancer "My Bids" view**
   - Dashboard only shows "My Posted Jobs" for clients
   - Freelancers need to see jobs they've bid on with status

4. **[ ] Persistent auth on page refresh**
   - `user` state is restored from localStorage on mount
   - Verify token is sent with API requests after refresh
   - Consider calling `/auth/me` on mount to validate token freshness

### P1 — High (Data Sync & Messaging)

5. **[ ] Message conversation sync with API**
   - Currently uses local seed data (`getInitialConvos`)
   - Need to fetch real conversations from `GET /messages`
   - Need to send messages via `POST /messages/:id/message`

6. **[ ] Real-time-ish message updates**
   - Polling-based approach is fine initially
   - Or use WebSocket if backend supports it

7. **[ ] Bid persistence per user**
   - Currently bids are placed locally (`placeBid` does nothing real when offline)
   - Need `GET /jobs/:id/bids` for clients to view bids on their jobs
   - Need bid status tracking (pending, accepted, rejected)

8. **[ ] Gig order persistence**
   - Orders currently just `alert()` and do nothing
   - Need `POST /gigs/:id/order` call
   - Engineer should see incoming orders in dashboard

### P2 — Medium (UI Polish & Feature Parity)

9. **[ ] Client dashboard stats**
   - `totalSpent`, `postedJobs` are hardcoded seed values
   - Should reflect actual posted jobs and order amounts

10. **[ ] Freelancer earnings tracker**
    - `totalEarned`, `completedJobs` are static
    - After a gig/job is marked complete, these should update

11. **[ ] Job detail page**
    - Clicking a job opens BidModal inline
    - No dedicated job detail page with full description, client info, bid history

12. **[ ] Job application status**
    - Freelancers don't know if their bid was accepted/rejected
    - Need status indicator on "My Bids"

### P3 — Nice to Have

13. **[ ] Search across all pages**
    - Engineers page has search
    - Jobs/Gigs pages have search — good
    - Global search in navbar would be better

14. **[ ] Email/password change**
    - No "forgot password" or "change password" flow

15. **[ ] Notifications bell**
    - New bids on your job, new messages, bid accepted/rejected
    - Currently toasts handle this passively

16. **[ ] Dark mode toggle**
    - CSS variables suggest theming capability

---

## Backend Routes Needed (if not already implemented)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/messages` | Fetch user's conversations |
| POST | `/messages` | Start a new conversation |
| GET | `/jobs/:id/bids` | Client views bids on their job |
| PUT | `/jobs/:id/bid/:bidId` | Accept/reject a bid |
| POST | `/gigs/:id/order` | Place a gig order |
| GET | `/orders` | View my orders (client or engineer) |
| PUT | `/orders/:id/status` | Mark order complete |
| GET | `/engineers/profile` | Get current user's full profile |
| PUT | `/clients/profile` | Update client profile |

---

## Testing Checklist

After each auth-related change, verify:
- [ ] Login with correct credentials → Dashboard
- [ ] Login with wrong credentials → Error message shown
- [ ] Register new account → Auto-login → Dashboard
- [ ] Logout → Redirected to home, navbar shows Login button
- [ ] Refresh page → Stay logged in
- [ ] Client vs Freelancer sees different dashboard content