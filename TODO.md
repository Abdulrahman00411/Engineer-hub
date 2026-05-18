# EngineersHub — Post-Auth Roadmap

## What Was Fixed
- ✅ **Login not redirecting to dashboard** — `handleLogin` was not `await`ing the async `login()` call, causing the Promise to be treated as a truthy error value.

---

## Current State Overview

| Area | Status | Notes |
|---|---|---|
| Auth (login/register/logout) | 🟡 Partial | Works locally; API integration needs live verification |
| Dashboard | 🟡 Basic | Shows profile summary, my jobs (client), drafts, profile completion meter |
| Profile Edit | 🟡 Partial | Freelancers only; clients can't edit their profile |
| Engineers Listing | 🟢 Done | Filters, search, availability toggle, view profile |
| Jobs Listing | 🟢 Done | Filters, bid modal (freelancers only) |
| Bidding Flow | 🟢 Connected | ViewBidsModal for clients, My Bids for freelancers, placeBid calls API |
| Gigs View | ��� Done | Full listing with filters and package selection |
| Gig Ordering | 🟢 Connected | Order model + routes; loads into state via loadOrders() |
| Post Job | 🟡 Partial | Modal works with local state; saves locally; API sync unimplemented |
| Messages/Conversations | 🟢 Connected | loadConversations() on login, 15s polling, normalizes API data |
| Client Profile Update | 🔴 Missing | No `PUT /clients/profile` route; `engineers/profile` is for freelancers only |
| Freelancer "My Bids" View | 🟢 Done | Dashboard shows My Bids for freelancers with status badges |
| Job Detail Page | 🔴 Missing | No dedicated page; everything is inline modals |

---

## Phases NOT Implemented

### Phase 1: Frontend ↔ Backend Data Connection (Critical)

The backend has all routes. The problem is the **frontend is not calling them** or **not using the results**.

#### 1.1 Messages / Conversations — ✅ DONE
- `loadConversations()` fetches from `GET /api/messages` on login and every 15s poll
- `sendMessage()` calls API then reloads conversations for authoritative state
- `normalizeConvo()` bridges MongoDB format to frontend format
- Seed data kept for offline fallback

#### 1.2 Bidding Flow — ✅ DONE
- `placeBid()` calls `api.placeBid()` then `loadMyBids()` on success
- `ViewBidsModal` in Dashboard — client clicks "View Bids →" on their jobs
  - Shows all bids with engineer info, cover letter, amount, duration
  - Accept/Reject buttons call `api.acceptBid()` with instant status badge update
- `GET /jobs/bids/my-bids` backend route for freelancer's submitted bids
- "My Bids" card in Dashboard freelancer section with status badges

#### 1.3 Gig Orders — ✅ DONE
- `Order` model in `backend/src/models/Order.js`
- `GET /orders`, `GET /orders/:id`, `PUT /orders/:id/status` routes
- `POST /gigs/:id/order` creates real Order in DB
- `handleOrderGig()` → `api.orderGig()` → `loadOrders()` → toast
- `updateOrderStatus()` in AppContext updates state and calls API

#### 1.4 Post Job — LOCAL ONLY ⚠️
- Backend `POST /api/jobs` works fine
- Frontend `postJob()` calls API but only saves result to local state
- Jobs from API are fetched on mount but not merged into local seed jobs
- This is acceptable — local fallback for offline use is by design

---

### Phase 2: Missing Frontend UI Components

#### 2.1 Client Profile Editing — STILL MISSING 🔴
- `EditProfileModal` in Dashboard only opens for freelancers
- No client-specific edit modal
- Backend has NO `PUT /clients/profile` route

#### 2.2 Freelancer "My Bids" Dashboard Section — ✅ DONE
- "My Bids" card in Dashboard with refresh button
- Shows job title, amount, duration, category, cover letter excerpt
- Status badges: pending (blue), accepted (green), rejected (red)

#### 2.3 Job Detail Page — STILL MISSING 🔴
- No dedicated page for job details
- All job interaction is inline via `BidModal`
- Lower priority — current UX is functional

#### 2.4 Job Application Status — ✅ DONE
- Freelancer can see bid status on "My Bids" dashboard card
- Status updates to "accepted"/"rejected" when client acts

---

### Phase 3: Still Needs Building

#### 3.1 Order Model & Routes — ✅ DONE

#### 3.2 Freelancer My-Bids Route — ✅ DONE

#### 3.3 Client Profile Update Route — STILL MISSING 🔴
- **Missing:** `PUT /clients/profile` endpoint
- Client cannot edit company name, location, phone, bio

#### 3.4 Freelancer Order Inbox — STILL MISSING 🔴
- Engineer can place gigs but cannot see incoming orders in dashboard
- `orders` state in AppContext includes both client and engineer orders
- Needs a "Incoming Orders" card in freelancer Dashboard section

#### 3.5 Client Dashboard Stats Not Synced — STILL MISSING 🔴
- `totalSpent`, `postedJobs` shown from local seed data
- Should reflect actual posted jobs count and cumulative order amounts

---

## Verification: Backend Routes vs Frontend Calls

| Backend Route | Frontend Calling It? | Notes |
|---|---|---|
| `GET /api/messages` | ✅ Yes | Via `loadConversations()` on login & 15s polling |
| `POST /api/messages` | ✅ Yes | Via `sendMessage()` when starting new conversation |
| `POST /api/messages/:id/message` | ✅ Yes | Via `sendMessage()` on existing convo |
| `PUT /api/messages/:id/read` | ✅ Yes | Via `markRead()` |
| `POST /api/jobs` | ✅ Yes | Via `postJob()` — saves to state |
| `GET /api/jobs/client/my-jobs` | ⚠️ Called | Result not merged into jobs state on mount |
| `POST /api/jobs/:id/bid` | ✅ Yes | Via `placeBid()` + reloads myBids after |
| `GET /api/jobs/:id/bids` | ✅ Yes | Via `ViewBidsModal` in Dashboard |
| `PUT /api/jobs/bid/:bidId` | ✅ Yes | Via `ViewBidsModal` accept/reject buttons |
| `GET /api/jobs/bids/my-bids` | ✅ Yes | Via `loadMyBids()` on login & Dashboard mount |
| `POST /api/gigs/:id/order` | ✅ Yes | Creates real Order in DB; result loaded via `loadOrders()` |
| `GET /api/orders` | ✅ Yes | Via `loadOrders()` on login |
| `PUT /api/orders/:id/status` | ✅ Yes | Via `updateOrderStatus()` |
| `PUT /engineers/profile` | ✅ Yes | Used by updateProfile for freelancers |
| `PUT /clients/profile` | ❌ No route | Doesn't exist |

---

## Testing Checklist

After each auth-related change, verify:
- [ ] Login with correct credentials → Dashboard
- [ ] Login with wrong credentials → Error message shown
- [ ] Register new account → Auto-login → Dashboard
- [ ] Logout → Redirected to home, navbar shows Login button
- [ ] Refresh page → Stay logged in
- [ ] Client vs Freelancer sees different dashboard content