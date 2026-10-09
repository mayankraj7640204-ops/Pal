<div align="center">
  <h1>SAAR. ⚡️ LOCAL INTELLIGENCE.</h1>
  <p><strong>Extract the signal. Drop the noise. Zero-cloud privacy.</strong></p>
  <p>Built for the PALS Hackathon 2026</p>
</div>

<br>

> **500 messages. 495 are noise. 3 are deadlines. 2 are critical links. You miss them all.** 
> Group chats are chaotic. SAAR is a local-first distillation engine that ingests raw WhatsApp exports, extracts exactly what matters, and instantly forgets your conversation. 

---

## 🛑 The Problem: Information Overload
Important context—like FDP registration links, project deadlines, and direct mentions—gets buried under hundreds of messages of casual banter. Existing AI summarizers require you to upload your personal chat logs to a remote server, compromising your privacy.

## 🟢 The Solution: SAAR
**SAAR** (Meaning: *Essence* or *Distillation*) is a privacy-first command center. It uses browser-level parsing and Local AI context windows to read your `.txt` chat exports. It pulls out the actionable data, syncs the metadata, and permanently deletes the raw text from memory upon refresh. 

**Your chats never leave your device.**

---

## ✨ Core Features

* **⚡️ The Distillation Ring:** Instantly processes raw WhatsApp `.txt` exports in the browser. It categorizes the chaos into *Action Items*, *Direct Mentions*, and *Noise*.
* **🎯 Action Matrix:** A synced, Kanban-style technical readout of your extracted tasks. It links the extracted task directly to the original quote and timestamp so you never lose context.
* **🔗 Extracted Media Vault:** A secure grid that automatically catches, categorizes, and indexes stray Google Drive, GitHub, and Figma links buried in the chat.
* **🧠 Ask SAAR (Local Context Search):** A terminal-style embedded AI chatbot. Ask highly specific questions about your unread messages (e.g., *"What is Dr. K. Ravi Babu's number?"*). It strictly queries the local cache and mathematically refuses to hallucinate or pull outside data.

---

## 🔒 The Zero-Cloud Privacy Guarantee
Privacy isn't a feature; it's the architectural foundation of SAAR.
1. **Local Ingestion:** Files are read using the browser's native `FileReader` API. 
2. **Ephemeral Memory:** Raw chat logs are held in temporary React state. They are **never** POSTed to a backend database.
3. **Metadata Only:** Only the extracted, distilled metadata (the task description, the URL, the deadline) is synced to the Supabase PostgreSQL database for cross-device retrieval.

---

## 🛠 Architecture & Tech Stack

* **Frontend Engine:** Next.js (App Router), React, Tailwind CSS (Custom *Dark Slate & Electric Emerald* UI).
* **Backend & Auth:** Supabase (PostgreSQL with strict Row Level Security).
* **Intelligence Layer:** Google Gemini API (Strictly prompted for local-context extraction and rigid hallucination barriers).
* **Parsing:** Client-side Regex and Text matching for WhatsApp export formatting.

---

## 🚀 Local Installation & Setup

Want to run the SAAR node locally? 

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/SAAR.git](https://github.com/your-username/SAAR.git)
   cd SAAR
   Install dependencies:
Bash
npm install
Environment Variables:
Create a .env.local file in the root directory and add your keys:
Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
Initialize the Database:
Run the SQL scripts located in /backend within your Supabase SQL Editor to create the action_items and extracted_links tables.
Engage the System:
Bash
npm run dev
Open http://localhost:3000 to access the SAAR Dashboard.
