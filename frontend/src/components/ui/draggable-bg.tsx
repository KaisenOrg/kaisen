import { useState, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useGesture } from '@use-gesture/react';
import { useCanvasStore } from '@/stores/useCanvasStore';
import Particles from './bg-particles';

interface DraggableBackgroundProps {
  children: ReactNode;
  canvasWidth: number;
  canvasHeight: number;
  className?: string;
  canvasClassName?: string;
}

export function DraggableBackground({
  children,
  canvasWidth,
  canvasHeight,
  className,
  canvasClassName,
}: DraggableBackgroundProps) {
  const { position: globalPosition, setPosition: setGlobalPosition } = useCanvasStore();
  const [localPosition, setLocalPosition] = useState(globalPosition);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!viewportRef.current) return;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) { setViewportSize({ width: entry.contentRect.width, height: entry.contentRect.height }); }
    });
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  const bounds = {
    left: viewportSize.width > canvasWidth ? 0 : viewportSize.width - canvasWidth,
    right: 0,
    top: viewportSize.height > canvasHeight ? 0 : viewportSize.height - canvasHeight,
    bottom: 0,
  };

  const bind = useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        setLocalPosition(currentPos => {
          const newX = currentPos.x + dx;
          const newY = currentPos.y + dy;
          const clampedX = Math.max(bounds.left, Math.min(newX, bounds.right));
          const clampedY = Math.max(bounds.top, Math.min(newY, bounds.bottom));
          return { x: clampedX, y: clampedY };
        });
      },
      onWheel: ({ event, delta: [dx, dy] }) => {
        event.preventDefault();
        setLocalPosition(currentPos => {
          const newX = currentPos.x - dx;
          const newY = currentPos.y - dy;
          const clampedX = Math.max(bounds.left, Math.min(newX, bounds.right));
          const clampedY = Math.max(bounds.top, Math.min(newY, bounds.bottom));
          return { x: clampedX, y: clampedY };
        });
      },
      onDragEnd: () => setGlobalPosition(localPosition),
      onWheelEnd: () => setGlobalPosition(localPosition),
    },
    {
      drag: { bounds },
      wheel: { target: viewportRef },
    }
  );

  // 1. Criamos um objeto de estilo para o movimento.
  //    Ele será APLICADO IGUALMENTE às duas camadas.
  const movableStyle = {
    width: canvasWidth,
    height: canvasHeight,
    transform: `translate3d(${localPosition.x}px, ${localPosition.y}px, 0)`,
  };

  return (
    // 2. Este é o viewport. Ele captura os eventos de mouse/gestos.
    <div
      ref={viewportRef}
      {...bind()}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing outline-none touch-action-none ${className}`}
    >
      {/* 3. CAMADA 1: PARTÍCULAS (atrás) */}
      <div
        style={movableStyle}
        className={`absolute inset-0 z-0  ${canvasClassName}`}
      >
        <Particles
          className="w-full h-full"
          particleColors={['#ff6900']}
          particleCount={1000}
          particleSpread={50}
          speed={0.35}
          particleBaseSize={500}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={true}
        />
      </div>

      {/* 4. CAMADA 2: CONTEÚDO (na frente) */}
      <div
        style={movableStyle}
        className="absolute inset-0 z-10"
      >
        {children}
      </div>
    </div>
  );
}