export type AgentEventType =
  | 'hypothesis'
  | 'tool_call'
  | 'observation'
  | 'epistemic_gate'
  | 'human_intervention'
  | 'branch_fork'
  | 'resolution';

export interface EpistemicBounds {
  p_value?: number;
  fwer_adjusted_alpha?: number;
  blinded_foil_passed?: boolean;
  unicity_satisfied?: boolean;
  notes?: string;
}

export interface AgentEventPayload {
  title: string;
  content?: string;
  tool_name?: string;
  tool_args?: Record<string, unknown>;
  tool_result?: Record<string, unknown>;
  confidence_score?: number;
  epistemic_bounds?: EpistemicBounds;
}

export interface EpistemeAgentEvent {
  event_id: string;
  trace_id: string;
  parent_event_id: string | null;
  timestamp: string;
  agent_id: string;
  type: AgentEventType;
  payload: AgentEventPayload;
}
