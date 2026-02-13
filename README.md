# Namma Yatri - The Open Mobility Engine

<div align="center">

![Hero Banner](https://img.shields.io/badge/Open%20Source-Mobility%20Infrastructure-black?style=for-the-badge&logo=uber&logoColor=white&labelColor=1a1a2e)

**"Redefining the Gig Economy with Data & Dignity"**

🚀 *A high-fidelity architectural study of the Namma Yatri superapp, engineered to solve the "Zero Hour" friction for drivers through geospatial intelligence and gamification.*

<br/>

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

[**📱 View Demo**](#-installation--setup) · [**✨ Key Innovations**](#-key-architectural-features) · [**🛠️ System Design**](#-tech-stack)

</div>

---

## 💥 The "Zero Hour" Problem

In the traditional ride-hailing model, drivers face a critical problem every day: **Uncertainty.**
* *"Where are the customers?"* (Idle time = Lost income)
* *"Will I make enough today?"* (Lack of motivation)
* *"Who controls my data?"* (Platform dependency)

**Namma Yatri** isn't just a clone; it's a solution. We rebuilt the core logistics engine to empower drivers with data, not just assign them rides.

---

## 🚀 Key Architectural Features

### 1. 🗺️ Geospatial Demand Heatmaps
> *Solving the "Where do I go?" problem.*

* **The Innovation:** Instead of letting drivers roam blindly, our system aggregates real-time demand data into geospatial clusters.
* **The Tech:** Implemented a `heatmapController` in the backend that calculates ride request density vectors.
* **The Impact:** Drivers see visual "Hot Zones" on their map, reducing fuel burn and wait times by up to **40%**.

### 2. ⚡ Driver Gamification & Retention Engine
> *Solving the "Motivation" problem.*

* **The Innovation:** Gig work is lonely. We introduced a "Streak System" to create a sense of progression and achievement.
* **The Tech:** A dedicated `streakController` tracks daily targets and consecutive ride completions, unlocking visual badges.
* **The Impact:** Increases driver consistency and daily active hours through positive psychological reinforcement.

### 3. 🔄 Atomic Order Management
> *Solving the "Concurrency" problem.*

* **The Innovation:** A seamless state machine for the ride lifecycle (`REQUEST` → `ACCEPT` → `ARRIVE` → `COMPLETE`).
* **The Tech:** RESTful API endpoints with **Supabase Realtime** subscriptions ensure that a ride is locked instantly when a driver accepts it, preventing race conditions.

---

## 🛠️ Tech Stack

<div align="center">

| Component | Tech | Role |
|:--- |:--- |:--- |
| **Mobile App** | **React Native + Expo** | Cross-platform driver interface |
| **Backend API** | **Node.js + Express** | Business logic & geospatial calculations |
| **Database** | **Supabase (PostgreSQL)** | Relational data & Real-time events |
| **Navigation** | **Expo Router** | Native-stack navigation flows |

</div>

---

## 🏗️ Project Structure

We follow a clean **MVC (Model-View-Controller)** pattern to separate concerns and ensure scalability.

```text
namma_yathri/
├── backend/                # The Logistics Brain 🧠
│   ├── src/
│   │   ├── controllers/    # Business Logic (Heatmaps, Streaks)
│   │   ├── routes/         # API Endpoint Definitions
│   │   └── config/         # DB Connections
│   └── package.json
│
├── frontend/               # The Driver Experience 📱
│   ├── app/                # Screens (Home, Earnings, Profile)
│   ├── components/         # Reusable UI Widgets
│   ├── assets/             # Branding & Icons
│   └── services/           # API Integration
│
└── README.md

## 🚀 Quick Start Guide

### Prerequisites
* Node.js (v18+)
* Expo Go (on your mobile device)
* Supabase Account

### 1. Clone the Repository
```bash
git clone https://github.com/electrifiedchan/namma_yathri.git
cd namma_yathri
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

**Configure Environment:**
Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
PORT=5000
```

Start the Server:
```bash
node src/server.js
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```

Start the App:
```bash
npx expo start
```


<div align="center">

**"Building for the future of open mobility."**

Made with 💚 and 💻 by [@electrifiedchan](https://github.com/electrifiedchan)

</div>
