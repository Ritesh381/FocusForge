# Focus Forge 🎯

**Define your goal. Focus. Complete it.**

Focus Forge is a lightweight, desktop-optimized productivity tool designed to help students and professionals move from tracking *time* to tracking *completion*. Based on the principle that "Productivity = completed tasks, not time spent," it enforces intent before action.

## 🚀 Key Features

- **Strategic Planning:** Set up to 3 high-impact goals for your day.
- **Micro-Task Breakdown:** Divide large goals into smaller, actionable steps before starting.
- **Distraction-Free Timer:** Immersive focus screen with a large countdown and active subtasks.
- **Accountability via Reflection:** If you fail or abandon a session, you are prompted to reflect on why it happened.
- **Analytics Dashboard:** Monitor your daily streaks, total focus time, and goals completed.
- **Insights:** A dedicated section to review past reflections and identify patterns of distraction.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **TypeScript**
- **Vanilla CSS** (Custom Dark Mode & Glassmorphism)
- **Lucide React** (Icons)
- **React Router Dom** (Navigation)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose**
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a cloud URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Focus-forge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 🔄 The Focus Workflow

1. **Login/Signup:** Access your personalized workspace.
2. **Plan Your Day:** Pick 1-3 primary goals you want to tackle today.
3. **Break It Down:** Select a goal and list the steps to achieve it.
4. **Focus:** Enter the immersive timer mode.
5. **Outcome:** Mark as completed to grow your streak, or abandon and reflect on distractions to get back on track.

---
*Built as a behavior-driven design prototype to demonstrating outcome-focused productivity.*
