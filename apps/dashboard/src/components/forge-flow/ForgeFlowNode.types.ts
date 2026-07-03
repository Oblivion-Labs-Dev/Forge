export type ForgeFlowNodeState = 'idle' | 'active' | 'done' | 'queued';

export interface ForgeFlowNodeData {
  label: string;
  state: ForgeFlowNodeState;
  focused?: boolean;
  onSelect?: () => void;
  [key: string]: unknown;
}
