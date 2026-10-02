# Episteme Canvas

> **Human-Agent Epistemic Steering & Telemetry Canvas**  
> Tactile multi-agent trajectory inspection, DAG branch rewind, and epistemic verification bounds (FWER control, blinded foils, and unicity verification) for high-stakes autonomous workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen.svg)](https://lessthanzero.github.io/episteme-canvas/)

---

## 🚀 Live Interactive Demonstrator

👉 **[https://lessthanzero.github.io/episteme-canvas/](https://lessthanzero.github.io/episteme-canvas/)**

---

## 🏆 Hackathon & Reviewer Quickstart Guide

For hackathon judges, technical evaluators, and peer reviewers evaluating Episteme:

### 1. Interactive Walkthrough (60-Second Test Drive)
1. **Explore the Decision DAG**: Click on any node in the SVG canvas. The active state highlights with animated bezier connections.
2. **Inspect the Epistemic Gate (🛡️ Step 4)**: Click on the green shielded node to view the epistemic referee bounds:
   - $p$-value / null hypothesis rejection ($p = 0.00034$)
   - Family-Wise Error Rate (FWER) adjusted $\alpha$ threshold ($0.0012$)
   - Blinded solvent decoy validation ($0/1000$ foils failed)
   - Shannon unicity distance check ($L > U_0$)
3. **Test Time-Travel Scrubbing**: Drag the scrubber slider at the bottom of the canvas or press **▶ Play** to replay the multi-agent trajectory sequentially. Unreached future states are dynamically ghosted.
4. **Inject Steering Constraints**: Click **"Inject Steering Constraint"** in the sidebar to simulate runtime human intervention (e.g., narrowing optimization gradients) without re-running pipelines from scratch.
5. **View Validated Robotics Code**: Switch to the **`Opentrons OT-2`** tab to inspect the synthesised Python protocol (`opentrons.protocol_api` 2.14) with interleaved negative control foils.
6. **Download FAIR Research Object**: Switch to the **`ELIXIR RO-Crate`** tab and click **"Download Crate"** to receive the complete, compliant `ro-crate-metadata.json` research provenance manifest.

### 2. Core Problem Solved
Modern multi-agent architectures (AutoGPT, LangGraph, CrewAI) operate largely as black-box execution loops or terminal logs. In high-stakes applications—such as laboratory automation, algorithmic synthesis, or formal verification—operators cannot afford hallucinated actions:
- In wet labs, a hallucinated pipetting step breaks physical robotic hardware or destroys expensive biological reagents.
- Without negative control foils, agents misinterpret false-positive salt crystallization as genuine protein crystals (the scientific replication crisis).
- Episteme provides the missing **Epistemic Telemetry & Human Steering** layer.

### 3. Architecture & Tech Stack
- **Frontend Canvas Engine**: TypeScript 5.5, Vite 5.4, dynamic SVG bezier curve graph engine, California/Swiss editorial modernism layout.
- **Epistemic Verification**: Multi-agent referee model enforcing Bonferroni/FWER adjustments, Shannon unicity bounds, and negative control foils.
- **Physical Automation**: Opentrons OT-2 Python liquid handling API (2.14).
- **Open Standards**: Aligned with OpenTelemetry AI semantic conventions and ELIXIR RO-Crate 1.1 specification.

---

## Features

- **Decision DAG Canvas**: SVG-rendered dependency graph with stage layout, dynamic bezier curves, and node state visualization.
- **Time-Travel Trajectory Scrubber**: Step forward, step backward, or auto-replay execution sequences to pinpoint the exact moment of hypothesis drift.
- **Epistemic Gate Inspector**: Real-time evaluation of statistical bounds, negative control foils, and statistical significance before allowing physical or high-cost tool dispatch.
- **Interactive Steering & Forking**: Inject prompt directives, add parameter bounds, or fork alternate trajectories directly from any intermediate node.
- **Opentrons OT-2 Code Inspection**: Direct preview and export of validated laboratory robotics protocols.
- **ELIXIR RO-Crate 1.1 Export**: 1-click generation of FAIR-compliant JSON-LD research object metadata packages.
- **DuckDB-Compatible Schema**: Standard JSON event streaming schema ready for persistence and analytical queries.

---

## Quickstart (Local Development)

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
