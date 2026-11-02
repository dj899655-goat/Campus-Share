# CampusShare — P2P Item Lending & Borrowing within a College

**Status:** Scaffolding complete & fully operational  
**Scope:** College-only (no Aadhaar/DigiLocker, no 5–6 km radius).  
**Auth:** College email + OTP verification.  
**Tech:** Next.js (App Router) + Tailwind CSS + JSON file database (zero setup).

---

## 1. The Idea

Students own items they don't use every day — scientific calculators, engineering textbooks, sports gear, lab coats, project kits, chargers, etc. Other students need those same things for a day or two. **CampusShare** lets students:

1. **Verify** with their college email (OTP).
2. **Choose** a role: Lend (list your items) or Borrow (browse others' items).
3. **Request** to borrow an item; the owner approves or declines.
4. **Exchange** the item safely on campus and return it when finished.

It is peer-to-peer in the *marketplace* sense: students deal directly with each other on campus. The web application itself is a modern Next.js client–server architecture.

---

## 2. Systematic Workflow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Step 1:    │─────▶│ Step 2:      │─────▶│ Step 3:     │
│  Login with │      │ Choose:      │      │ Lend /      │
│  college    │      │ Lend or      │      │ Borrow      │
│  email +    │      │ Borrow       │      │             │
│  OTP        │      │              │      │             │
└─────────────┘      └──────────────┘      └──────┬──────┘
                                                  │
              ┌───────────────┐                   │
              │               ▼                   │
              ▼              ┌─────────────┐      │
        ┌──────────┐         │ If Lend:    │      │
        │  LEND    │         │ • List item │      │
        │  flow    │         │ • Set price │      │
        └────┬─────┘         │ • Approve   │      │
             │               │   /decline  │      │
             ▼               └──────┬──────┘      │
        ┌──────────┐               │               ▼
        │  BORROW  │───────────────┘         ┌─────────────┐
        │  flow    │                         │ Request     │
        └────┬─────┘                         │ item → Owner│
             │                               │ approves    │
             ▼                               └──────┬──────┘
        ┌──────────┐                                 │
        │ Exchange │─────────────────────────────────┘
        │ on campus│
        └──────────┘
```

### Detailed Screen Flow

| Step | Screen | What happens |
|------|--------|--------------|
| 1 | **Login / Signup** | Enter name, date of birth, college email. System generates 6-digit OTP. Enter OTP → account created & session established. |
| 2 | **Choose role** | Two cards: "I want to Lend" and "I want to Borrow". User picks one; can switch later anytime. |
| 3A | **Lend** | Fill a form: item title, category (Book/Electronics/Sports/Lab equipment/Other), condition, price per day, security deposit, description. Item listed as `available`. Owner sees incoming requests and can **Approve** or **Decline**. |
| 3B | **Borrow** | Browse all `available` items listed by peers. Filter by category or search. Click "Request to borrow". Status becomes `requested`. |
| 4 | **Request status** | Borrower sees outgoing requests (Pending / Approved / Declined). Lender sees incoming requests. |
| 5 | **Handoff** | Once approved, the students meet on campus (Library, Hostels, etc.), exchange the item and security deposit, and return it. |

---

## 3. Features Implemented

- College email + OTP login/signup (demo mode displays OTP on screen and prints to terminal for zero-setup local testing).
- Name and date of birth captured at signup.
- Lend: list items with title, category, condition, price/day, deposit, description.
- Borrow: browse available items, search by keywords, filter by category; send borrow requests.
- Request management: owners approve/decline; borrowers track status in real-time.
- Session cookie: signed HMAC-SHA256 HTTP-only cookie (7 days duration).
- Seed data: 3 authentic demo items pre-loaded (Casio Calculator, Engineering Mechanics textbook, Lab coat).
- Responsive UI: clean, modern interface with Tailwind CSS matching college design aesthetics.

---

## 4. API Reference

| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/send-otp` | `{ email, name, dob }` | Sends 6-digit OTP (demo: returns code in JSON). |
| POST | `/api/auth/verify-otp` | `{ email, otp, name, dob }` | Verifies OTP, creates account if new, sets session cookie. |
| GET | `/api/auth/me` | — | Returns logged-in user or `null`. |
| POST | `/api/auth/logout` | — | Clears session cookie. |
| GET | `/api/items` | `?mine=1`, `?category=`, `?search=` | Lists available items or owner's items. |
| POST | `/api/items` | `{ title, description, category, condition, pricePerDay, deposit }` | Creates a new item listing. |
| POST | `/api/items/[id]/request` | — | Submits a borrow request for item `[id]`. |
| GET | `/api/requests` | — | Returns `{ incoming, outgoing }` for authenticated user. |
| PATCH | `/api/requests/[id]` | `{ action: "approve" \| "decline" }` | Item owner approves or declines request. |

---

## 5. How to Run Locally

```bash
# 1. Navigate to project directory
cd campus-p2p

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:3000
```

