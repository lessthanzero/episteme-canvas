# Episteme Canvas

> **Human-Agent Epistemic Steering & Telemetry Canvas**  
> Tactile multi-agent trajectory inspection, DAG branch rewind, and epistemic verification bounds (FWER control, blinded foils, and unicity verification) for high-stakes autonomous workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

---

## Overview

Modern multi-agent architectures (AutoGPT, LangGraph, CrewAI) operate largely as black-box execution loops or unstructured log outputs. When applied to high-stakes domains—such as laboratory automation, pharmaceutical wet-lab protocols, algorithmic synthesis, or formal verification—operators lack:

1. **Tactile Trajectory Inspection**: The ability to inspect branching decision Directed Acyclic Graphs (DAGs) in real time.
2. **Epistemic Verification Bounds**: Statistical guarantees ($p$-values under Family-Wise Error Rate control, blinded decoy foils, unicity distance metrics) that prevent hallucinated or spurious execution.
3. **Mid-Flight Steerability & Rewind**: The ability to pause, inject human constraints, and branch alternative trajectories without re-running entire pipelines.

**Episteme Canvas** provides a framework-agnostic frontend canvas and telemetry protocol that bridges autonomous multi-agent reasoning with senior human engineering oversight.

---

## Features

- **Decision DAG Canvas**: SVG-rendered dependency graph with stage layout, dynamic bezier curves, and node state visualization.
- **Time-Travel Trajectory Scrubber**: Step forward, step backward, or auto-replay execution sequences to pinpoint the exact moment of hypothesis drift.
- **Epistemic Gate Inspector**: Real-time evaluation of statistical bounds, negative control foils, and statistical significance before allowing physical or high-cost tool dispatch.
- **Interactive Steering & Forking**: Inject prompt directives, add parameter bounds, or fork alternate trajectories directly from any intermediate node.
- **DuckDB-Compatible Schema**: Standard JSON event streaming schema ready for persistence and analytical queries.

---

## Quickstart

### Prerequisites

- Node.js >= 18

### Development

```bash
git clone https://github.com/lessthanzero/episteme-canvas.git
cd episteme-canvas
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Telemetry Event Schema

Events follow the RFC Episteme Canvas specification:

```typescript
export interface EpistemeAgentEvent {
  event_id: string;
  trace_id: string;
  parent_event_id: string | null;
  timestamp: string;
  agent_id: string;
  type: 'hypothesis' | 'tool_call' | 'observation' | 'epistemic_gate' | 'human_intervention' | 'branch_fork' | 'resolution';
  payload: {
    title: string;
    content?: string;
    tool_name?: string;
    tool_args?: Record<string, unknown>;
    confidence_score?: number;
    epistemic_bounds?: {
      p_value?: number;
      fwer_adjusted_alpha?: number;
      blinded_foil_passed?: boolean;
      unicity_satisfied?: boolean;
    };
  };
}
```

---

## License

MIT © [Alexander Katin](https://github.com/lessthanzero)
