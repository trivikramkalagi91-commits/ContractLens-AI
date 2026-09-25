# Product Requirements Document (PRD) — ContractLens AI

## 1. Executive Summary
**ContractLens AI** is an AI-powered legal contract review assistant built to translate complex legal agreements (freelance MSAs, rental leases, employment agreements, SaaS terms) into plain 8th-grade English. It highlights high-risk clauses, detects missing contract safeguards, provides an interactive Q&A assistant with real-time SSE streaming, and generates balanced clause rewrites along with polite negotiation email drafts.

## 2. Problem Statement
- Over 90% of individuals and small business owners sign contracts without reading or understanding the fine print due to dense legalese.
- Retaining legal counsel costs $250–$500+ per hour, creating a prohibitive financial barrier for freelancers, tenants, and small teams.
- Existing tools store raw contract text containing sensitive Personally Identifiable Information (PII) on external cloud servers, creating severe privacy risks.

## 3. Product Goals & Target Audience
### Target Audience
- Freelancers & Independent Contractors signing Client MSAs and Statements of Work.
- Tenants reviewing residential or commercial lease agreements.
- Job Seekers evaluating employment contracts and non-compete covenants.
- Consumers & SMBs reviewing SaaS Terms of Service.

### Key Goals
- **Accessibility**: Translate legal jargon to plain 8th-grade English.
- **Privacy First**: Zero unmasked PII leaves the browser (Client-side regex masking).
- **Speed & Efficiency**: Instant (0ms) dual-tier cache hits for re-analyzed contracts.
- **Actionable Guidance**: Provide clear "what to do" recommendations and copy-to-clipboard negotiation templates.

## 4. Key Feature Specifications

### 4.1 Header & Accessibility Toolbar
- Logo & App Title: **ContractLens AI**
- Live Badges: `Gemini 2.5 Flash`, `PII Masked (count)`
- Persistent Disclaimer Banner: *"Educational tool — not legal advice. Consult a lawyer for binding decisions."*
- Accessibility Controls: Font Size Switcher (A / A+ / A++), Keyboard Tour (`?`), Keyboard Shortcuts (`1-4`, `Esc`).

### 4.2 Tab 1 — Contract Analyzer (Primary Interface)
- **Hero Landing**: Headline "Understand Every Contract Before You Sign." with primary CTAs.
- **Input Textarea**: Large input area with live word/character counters.
- **Preset Contracts**: 3 one-click sample agreements (Predatory Freelance MSA, Harsh Residential Lease, Standard SaaS ToS).
- **Client-Side PII Masker**: Masking names, emails, phone numbers, monetary amounts, and physical addresses. Privacy Shield indicator widget.
- **Risk Heatmap**: Color-coded severity cards (Critical / Red, High / Orange, Medium / Yellow, Safe / Green).
- **Readability Improvement Score**: Flesch-Kincaid Reading Ease & Grade Level metrics.

### 4.3 Tab 2 — Ask About My Contract
- **Interactive Q&A Chat**: Real-time Server-Sent Events (SSE) streaming (`POST /api/chat`).
- **Strict Citation System**: System prompt enforces strict extraction from contract text and emits *"This contract does not mention that."* when terms are absent.
- **Suggested Question Chips**: 4 one-click "What if?" prompt chips.

### 4.4 Tab 3 — Missing Protections Check
- **10-Point Contract Audit**: Evaluates mutual indemnity, liability caps, payment schedules, termination for convenience, IP clarity, governing law, dispute resolution, confidentiality limits, amendments, and force majeure.
- **Checklist UI**: Status tags, gap severity, and recommended actions.

### 4.5 Tab 4 — Safer Clause Suggestions
- **Clause Rewriter**: Transforms high-risk or one-sided clauses into fair commercial replacements.
- **Negotiation Email Generator**: Creates polite, professional email drafts to send to counter-parties.
- **One-Click Copy**: Clipboard support for both rewritten clauses and message drafts.

## 5. Non-Functional Requirements
- **Performance**: Initial JS bundle < 150kB via `next/dynamic` code-splitting. 0ms instant cache re-renders.
- **Accessibility**: WCAG 2.1 AA compliant dark high-contrast UI, full keyboard navigation, `prefers-reduced-motion` support, `aria-live` announcements.
- **Security**: Prompt injection defense using `<CONTRACT_TEXT>` wrappers and rate-limiting middleware (10 requests/minute per IP).
