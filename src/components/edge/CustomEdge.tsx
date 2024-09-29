import { StateSchema } from '@/app/store/StateSchema';
import { AppDispatch } from '@/app/store/store';
import { cn } from '@/lib/utils';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style = {},
  markerEnd
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const selectedEdgeId = useSelector((state: StateSchema) => state.edges.selectedEdge?.id);
  const isSelected = id === selectedEdgeId;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all'
          }}
          className={cn(
            'w-5 h-5 bg-slate-300 flex justify-center font-bold rounded-full hover:bg-slate-400',
            isSelected && 'bg-lime-500 text-white'
          )}
        >
          <div>{label}</div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
