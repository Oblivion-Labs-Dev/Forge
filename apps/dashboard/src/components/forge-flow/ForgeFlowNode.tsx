import { memo } from 'react';

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import { motion } from 'framer-motion';

import type { ForgeFlowNodeData } from './ForgeFlowNode.types';

import { springSoft } from '../forge-ui/motionPresets';



function ForgeFlowNodeComponent({ data }: NodeProps<Node<ForgeFlowNodeData>>) {

  const isActive = data.state === 'active';

  const isFocused = Boolean(data.focused);



  return (

    <motion.button

      type="button"

      className={`forge-flow-node forge-flow-node-${data.state} ${isFocused ? 'forge-flow-node-focused' : ''}`}

      onClick={() => data.onSelect?.()}

      whileHover={{ scale: 1.08, y: -2 }}

      whileTap={{ scale: 0.96 }}

      animate={

        isActive

          ? {

              boxShadow: [

                '0 0 0 rgba(232, 106, 44, 0)',

                '0 0 22px rgba(232, 106, 44, 0.45)',

                '0 0 0 rgba(232, 106, 44, 0)'

              ]

            }

          : isFocused

            ? { boxShadow: '0 0 18px rgba(212, 168, 67, 0.35)' }

            : undefined

      }

      transition={isActive ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : springSoft}

    >

      <Handle type="target" position={Position.Left} className="forge-flow-handle" />

      <span className="forge-flow-node-label">{data.label}</span>

      {isActive && <span className="forge-flow-node-ring" />}

      {isFocused && !isActive && <span className="forge-flow-node-focus-ring" />}

      <Handle type="source" position={Position.Right} className="forge-flow-handle" />

    </motion.button>

  );

}



export const ForgeFlowNode = memo(ForgeFlowNodeComponent);



export const forgeFlowNodeTypes = {

  forge: ForgeFlowNode

};


