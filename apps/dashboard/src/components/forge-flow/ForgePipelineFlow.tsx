import { useMemo } from 'react';
import { Background, ReactFlow, ReactFlowProvider, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { ForgeFlowNodeData } from './ForgeFlowNode.types';
import { forgeFlowNodeTypes } from './ForgeFlowNode';
import ParallaxPanel from '../forge-ui/ParallaxPanel';
import { fadeUp, springSoft } from '../forge-ui/motionPresets';
import { PIPELINE_STEPS } from '../../lib/forgeMappings';
import { resolvePipelineStatus, type SectionStatus } from '../../lib/sectionStatus';

interface ArtisanFlowStatus {
  name: string;
  status: 'active' | 'idle';
}

interface ForgePipelineFlowProps {
  artisans: ArtisanFlowStatus[];
  progress: number;
  focusedStep?: string | null;
  onStepFocus?: (stepId: string) => void;
}

function resolveActiveIndex(progress: number, artisans: ArtisanFlowStatus[]): number {
  return PIPELINE_STEPS.findIndex((step) => {
    if (!step.match) return progress > 0;
    return artisans.find((a) => a.name === step.match)?.status === 'active';
  });
}

function resolveState(
  stepIndex: number,
  progress: number,
  artisans: ArtisanFlowStatus[],
  match: string | null
): ForgeFlowNodeData['state'] {
  if (stepIndex === 0) return progress > 0 ? 'active' : 'queued';

  const artisan = match ? artisans.find((a) => a.name === match) : undefined;
  if (artisan?.status === 'active') return 'active';

  const activeIndex = resolveActiveIndex(progress, artisans);
  if (activeIndex >= 0 && stepIndex < activeIndex) return 'done';
  if (activeIndex >= 0 && stepIndex === activeIndex + 1) return 'queued';
  return 'idle';
}

export function resolveStepState(
  stepId: string,
  progress: number,
  artisans: ArtisanFlowStatus[]
): ForgeFlowNodeData['state'] {
  const index = PIPELINE_STEPS.findIndex((step) => step.id === stepId);
  if (index < 0) return 'idle';
  return resolveState(index, progress, artisans, PIPELINE_STEPS[index].match);
}

export const ForgePipelineFlow: React.FC<ForgePipelineFlowProps> = ({
  artisans,
  progress,
  focusedStep,
  onStepFocus
}) => {
  const activeArtisans = artisans.filter((artisan) => artisan.status === 'active').length;
  const sectionStatus: SectionStatus = resolvePipelineStatus(progress, activeArtisans);

  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node<ForgeFlowNodeData>[] = PIPELINE_STEPS.map((step, index) => ({
      id: step.id,
      type: 'forge',
      position: { x: index * 130, y: 18 },
      data: {
        label: step.label,
        state: resolveState(index, progress, artisans, step.match),
        focused: focusedStep === step.id,
        onSelect: () => onStepFocus?.(step.id)
      },
      draggable: false,
      selectable: false
    }));

    const strokeForState = (state: ForgeFlowNodeData['state']) => {
      if (state === 'done') return '#34d399';
      if (state === 'active') return '#e86a2c';
      if (state === 'queued') return '#f0c96a';
      return 'rgba(255, 255, 255, 0.1)';
    };

    const flowEdges: Edge[] = PIPELINE_STEPS.slice(0, -1).map((step, index) => {
      const next = PIPELINE_STEPS[index + 1];
      const targetState = flowNodes[index + 1].data.state;
      const isLive = ['active', 'done'].includes(flowNodes[index].data.state) || targetState === 'active';
      const isFocused = focusedStep === step.id || focusedStep === next.id;

      return {
        id: `e-${step.id}-${next.id}`,
        source: step.id,
        target: next.id,
        animated: isLive,
        style: {
          stroke: isFocused ? '#f0c96a' : strokeForState(targetState),
          strokeWidth: isFocused ? 2.5 : isLive ? 2 : 1.5
        }
      };
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [artisans, focusedStep, onStepFocus, progress]);

  return (
    <ParallaxPanel
      data-testid="section-flow"
      className="live-panel live-flow"
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ ...springSoft, delay: 0.08 }}
      tilt={false}
      status={sectionStatus}
      sectionTitle="Pipeline"
      sectionSubtitle="Click a stage · color shows work state"
    >
      <div className="forge-flow-canvas">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={forgeFlowNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={18} size={1} color="rgba(255,255,255,0.04)" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </ParallaxPanel>
  );
};

export default ForgePipelineFlow;
