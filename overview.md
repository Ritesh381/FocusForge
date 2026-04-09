## Student Focus Manager — MVP Product Document

---

# 1. Product Overview

**Name:** Student Focus Manager (working title)
**Type:** Mobile-first productivity tool
**Goal:** Help students complete clearly defined study goals in focused sessions

---

# 2. Problem Statement

Students often:

- Start studying without a defined goal
- Get distracted during sessions
- Fail to complete tasks
- Feel unproductive despite spending time

This leads to:

- Backlogs
- Low motivation
- Inefficient study habits

---

# 3. Product Idea

A lightweight system that enforces:

```text
Define goal → Focus → Complete → Track progress
```

Core principle:

> Productivity = completed tasks, not time spent

---

# 4. Why This Product Exists

### Current tools fail because:

- They track **time**, not **completion**
- They rely on **discipline**, not structure
- They don’t enforce **intent before action**

### This product fixes:

- Lack of clarity → forces goal input
- Distraction → nudges during session
- Low motivation → completion feedback

---

# 5. MVP Scope (Simple Version Only)

This is a **demo prototype**, not a production product.

Focus:

- Core user flow
- Clean UX
- Demonstrating behavior change

---

# 6. User Flow

```text
Landing Page
→ Login / Signup
→ Dashboard
→ Create Goal
→ Start Focus Session
→ Complete Goal
→ View Progress
```

---

# 7. Features (MVP Only)

## 7.1 Landing Page

**Purpose:** Introduce product

**Includes:**

- Product description
- CTA: “Start Focusing”
- Login / Signup button

---

## 7.2 Authentication System

**Basic login system**

**Features:**

- Email + password login
- JWT-based authentication
- Token stored securely (basic level)

**Security:**

- Password hashing (bcrypt)
- JWT expiration
- Basic protected routes

---

## 7.3 Dashboard

**Purpose:** Entry point after login

**Shows:**

- “Start Session” button
- Today's completed sessions
- Total focus time

---

## 7.4 Goal Creation

**Core feature**

**Input:**

- “What will you complete?”
- Optional duration (25 / 45 / 60 min)

**Output:**

- Stored as session goal

---

## 7.5 Focus Session

**Features:**

- Countdown timer
- Display active goal
- Minimal UI (distraction-free)

**Optional simulation:**

- “Stay focused” message
- Mock distraction nudge

---

## 7.6 Goal Completion

**Triggered when session ends**

**Shows:**

- Goal completed message
- Time spent
- Session count

Purpose:

- Reinforce completion behavior

---

## 7.7 Progress Tracking

**Basic stats only**

- Sessions completed today
- Total focus time
- Simple count (no heavy analytics)

---

# 8. Non-Goals (Important)

Not included in MVP:

- AI suggestions
- Social features
- Complex analytics
- Gamification system
- Multi-device sync
- Advanced notifications

---

# 9. Tech Stack

## Frontend

- React Native
- Tailwind CSS (via NativeWind)

## Backend (if needed)

- Node.js
- Express.js

## Database

- MongoDB (simple schema)

## Authentication

- JWT (JSON Web Tokens)
- bcrypt for password hashing

---

# 10. System Architecture (Simple)

```text
Mobile App (React Native)
        ↓
API Layer (Node.js / Express)
        ↓
Database (MongoDB)
```

---

# 11. Data Models (Basic)

## User

- id
- email
- password (hashed)

## Session

- id
- user_id
- goal
- duration
- status (completed / abandoned)
- timestamp

---

# 12. API Endpoints (Minimal)

### Auth

- POST /signup
- POST /login

### Sessions

- POST /session/start
- POST /session/complete
- GET /sessions

---

# 13. Key Metric (North Star)

**Completed Study Goals per User**

Why:

- Measures real productivity
- Aligns with product purpose

---

# 14. Assumptions

## Facts (based on research patterns)

- Students struggle with distractions
- Clear goals improve task completion

## Guesses

- Users will adopt goal-based sessions
- Nudges will improve focus

## Opinion

- Completion feedback is more motivating than time tracking

---

# 15. Risks

### 1. Wrong root problem

Students may not fail due to lack of goals but due to:

- Low discipline
- Energy issues
- Overload

### 2. Low retention

Users may try once and drop

### 3. Weak differentiation

Looks similar to existing focus apps

---

# 16. What This Prototype Demonstrates

- Clear product thinking
- Focus on outcomes over features
- Strong user flow
- Behavior-driven design

---

# 17. Final Reality Check

This is not a “startup product”.

It is:

- A **learning artifact**
- A **PM thinking demonstration**
- A **behavior experiment**

---

# 18. One Critical Question (for you)

If this product fails, what is the most likely reason?

Think before answering:

- Wrong problem?
- Wrong solution?
- Wrong user?

Your answer determines whether this is a good PM project or just a UI demo.
