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

### 12. Mainframe Creative Agency Landing Page (Frontend Foundation)
> "Build a full-screen hero landing page for a creative agency called "Mainframe" using React, TypeScript, Vite, and Tailwind CSS. Here is every detail:
> 
> FONTS
> Load two fonts in `index.html` via these stylesheet links:
> - Heading: `https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium`
> - Body: `https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg`
> 
> In `index.css`, define CSS variables:
> :root {
>   --font-heading: 'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif;
>   --font-body: 'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif;
> }
> body {
>   font-family: var(--font-body);
> }
> 
> The entire page uses `var(--font-body)` except the logo text which uses `var(--font-heading)`.
> 
> BACKGROUND VIDEO (mouse-scrub controlled)
> - A full-screen `<video>` element is `position: fixed; inset: 0; z-index: 0; object-fit: cover; object-position: 70% center;`.
> - Video source URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4`
> - The video is `muted`, `playsInline`, `preload="auto"`. It does NOT autoplay.
> - The video scrubs forward/backward based on horizontal mouse movement. Use a `mousemove` event listener on `window`. Track `prevX`, compute `delta = currentX - prevX`, convert to a time offset: `(delta / window.innerWidth) * SENSITIVITY * video.duration` where `SENSITIVITY = 0.8`. Clamp `targetTime` between 0 and `video.duration`. Use `video.currentTime` to seek, and an `onSeeked` handler to queue the next seek if `targetTime` has moved, preventing seek-flooding.
> 
> NAVBAR (fixed, z-index: 10)
> - Fixed to top, full width. Padding: `px-5 sm:px-8 py-4 sm:py-5`. Flex row, `justify-between`, `items-center`.
> - Logo (left): Flex row with `gap-3`. Text "Mainframe(R)" (use the registered trademark symbol) at `text-[21px] sm:text-[26px]`, `tracking-tight`, white, using `var(--font-heading)`. Beside it, a decorative asterisk character `✳︎` at `text-[25px] sm:text-[30px]`, white, `select-none`, `letter-spacing: -0.02em`.
> - Desktop nav links (center, hidden below md): Flex row, `text-[23px]`, white. Links: "Labs", "Studio", "Openings", "Shop" separated by commas rendered as `, `. Each link has `hover:opacity-60 transition-opacity`.
> - Desktop CTA (right, hidden below md): An anchor "Get in touch" at `text-[23px]`, white, `underline underline-offset-2`, `hover:opacity-60 transition-opacity`.
> - Mobile hamburger (visible below md): A button with 3 horizontal bars (each `w-6 h-[2px] bg-white`), spaced with `gap-[5px]`. On toggle, the top bar rotates 45deg and translates down 7px, middle bar fades to opacity 0, bottom bar rotates -45deg and translates up 7px. All transitions are `duration-300`.
> - Mobile overlay (z-index: 9): `fixed inset-0 bg-black/90 backdrop-blur-md`, flex column, vertically centered, left-aligned with `px-8 gap-8`. Same links at `text-[32px] font-medium`, plus "Get in touch" underlined. Fades in/out with `opacity` and `pointerEvents` toggled. Hidden on md+.
> 
> HERO SECTION (z-index: 1)
> - Full `h-screen`, flex column. On mobile: `justify-end pb-12`. On `md:`: `justify-center pb-0`. Horizontal padding: `px-5 sm:px-8 md:px-10`. `overflow-hidden`.
> - Content container: `max-w-xl`, `relative z-10`.
> 
> 1. Blurred intro label:
> - `pointer-events-none`, `select-none`, `mb-5 sm:mb-6`.
> - Font size: `clamp(18px, 4vw, 26px)`, `line-height: 1.3`, `font-weight: 400`, `color: #fff`, `filter: blur(4px)`.
> - Two lines of text:
>   - Line 1: "Hey there, meet A.R.I.A,"
>   - Line 2: "Mainframe's Adaptive Response Interface Agent"
> - Separated by a `<br>`.
> 
> 2. Typewriter text:
> - Text: `"Glad you stopped in. Good taste tends to find us. Now, what are we building?"`
> - Custom `useTypewriter` hook: takes `text`, `speed` (default 38ms per character), `startDelay` (default 600ms). After the delay, an interval reveals one character at a time. Returns `{ displayed, done }`.
> - Rendered in a `<p>` tag, white, `mb-5 sm:mb-6`, font size `clamp(18px, 4vw, 26px)`, `line-height: 1.35`, `font-weight: 400`, `min-height: 54px`.
> - While typing, show a blinking cursor: `inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px]` with CSS animation `blink 1s step-end infinite` (`opacity: 1 at 0%/100%, 0 at 50%`). Cursor disappears when `done` is true.
> 
> 3. Action pill buttons:
> - Appear with a fade-in + slide-up animation (`opacity 0->1`, `translateY(8px)->0`, `transition: opacity 0.4s ease, transform 0.4s ease`). They become visible 400ms after page load, independent of the typewriter animation (do NOT wait for typing to finish).
> - Container: `flex flex-wrap gap-y-1`.
> - 4 white pill buttons: Labels: "Pitch us an idea", "Come work here", "Send a brief hello", "See how we operate". Each is `inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] white-space: nowrap`. Hover: `bg-black text-white`, `transition-colors duration-200`.
> - 1 outline pill button: Text "Reach us: hello@mainframe.co" (email is underlined with `underline-offset-1`), followed by a small 12x12 copy icon (inline SVG of two overlapping rectangles). Styled: `text-white bg-transparent border border-white rounded-full`, same sizing as above, with `gap-2 sm:gap-3` between text and icon. Hover: `bg-white text-black`. On click, copies "hello@mainframe.co" to clipboard via `navigator.clipboard.writeText()`.
> 
> DEPENDENCIES
> Only React, ReactDOM, Tailwind CSS, and Vite. No other UI libraries. Lucide-react is available but not used in this component."
