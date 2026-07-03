import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
interface ViewProps {
  events: any[];
  activeStep?: string;
  activeArtisan?: string;
}

export const CommandCenterView: React.FC<ViewProps> = ({ events, activeStep }) => {
  const steps = [
    { id: 'blueprint', label: 'Blueprint Created', y: 0 },
    { id: 'runtime', label: 'Forge Runtime Starts', y: 70 },
    { id: 'workshop', label: 'Workshop Created', y: 140 },
    { id: 'planner', label: 'Planner Artisan Active', y: 210 },
    { id: 'builder', label: 'Builder Artisan Active', y: 280 },
    { id: 'reviewer', label: 'Reviewer Artisan Active', y: 350 },
    { id: 'documenter', label: 'Documenter Active', y: 420 },
    { id: 'completed', label: 'Forge Run Completed', y: 490 }
  ];

  const nodes: Node[] = steps.map((step) => {
    const isCompleted = events.some(e => e.type === step.id || e.type.replace('.created', '') === step.id || e.type.replace('.started', '') === step.id || (step.id === 'completed' && e.type === 'forge.completed'));
    const isActive = activeStep === step.id || (activeStep === 'artisan.started' && step.id === 'planner');
    
    let border = '1px solid var(--border-glass)';
    let bg = 'rgba(255,255,255,0.02)';
    if (isActive) {
      border = '1.5px solid var(--accent-amber)';
      bg = 'rgba(255, 159, 28, 0.15)';
    } else if (isCompleted) {
      border = '1px solid #10b981';
      bg = 'rgba(16, 185, 129, 0.1)';
    }

    return {
      id: step.id,
      type: 'default',
      position: { x: 250, y: step.y },
      data: { label: step.label },
      style: { background: bg, border, color: '#fff', borderRadius: '8px', padding: '10px', width: '220px', textAlign: 'center' }
    };
  });

  const edges: Edge[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const nextCompleted = events.some(e => e.type === steps[i + 1].id || e.type.replace('.created', '') === steps[i + 1].id || (steps[i + 1].id === 'completed' && e.type === 'forge.completed'));
    edges.push({
      id: `e-${steps[i].id}-${steps[i + 1].id}`,
      source: steps[i].id,
      target: steps[i + 1].id,
      animated: nextCompleted || activeStep === steps[i].id,
      style: { stroke: nextCompleted ? '#10b981' : activeStep === steps[i].id ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)' }
    });
  }

  return (
    <div style={{ height: '500px', background: '#070709', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#1a1a22" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
export default CommandCenterView;
