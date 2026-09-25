# Demonstration Guide — ContractLens AI

This guide walks you through testing and reviewing all 4 core tabs and privacy features of **ContractLens AI**.

## Prerequisites & Setup
1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/YourUsername/ContractLens-AI.git
   cd ContractLens-AI
   npm install
   ```
2. Set environment variables (optional — built-in fallback engine runs smoothly without a key):
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY if available
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step-by-Step Walkthrough

### Step 1: Privacy Shield & Contract Analyzer (Tab 1)
1. On the landing page, notice the **Hero Section**, header badges (`Gemini 2.5 Flash`, `PII Masked`), and the persistent disclaimer banner.
2. Click **"Predatory Freelance MSA"** under **Samples**.
3. Observe the **Privacy Shield** component:
   - Notice names transformed to `[PARTY_A]`, amounts to `[AMOUNT]`, and emails to `[EMAIL]`.
   - The Privacy Shield badge updates with detected PII counts.
4. Click **"Analyze Contract & Flag Risks"**.
5. Review the results:
   - **Flesch-Kincaid Readability Widget**: Shows readability score and % improvement.
   - **Heatmap Summary Bar**: Summary count of high-risk clauses and missing protections.
   - **Risk-Sorted Cards**: Color-coded from Critical (Red) to High (Orange), Medium (Yellow), and Safe (Green).
   - Click **"View Original Legal Snippet"** on any clause card to toggle the raw text.

### Step 2: Instant 0ms Dual-Cache Test
1. Without modifying the text, click **"Analyze Contract & Flag Risks"** again.
2. Observe the instant **"0ms Dual-Cache Hit"** badge appearing next to the heatmap summary.

### Step 3: Interactive SSE Q&A Chat (Tab 2)
1. Press keyboard key `2` (or click Tab 2 "Ask About My Contract").
2. Click one of the suggested chips: *"What happens if I quit or terminate early?"*.
3. Watch the answer stream in real-time via Server-Sent Events (SSE).
4. Ask an unmentioned topic (e.g. *"What is the pet policy?"*).
5. Verify the assistant strictly responds: *"This contract does not mention that."*

### Step 4: Missing Protections 10-Point Audit (Tab 3)
1. Press keyboard key `3` (or click Tab 3 "Missing Protections Check").
2. Click **"Run 10-Point Missing Protection Audit"**.
3. Inspect the checklist items (mutual indemnity, liability caps, payment terms, force majeure).
4. Filter by **"Missing"** to highlight critical gaps.

### Step 5: Safer Clause Rewriter & Negotiation Email (Tab 4)
1. Return to Tab 1 (`1`), locate the **"Uncapped Liability & Full Indemnification"** clause card, and click **"Generate Safer Clause"**.
2. Automatically transitions to Tab 4 (`4`) and displays:
   - **Proposed Balanced Replacement Clause**: Standard fair wording.
   - **Polite Negotiation Email Draft**: Ready to copy and send to the client/landlord.
3. Click **"Copy Clause"** or **"Copy Email"** to test clipboard integration.

### Step 6: Accessibility Verification
1. Press `?` to open the **Quick Tour & Keyboard Shortcuts** modal.
2. Press `Esc` to close the modal.
3. Click the font switcher button (`A` / `A+` / `A++`) in the header to scale text sizing.
4. Press `1`, `2`, `3`, `4` to switch tabs instantly.

---

## Running Automated Tests
Run the full Vitest suite (57+ unit tests covering PII, cache, schemas, rate limiter, readability, and JSON repair):
```bash
npm test
```
