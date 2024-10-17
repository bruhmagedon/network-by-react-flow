// GraphApp.tsx
import '@xyflow/react/dist/style.css';
import Sidebar from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Background, Controls, ReactFlow } from '@xyflow/react';
import { useGraphs } from '@/hooks/useGraphs';
import { edgeTypes } from '@/features/edge';
import { nodeTypes } from '@/features/node';
import { useEffect } from 'react';
import { useHighlightEdges } from '@/hooks/useHighlightEdges';

const GraphApp = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onEdgeClick, resetSelection } =
    useGraphs();

  const { resetPathEdges } = useHighlightEdges();

  useEffect(() => {
    resetPathEdges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='h-screen w-screen'>
      <ReactFlow
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onPaneClick={resetSelection}
        fitView
      >
        <Sidebar />
        <Navbar />
        <Background className='bg-white' gap={12} size={1} />
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
};

export default GraphApp;
