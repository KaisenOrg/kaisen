import React from 'react';

interface ArrowProps {
  positions: { top: number; left: number, active: boolean }[];
  cardDimensions: { width: number; height: number };
}

export function ConnectingArrows({ positions, cardDimensions }: ArrowProps) {
  if (positions.length < 2) {
    return null;
  }

  const curveOffset = 80;

  return (
    <svg
      className="absolute top-0 left-0 overflow-visible"
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <defs>
        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="var(--color-primary)" />
        </marker>

        <marker
          id="arrowhead-inactive"
          markerWidth="10"
          markerHeight="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="var(--color-zinc-600)" />
        </marker>
      </defs>

      {positions.slice(0, -1).map((startPos, i) => {
        const endPos = positions[i + 1];

        const x1 = startPos.left + cardDimensions.width + 15;
        const y1 = startPos.top + cardDimensions.height / 2;
        const x2 = endPos.left - 20;
        const y2 = endPos.top + cardDimensions.height / 2;
        const cx1 = x1 + curveOffset;
        const cy1 = y1;
        const cx2 = x2 - curveOffset;
        const cy2 = y2;
        const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

        const markerUrl = startPos.active
          ? 'url(#arrowhead-active)'
          : 'url(#arrowhead-inactive)';

        const strokeColor = startPos.active
          ? 'var(--color-primary)'
          : 'var(--color-zinc-600)';

        return (
          <React.Fragment key={i}>
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              markerEnd={markerUrl}
              strokeDasharray="8 12"
            />
            <circle
              cx={x1}
              cy={y1}
              r="5"
              strokeWidth="2"
              fill='var(--color-zinc-200)'
              stroke={strokeColor}
            />
          </React.Fragment>
        );
      })}
    </svg>
  );
}