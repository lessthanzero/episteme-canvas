import type { EpistemeAgentEvent } from './schema/agent-event';
import mockTrace from './mock/scientific-agent-trace.json';
import { generateROCrate } from './schema/ro-crate';
import { OPENTRONS_PROTOCOL_CODE } from './mock/opentrons-protocol';

// Configuration & Layout constants
const NODE_WIDTH = 130;
const NODE_HEIGHT = 56;

interface NodeLayout {
  event: EpistemeAgentEvent;
  x: number;
  y: number;
  index: number;
}

const LAYOUT_POSITIONS: Record<string, { x: number; y: number }> = {
  e001: { x: 70, y: 270 },
  e002: { x: 210, y: 270 },
  e003: { x: 350, y: 270 },
  e004: { x: 490, y: 270 },
  e005: { x: 630, y: 270 },
  e006: { x: 780, y: 190 },
  e007: { x: 780, y: 350 },
};

const TYPE_ICONS: Record<string, string> = {
  hypothesis: '💡',
  tool_call: '⚡',
  observation: '🔬',
  epistemic_gate: '🛡️',
  human_intervention: '👤',
  branch_fork: '🔀',
  resolution: '🎯',
};

const TYPE_LABELS: Record<string, string> = {
  hypothesis: 'HYPOTHESIS',
  tool_call: 'TOOL EXECUTION',
  observation: 'OBSERVATION',
  epistemic_gate: 'EPISTEMIC GATE',
  human_intervention: 'HUMAN STEERING',
  branch_fork: 'BRANCH FORK',
  resolution: 'RESOLUTION',
};

class EpistemeCanvasApp {
  private events: EpistemeAgentEvent[];
  private currentStep: number;
  private selectedEventId: string | null = null;
  private isPlaying = false;
  private playTimer: number | null = null;

  private svg: SVGSVGElement;
  private inspector: HTMLElement;
  private scrubber: HTMLInputElement;
  private timelineStep: HTMLElement;
  private playBtn: HTMLButtonElement;

  constructor() {
    this.events = mockTrace as EpistemeAgentEvent[];
    this.currentStep = this.events.length - 1;
    this.selectedEventId = this.events[this.currentStep].event_id;

    this.svg = document.getElementById('dagSvg') as unknown as SVGSVGElement;
    this.inspector = document.getElementById('inspector') as HTMLElement;
    this.scrubber = document.getElementById('scrubber') as HTMLInputElement;
    this.timelineStep = document.getElementById('timelineStep') as HTMLElement;
    this.playBtn = document.getElementById('playBtn') as HTMLButtonElement;

    this.init();
  }

  private init() {
    this.scrubber.max = (this.events.length - 1).toString();
    this.scrubber.value = this.currentStep.toString();

    this.scrubber.addEventListener('input', (e) => {
      const val = parseInt((e.target as HTMLInputElement).value, 10);
      this.setStep(val);
    });

    this.playBtn.addEventListener('click', () => {
      this.togglePlay();
    });

    this.setupTabsAndPanels();
    this.render();
  }

  private setupTabsAndPanels() {
    const tabs = ['tabBtnInspector', 'tabBtnProtocol', 'tabBtnRocrate'];
    tabs.forEach((tabId) => {
      const btn = document.getElementById(tabId);
      btn?.addEventListener('click', () => {
        const targetPanelId = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        if (targetPanelId) {
          document.getElementById(targetPanelId)?.classList.add('active');
        }
      });
    });

    // Populate Opentrons Code View
    const codeElem = document.getElementById('protocolCodeView');
    if (codeElem) {
      codeElem.textContent = OPENTRONS_PROTOCOL_CODE.trim();
    }
    document.getElementById('btnCopyProtocol')?.addEventListener('click', () => {
      navigator.clipboard.writeText(OPENTRONS_PROTOCOL_CODE.trim());
      alert('Opentrons OT-2 Python protocol copied to clipboard!');
    });

    // Populate ELIXIR RO-Crate View
    const rocrate = generateROCrate(this.events[0].trace_id, this.events.length);
    const rocrateJson = JSON.stringify(rocrate, null, 2);
    const rocrateElem = document.getElementById('rocrateView');
    if (rocrateElem) {
      rocrateElem.textContent = rocrateJson;
    }
    document.getElementById('btnDownloadCrate')?.addEventListener('click', () => {
      this.downloadFile('ro-crate-metadata.json', rocrateJson, 'application/ld+json');
    });
  }

  private downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.playBtn.textContent = this.isPlaying ? '⏸' : '▶';

    if (this.isPlaying) {
      if (this.currentStep >= this.events.length - 1) {
        this.setStep(0);
      }
      this.playTimer = window.setInterval(() => {
        if (this.currentStep < this.events.length - 1) {
          this.setStep(this.currentStep + 1);
        } else {
          this.togglePlay();
        }
      }, 1600);
    } else if (this.playTimer !== null) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }

  private setStep(step: number) {
    this.currentStep = step;
    this.scrubber.value = step.toString();
    this.timelineStep.textContent = `Step ${step + 1} of ${this.events.length}`;
    this.selectedEventId = this.events[step].event_id;
    this.render();
  }

  private render() {
    this.renderDAG();
    this.renderInspector();
  }

  private renderDAG() {
    this.svg.innerHTML = '';

    // Defs for gradients & markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#30363d" />
      </marker>
      <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="#2f81f7" />
      </marker>
    `;
    this.svg.appendChild(defs);

    const nodes: NodeLayout[] = this.events.map((evt, idx) => ({
      event: evt,
      x: LAYOUT_POSITIONS[evt.event_id]?.x ?? 100 + idx * 120,
      y: LAYOUT_POSITIONS[evt.event_id]?.y ?? 270,
      index: idx,
    }));

    const nodeMap = new Map<string, NodeLayout>(nodes.map((n) => [n.event.event_id, n]));

    // Render edges
    nodes.forEach((target) => {
      if (!target.event.parent_event_id) return;
      const source = nodeMap.get(target.event.parent_event_id);
      if (!source) return;

      const isTargetVisible = target.index <= this.currentStep;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      const x1 = source.x + NODE_WIDTH;
      const y1 = source.y + NODE_HEIGHT / 2;
      const x2 = target.x;
      const y2 = target.y + NODE_HEIGHT / 2;
      const dx = (x2 - x1) / 2;

      path.setAttribute('d', `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
      path.setAttribute('class', 'dag-link');
      path.setAttribute('marker-end', isTargetVisible ? 'url(#arrow-active)' : 'url(#arrow)');
      path.setAttribute(
        'style',
        `stroke: ${isTargetVisible ? '#58a6ff' : '#21262d'}; opacity: ${isTargetVisible ? 1 : 0.25};`
      );

      this.svg.appendChild(path);
    });

    // Render nodes
    nodes.forEach((n) => {
      const isVisible = n.index <= this.currentStep;
      const isCurrent = n.index === this.currentStep;
      const isSelected = n.event.event_id === this.selectedEventId;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute(
        'class',
        `dag-node ${n.event.type === 'epistemic_gate' ? 'gate' : ''} ${
          n.event.type === 'human_intervention' ? 'human' : ''
        } ${isSelected ? 'active' : ''}`
      );
      group.setAttribute('transform', `translate(${n.x}, ${n.y})`);
      group.setAttribute('style', `opacity: ${isVisible ? 1 : 0.3}; transition: opacity 0.2s ease;`);

      // Rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', NODE_WIDTH.toString());
      rect.setAttribute('height', NODE_HEIGHT.toString());
      if (isSelected) {
        rect.setAttribute('stroke', '#58a6ff');
        rect.setAttribute('stroke-width', '2.5');
      }

      // Icon + Type
      const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      typeText.setAttribute('x', '10');
      typeText.setAttribute('y', '20');
      typeText.setAttribute('fill', '#8b949e');
      typeText.setAttribute('font-size', '10');
      typeText.setAttribute('font-family', 'IBM Plex Mono, monospace');
      typeText.setAttribute('font-weight', '600');
      typeText.textContent = `${TYPE_ICONS[n.event.type] || '•'} ${n.event.type.replace('_', ' ').toUpperCase()}`;

      // Node Title
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      titleText.setAttribute('x', '10');
      titleText.setAttribute('y', '38');
      titleText.setAttribute('fill', isVisible ? '#e6edf3' : '#8b949e');
      titleText.setAttribute('font-size', '11');
      titleText.setAttribute('font-weight', '500');
      titleText.setAttribute('font-family', 'Inter, sans-serif');
      const truncatedTitle =
        n.event.payload.title.length > 17
          ? n.event.payload.title.substring(0, 15) + '…'
          : n.event.payload.title;
      titleText.textContent = truncatedTitle;

      // Status indicator dot
      if (isCurrent) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', (NODE_WIDTH - 12).toString());
        dot.setAttribute('cy', '14');
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#2f81f7');
        group.appendChild(dot);
      }

      group.appendChild(rect);
      group.appendChild(typeText);
      group.appendChild(titleText);

      group.addEventListener('click', () => {
        this.selectedEventId = n.event.event_id;
        // Also ensure inspector tab is active
        const inspectorTabBtn = document.getElementById('tabBtnInspector');
        if (inspectorTabBtn && !inspectorTabBtn.classList.contains('active')) {
          inspectorTabBtn.click();
        }
        this.render();
      });

      this.svg.appendChild(group);
    });
  }

  private renderInspector() {
    const selected = this.events.find((e) => e.event_id === this.selectedEventId);
    if (!selected) {
      this.inspector.innerHTML = `<div class="inspector-placeholder">Select a node in the canvas to inspect epistemic metrics.</div>`;
      return;
    }

    const bounds = selected.payload.epistemic_bounds;
    const isGate = selected.type === 'epistemic_gate';
    const isTool = selected.type === 'tool_call';
    const isHuman = selected.type === 'human_intervention';

    let extraHtml = '';

    if (isTool && selected.payload.tool_args) {
      extraHtml += `
        <div style="font-size: 0.75rem; text-transform: uppercase; color: #8b949e; margin-bottom: 6px; font-weight: 600;">
          Tool Dispatch: <span style="color: #79c0ff">${selected.payload.tool_name}</span>
        </div>
        <div class="inspector-box">${JSON.stringify(selected.payload.tool_args, null, 2)}</div>
      `;
    }

    if (bounds) {
      extraHtml += `
        <div style="font-size: 0.75rem; text-transform: uppercase; color: #8b949e; margin-bottom: 8px; font-weight: 600;">
          Epistemic Verification Bounds
        </div>
        <div style="background: rgba(35, 134, 54, 0.1); border: 1px solid rgba(46, 160, 67, 0.4); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;">
            <span style="color: #8b949e;">p-value / Null Rejection:</span>
            <span style="font-family: var(--font-mono); color: #7ee787; font-weight: 600;">${bounds.p_value}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;">
            <span style="color: #8b949e;">FWER Adjusted α:</span>
            <span style="font-family: var(--font-mono); color: #7ee787;">${bounds.fwer_adjusted_alpha}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;">
            <span style="color: #8b949e;">Blinded Foils Passed:</span>
            <span style="color: #58a6ff; font-weight: 600;">${bounds.blinded_foil_passed ? '✓ PASSED (0/1000 foils)' : '✗ FAILED'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span style="color: #8b949e;">Unicity Distance:</span>
            <span style="color: #7ee787;">${bounds.unicity_satisfied ? '✓ L > U0 (True Optimum)' : 'Pending'}</span>
          </div>
          ${bounds.notes ? `<div style="margin-top: 10px; font-size: 0.78rem; color: #c9d1d9; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">${bounds.notes}</div>` : ''}
        </div>
      `;
    }

    this.inspector.innerHTML = `
      <div style="margin-bottom: 12px;">
        <span class="badge" style="${isGate ? 'background: rgba(35, 134, 54, 0.2); color: #7ee787; border-color: #238636;' : isHuman ? 'background: rgba(163, 113, 247, 0.2); color: #d2a8ff; border-color: #8957e5;' : ''}">
          ${TYPE_LABELS[selected.type] || selected.type.toUpperCase()}
        </span>
      </div>
      <div class="inspector-title">${selected.payload.title}</div>
      <div class="inspector-meta">
        Agent: <span style="color: #58a6ff;">${selected.agent_id}</span><br>
        Event ID: ${selected.event_id} • ${new Date(selected.timestamp).toLocaleTimeString()}
      </div>

      <div class="inspector-content">${selected.payload.content || ''}</div>

      ${extraHtml}

      <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
        <button class="btn-action" id="btnFork">🔀 Fork New Trajectory from Step</button>
        <button class="btn-action" id="btnSteer" style="background: #21262d; border: 1px solid var(--border); color: #e6edf3;">✋ Inject Steering Constraint</button>
        <button class="btn-action" id="btnExport" style="background: transparent; border: 1px solid var(--border); color: #8b949e; font-size: 0.78rem;">Export DuckDB Event Trace</button>
        <button class="btn-action" id="btnExportCrate" style="background: rgba(163, 113, 247, 0.15); border: 1px solid #8957e5; color: #d2a8ff; font-size: 0.78rem; margin-top: 4px;">📦 Export ELIXIR RO-Crate (JSON-LD)</button>
      </div>
    `;

    document.getElementById('btnFork')?.addEventListener('click', () => {
      alert(`Forking trajectory from ${selected.event_id} (${selected.payload.title}). A new branched run has been queued in DuckDB ledger.`);
    });
    document.getElementById('btnSteer')?.addEventListener('click', () => {
      const constraint = prompt(`Enter human steering directive for agent '${selected.agent_id}':`, 'Enforce fine pH step size 0.02 and require positive salt precipitation null-check');
      if (constraint) {
        alert(`Constraint recorded: "${constraint}". Re-synthesizing subsequent graph steps...`);
      }
    });
    document.getElementById('btnExport')?.addEventListener('click', () => {
      this.downloadFile(`episteme-trace-${selected.trace_id}.json`, JSON.stringify(this.events, null, 2), 'application/json');
    });
    document.getElementById('btnExportCrate')?.addEventListener('click', () => {
      const rocrate = generateROCrate(this.events[0].trace_id, this.events.length);
      this.downloadFile('ro-crate-metadata.json', JSON.stringify(rocrate, null, 2), 'application/ld+json');
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new EpistemeCanvasApp();
});
