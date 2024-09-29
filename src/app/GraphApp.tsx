// GraphApp.tsx
import '@xyflow/react/dist/style.css';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import { nodeTypes } from '@/components/graph/GraphSchema';
import { useGraphs } from '@/hooks/useGraphs';

const GraphApp = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect } = useGraphs();

  return (
    <div className='h-screen w-screen'>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Sidebar />
        <Navbar nodes={nodes} edges={edges} addNode={addNode} />
        <Background className='bg-white' gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default GraphApp;
