# SAAR: Prompt History
*The chronological list of prompts used to generate the SAAR (Local Intelligence) application.*

---

### 1. Embedded Chatbot ("Ask SAAR")
> "Replace the bottom two cards on the Dashboard ("Ask SAAR" and "Extracted Links") with a full-width, embedded Chatbot UI component for querying the uploaded text file.
> 
> 1. Layout & Styling: 
> - Create a container with a Dark Slate (#161B22) background and a subtle border.
> - The top of the container should have a header reading: "Ask SAAR: Local Context Search" with a small green indicator dot showing "Ready".
> - The middle area should be a scrollable message history window. User messages should align right (grey bubbles), and AI responses align left (transparent background, JetBrains Mono font, Electric Emerald text).
> - The bottom should feature a full-width input field with the placeholder "Ask about your unread messages..." and a submit button.
> 
> 2. State & Logic:
> - Create a state array `chatHistory` to store the back-and-forth messages.
> - When the user submits a query, immediately display it in the chat window.
> - Create an async function `handleAskSaar(query)` that sends the user's query ALONG WITH the cached chat log to a backend API."

### 2. Light Mode Bug Fix
> "when i click light mode only left sidebar goes but right siode reamins in dark mode only"

### 3. Action Matrix (Kanban UI)
> "Create the "Action Matrix" page for the SAAR application to display tasks saved in Supabase.
> 
> 1. Layout & Vibe:
> - Dark Slate (#0D1117) background with JetBrains Mono typography. 
> - Header: "Action Matrix" with the subtitle: "Distilled workflow. Securely synced."
> 
> 2. The Kanban UI:
> - Create two columns: "Pending Signals" and "Resolved".
> - Design the Task Cards to look like technical readouts:
>   - Top of card: The `task_description` (e.g., "Submit BMSIT project report").
>   - Middle of card (in a slightly dimmer text): A "Source Context" block (e.g., "Origin: Falak • 10/09/26, 9:20 AM").
>   - Bottom of card: A prominent, glowing Electric Emerald checkbox to mark it complete.
> 
> 3. Logic & State:
> - Create a placeholder array of mock tasks to render the UI immediately. 
> - Write a dummy `fetchTasks()` function where the Supabase GET request will go.
> - Write a dummy `toggleTask()` function where the Supabase UPDATE request will go (moving the card from Pending to Resolved with a smooth transition)."

### 4. Supabase Integration
> "Now, replace the dummy `fetchTasks` and `toggleTask` functions with actual Supabase API calls. 
> 
> 1. Use the existing Supabase client initialization.
> 2. In `fetchTasks()`, write a SELECT query to fetch all rows from the `action_items` table and update the component state.
> 3. In `toggleTask(id, currentStatus)`, write an UPDATE query to flip the `is_completed` boolean in the `action_items` table for the matching ID, and instantly update the local state so the card visually moves to the "Resolved" column."

### 5. Extracted Media Vault Fix
> "when i click on extracted edia it goes page not found"

### 6. SAAR Identity Readme
> "update readme.md
> <div align="center">
>   <h1>SAAR. ⚡️ LOCAL INTELLIGENCE.</h1>
>   <p><strong>Extract the signal. Drop the noise. Zero-cloud privacy.</strong></p>
>   <p>Built for the PALS Hackathon 2026</p>
> </div>
> ... [Detailed SAAR Architecture and Features] ...
> and commit changes"

### 7. Decision Change Detection (AI Logic)
> "Update the Gemini extraction prompt and the Action Matrix UI to support "Decision Change Detection." 
> 
> 1. Prompt Update: Instruct the AI to chronologically track decisions. If a time, date, or plan is proposed but later changed by another user, extract ONLY the final decision and append a boolean flag `is_revised: true`.
> 2. UI Update: In the Action Matrix task cards, if `is_revised` is true, render a small, flashing neon-orange badge that says "⚠ REVISED DECISION" next to the source context, proving to the user that the AI caught a schedule conflict."

### 8. Zero-Cloud Burn Receipt (Privacy UI)
> "Implement the "Zero-Cloud Burn Receipt" feature on the SAAR Dashboard to visually prove data privacy.
> 
> 1. The Trigger: Add a sleek, outline-style button at the bottom of the Dashboard labeled "PURGE LOCAL CACHE" with a subtle red hover effect.
> 2. The Terminal UI: Below the button, create a hidden, terminal-style readout box using the JetBrains Mono font.
> 3. The Animation Logic: When the "Purge" button is clicked, reveal the terminal and run this exact sequence line-by-line with a 400ms delay between each step:
>    > SEVERING BROWSER CACHE... [DONE]
>    > SHREDDING FILE [WhatsApp-Chat.txt]... [DONE]
>    > WIPING REACT STATE... [SUCCESS]
>    > TRACE ELIMINATED.
> 4. The Action: After the final line prints, instantly reset the Distillation Ring metrics back to 0 and clear the uploaded file state, proving the data has been securely destroyed."

### 9. Smart Planner & EzeePrints Integration
> "Replace the "Local Vault" sidebar item and route with a dedicated "Smart Planner" page.
> 
> 1. Sidebar Navigation:
> - Change the navigation item labeled "Local Vault" in the sidebar to "Smart Planner" with a calendar/schedule icon.
> - Point its route to `/smart-planner`.
> 
> 2. Page Layout & Styling:
> - Route: `app/smart-planner/page.tsx`
> - Maintain the SAAR theme: Dark Slate background (#0D1117), JetBrains Mono typography, Electric Emerald accents.
> - Header: "Smart Planner"
> - Subtitle: "INTERACTIVE SCHEDULE & PHYSICAL DISPATCH DISK."
> 
> 3. Interactive Calendar & Agenda Split:
> - Left Column: An interactive full-month calendar view. Render days of the month, highlight today, and place dot markers on days containing tasks.
> - Right Column: "Scheduled Deliverables & Deadlines". 
>   - Fetch existing action items from the Supabase `action_items` table.
>   - Allow adding new tasks with a Title, Due Date, and a toggle: "Requires Hard Copy / Printout".
> 
> 4. EzeePrints Smart Action Integration:
> - Whenever a task has the "Requires Hard Copy" toggle active, or its title contains keywords like "report", "print", "submission", or "hard copy" (e.g., "Submit BMSIT project report"):
>   - Render an Electric Emerald action button: "Order Printout via EzeePrints ↗".
>   - Make it a direct link to `https://www.ezeeprints.in/` targeting `_blank` with `rel="noopener noreferrer"`.
>   - Add a subtitle under the card: "Physical printout required for submission.""

### 10. Security & Optimization (RLS & Validation)
> "Upgrade the backend architecture to max out Security and Code Standards scores.
> 
> 1. Security (Row Level Security): Use the Supabase client to execute raw SQL that enables RLS on the `action_items` and `extracted_links` tables. Create 8 mathematical cryptographic policies ensuring users can only SELECT, INSERT, UPDATE, and DELETE rows where `auth.uid() = user_id`.
> 2. Backend API (Service Layer): Create a secure Next.js API route (`/api/tasks/route.ts`) to act as a true backend service layer. Prevent the frontend from directly writing to the database.
> 3. Zod Validation: Install the `zod` library and implement strict payload validation on the API route before any data is sent to Supabase.
> 4. TypeScript Strictness: Create a centralized `types/index.ts` file, remove all loose `any` types across the Dashboard, and strictly type all React components and Supabase responses."


### 11. UI/UX & API Optimization
> "To secure a 100/100 score in UI/UX and Optimization:
> 
> 1. API Optimization: Add `Cache-Control: private, max-age=5, stale-while-revalidate=30` headers to the `/api/tasks` GET route to massively reduce redundant database hits.
> 2. UI/UX (Framer Motion): Install `framer-motion` and add staggering `<AnimatePresence>` entrance and exit animations to the task cards in both the Action Matrix and the Smart Planner so they fluidly fade and slide into place when added or resolved."

