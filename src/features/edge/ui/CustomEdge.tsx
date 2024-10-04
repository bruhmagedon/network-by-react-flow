import { cn } from '@/lib/utils';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getStraightPath
} from '@xyflow/react';
import { useSelector } from 'react-redux';
import { getSelectedEdge } from '../selectors/getEdges';

export function CustomEdge({
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
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  const selectedEdge = useSelector(getSelectedEdge);
  const isSelected = id === selectedEdge?.id;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style} // Применяем стиль из state
      />
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
