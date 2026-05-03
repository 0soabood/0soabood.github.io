---
title: "Building a Local-First AI Shell from Scratch: Architecture Lessons from Aura"
date: 2026-05-03
tags: [electron, typescript, multi-agent, langgraph, react, local-first, AI]
category: architecture
---

## Introduction

Most AI tooling assumes you're comfortable with your data living in the cloud. Most productivity apps are built for neurotypical, always-online knowledge workers. I built **Aura** because I'm neither of those things, and I was tired of tools that weren't built for me.

Aura is a local-first, multi-agent AI shell — an Electron + React desktop app that runs multiple specialized LLM agents on your machine, persists state in SQLite, and routes work through a ReAct orchestration loop built on LangGraph. Seven LLM providers. Neubrutalist editorial UI. Zero cloud dependency for core functionality.

This post walks through the architectural decisions I made, what broke, and what I'd do differently.

---

## Background: The Problem with "Smart" AI Apps

When you open most AI chat apps, you get a single conversation box. You talk to one model. It doesn't remember your projects. It doesn't know what you were doing yesterday. And every session starts completely cold.

For developers — especially those of us with ADHD — this is a brutal UX pattern. Context-switching already fragments executive function. An AI tool that *also* makes you re-explain your entire codebase every session is actively hostile.

I wanted something different: an agent that holds your project state, knows which provider is cheapest for which task, persists everything locally, and has a UI designed around cognitive load reduction, not feature count.

---

## The Solution: A Multi-Agent Reactive Shell

Aura's architecture revolves around three core concepts:

### 1. The Blackboard Model

Instead of a simple request/response cycle, Aura uses a **blackboard event system**. Every user message, agent output, tool result, and error is appended to an immutable event log stored in SQLite (`blackboard_events` table). Agents read the full log and *bid* for control.

```typescript
export interface ReactiveAgent {
  readonly name: AgentName;

  // Synchronous — reads events, returns a confidence bid.
  // Never calls an LLM at this stage.
  evaluate(events: BlackboardEvent[]): AgentBid;

  // Async — actually executes and returns output.
  // The orchestrator writes results back to the blackboard.
  execute(events: BlackboardEvent[], bid: AgentBid): Promise<AgentOutput>;
}
```

This separation is intentional. The `evaluate` phase is pure — no LLM calls, no side effects. It's just keyword heuristics and event-count checks. Only the winning agent's `execute` runs asynchronously. This keeps the bid loop fast and debuggable.

### 2. The Agent Roster

Aura currently ships four agents:

- **Supervisor** — Routes work, chooses the best specialist, maintains task structure. Critically: it never exposes its routing reasoning to the user.
- **Research Agent** — Retrieves and summarizes facts from context and tools. Never invents certainty.
- **Code Agent** — Explains, generates, and patches code. Prefers small, safe diffs.
- **Synthesis Agent** — Produces the final user-facing answer. Strips out all internal orchestration artifacts before responding.

The Synthesis Agent was the last to be added and turned out to be the most important. Without it, users were seeing `[research_agent]` internal tags and raw ReAct trace fragments leaking into responses. The Synthesis Agent is a dedicated "cleanup pass" that takes the full event log and produces a clean, readable final answer.

### 3. LangGraph for Orchestration

I originally rolled my own ReAct loop. It worked fine until I needed checkpointing, streaming, and multi-agent handoffs simultaneously. Three features, three different re-inventions of state machine logic.

Switching to **LangGraph** solved this cleanly. The graph-based workflow lets me define nodes (agents/tools) and edges (routing conditions) declaratively:

```typescript
// src/lib/graph/workflow.ts
const workflow = new StateGraph(AuraStateAnnotation)
  .addNode("supervisor", supervisorNode)
  .addNode("research", researchNode)
  .addNode("code", codeNode)
  .addNode("synthesis", synthesisNode)
  .addEdge(START, "supervisor")
  .addConditionalEdges("supervisor", routeFromSupervisor)
  .addEdge("research", "synthesis")
  .addEdge("code", "synthesis")
  .addEdge("synthesis", END);

export const compiledGraph = workflow.compile({
  checkpointer: new SqliteSaver(db),
});
```

SQLite-backed checkpointing means sessions are resumable across restarts. This was essential for the "never lose context" requirement.

---

## The UI: Neubrutalist + ADHD-Calibrated

The original Aura UI was Tailwind utility classes everywhere. It worked, but it felt like every other React app. After the neubrutalist redesign — **Fraunces** serif headings, **JetBrains Mono** for data, thick borders, high contrast — the app started feeling like *mine*.

More importantly, I added five UX features specifically designed around ADHD:

```
Phase 5: ADHD-Calibrated UX Wins
  ✅ Energy Toggle (Low/High) as data-energy on <html>
  ✅ Brain Dump Mode — vague paragraph → auto-decomposed checklist
  ✅ Stream ReAct trace as discrete think/act/observe rows
  ✅ Session resumption badges in NavigationHub
  ✅ Keyboard-first density mode (Tab, Esc, /, g r shortcuts)
```

**Brain Dump Mode** deserves its own post. The core insight: with ADHD, the hardest moment isn't doing a task — it's decomposing "I need to do the thing" into actual steps. Brain Dump Mode accepts a raw, vague paragraph ("need to fix the auth flow and also update the readme and check why tests are failing") and uses an agent pass to decompose it into a structured checklist. It externalizes the executive function step that ADHD makes hardest.

**Energy Toggle** is simpler but surprisingly effective. Low-energy mode dims non-essential UI, increases font sizes, and reduces motion. High-energy mode enables the full interface. One keypress. No settings menu to navigate.

---

## The Multi-Provider Setup

Aura supports seven LLM providers: Anthropic, Google (Gemini), Groq, OpenRouter, Mistral, Cohere, DeepSeek. The `ProviderRegistry` manages them behind a unified `UnifiedCaller` interface:

```typescript
// You call one method. The registry handles provider selection.
const result = await registry.call({
  messages,
  model: "gemini-2.0-flash",   // or "claude-sonnet-4-6", "llama-3.3-70b", etc.
  tools: [...],
  stream: true,
});
```

API keys are stored locally in a `.env.local` file. Docker secrets are supported for containerized deployments. Nothing hits the network except the provider API calls themselves.

---

## What Broke (And What I Learned)

### `better-sqlite3` vs Electron vs Node.js v22

This one cost me an entire day. `better-sqlite3` is a native Node.js module — it compiles to a `.node` binary that's ABI-specific. Electron uses its *own* Node.js ABI. Tests running under system Node.js v22 can't load the same binary that Electron built.

The fix: run tests inside Docker (where Node version is pinned to match the build environment), and rebuild the module specifically for Electron with `electron-rebuild`.

```bash
# In package.json scripts:
"rebuild:sqlite": "electron-rebuild -f -w better-sqlite3"
```

Lesson: **native modules in Electron are always a layered versioning problem**. Plan for it upfront. Pin your Node version in CI.

### The Synthesis Guard

Early Aura builds had a subtle bug where the supervisor's internal routing reasoning (`routing_decision: research_agent, confidence: 0.87`) was leaking into user-facing responses. This happened because the final node was writing whatever was in `state.lastAgentOutput` directly to the UI.

The fix was adding an explicit synthesis guard in the orchestrator node — keyword checks that catch and strip internal tags before the response reaches the renderer:

```typescript
// In workflow.ts orchestratorNode
const INTERNAL_TAG_PATTERN = /\[(supervisor|research_agent|code_agent)\]/gi;
const cleanedOutput = rawOutput.replace(INTERNAL_TAG_PATTERN, '').trim();
```

Plus the dedicated Synthesis Agent, which now owns the final pass.

---

## Key Takeaways

- **Separate bid from execute** — keep agent selection synchronous and pure, agent execution async. This makes the loop debuggable and fast.
- **LangGraph > DIY ReAct** when you need checkpointing + streaming + multi-agent state. The abstraction cost is worth it.
- **The Synthesis Agent is not optional** — without a dedicated cleanup pass, internal orchestration artifacts leak to users.
- **Native modules in Electron require explicit rebuild steps** — don't fight it, automate it.
- **ADHD-calibrated UX is universal UX** — Energy Toggle, Brain Dump, keyboard shortcuts make the app better for everyone, not just neurodivergent users.

---

## Conclusion

Aura is still in active development. The next milestones are the Veto Layer (tiered authorization so agents can't take destructive actions without confirmation), Firecrawl integration for live web access, and automating my Etsy product listing pipeline.

The architecture is solid. The UI feels right. And for the first time, I have an AI tool that doesn't make me feel like I'm fighting it.

If you're building something similar — local-first, multi-agent, ADHD-aware — I'd love to compare notes. Find me at [qaid.dev](https://qaid.dev) or in the repo.

---

*Built with: Electron · React · TypeScript · LangGraph · SQLite · Radix UI · Zustand · Vitest · Docker*
