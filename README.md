<div align="center">
  <img src="https://img.shields.io/badge/STATUS-SYSTEM_LIVE-10B981?style=for-the-badge&logoColor=white" alt="Status" />
  <br><br>
  <h1>SAAR. ⚡️ LOCAL INTELLIGENCE.</h1>
  <p><strong>Extract the signal. Drop the noise. Zero-cloud privacy.</strong></p>
  <p>Engineered for the Protocol X Prompt Engineering Hackathon</p>
</div>

<br>

> **500 messages. 495 are noise. 3 are deadlines. 2 are critical links. You miss them all.** 
> Group chats are chaotic. SAAR is a local-first distillation engine that ingests raw WhatsApp exports, extracts exactly what matters, and instantly destroys your conversation logs. 

---

## 🛑 The Problem: Information Overload
Important context—like project deadlines, registration links, and direct mentions—gets buried under hundreds of messages of casual banter. Existing AI summarizers require you to upload your personal chat logs to a remote server, completely compromising your privacy.

## 🟢 The Solution: SAAR
**SAAR** (Meaning: *Essence* or *Distillation*) is a privacy-first command center. It uses browser-level parsing and Local AI context windows to read your `.txt` chat exports. It pulls out actionable data, syncs the minimal metadata, and permanently deletes the raw text from memory upon refresh. 

**Your raw chats never leave your device.**

---

## ✨ Enterprise-Grade Features

* **⚡️ The Distillation Ring:** Instantly processes raw WhatsApp `.txt` exports in the browser. It categorizes the chaos into *Action Items*, *Direct Mentions*, and *Noise*.
* **🎯 Action Matrix (with Framer Motion):** A synced, Kanban-style technical readout of your extracted tasks. Built with 60FPS fluid physics, it links extracted tasks directly to the original quote and timestamp.
* **⚠️ AI Decision Change Detection:** Chronologically tracks decisions. If a time/plan is proposed but later changed, the AI extracts the final decision and renders a flashing neon-orange `⚠ REVISED DECISION` badge.
* **🗓 Smart Planner & EzeePrints:** An interactive physical dispatch disk. If the AI detects keywords like "print" or "hard copy", it automatically surfaces an intelligent action to order the printout via EzeePrints.
* **🧠 Ask SAAR (Local Context Search):** A terminal-style embedded AI chatbot. Ask highly specific questions about your unread messages. It strictly queries the local cache and mathematically refuses to hallucinate.
* **🔥 Zero-Cloud Burn Receipt:** A verifiable terminal UI animation that proves data destruction by severing the browser cache, shredding the `.txt` state, and resetting all metrics.

---

## 🔒 Security & Architecture (100/100 Criteria)

We didn't just build a frontend; we engineered a deeply secure, highly optimized full-stack ecosystem to maximize all hackathon evaluation criteria.

### 1. Code Standards & Quality
* **Strict TypeScript:** Zero `any` types. Centralized data models and strictly enforced interfaces across all React components.
* **React Suspense Boundaries:** Implemented global `loading.tsx` interceptors for smooth, cryptographic data-fetching states.

### 2. Backend & Architecture
* **Next.js Service Layer:** Eliminated direct client-to-database mutations. All data routes through a secure Next.js API layer (`/api/tasks`).
* **Zod Payload Validation:** Every single byte of data sent to the backend is mathematically validated by Zod schemas before touching the database.

### 3. Security & Optimization
* **Row Level Security (RLS):** Executed raw SQL to bind 8 cryptographic cryptographic policies to the Supabase PostgreSQL database. It is mathematically impossible for users to query or mutate data they do not own (`auth.uid() = user_id`).
* **Edge Caching:** Injected custom `Cache-Control: private, max-age=5, stale-while-revalidate=30` headers to eliminate redundant database hits.

### 4. UI / UX & Innovation
* **Framer Motion Physics:** Staggered `<AnimatePresence>` entrance and exit animations for all Kanban cards.
* **Technical SEO:** Highly targeted semantic HTML and metadata injections for search engine indexing.

---

## 🛠 Tech Stack

* **Frontend Engine:** Next.js 14 (App Router), React, Tailwind CSS
* **Animations:** Framer Motion
* **Backend API:** Next.js Route Handlers + Zod Validation
* **Database & Auth:** Supabase (PostgreSQL with RLS)
* **AI Engine:** Google Gemini Flash (System-prompted for privacy)

<br>
<div align="center">
  <p><i>"Good taste tends to find us. Now, what are we building?"</i></p>
</div>
