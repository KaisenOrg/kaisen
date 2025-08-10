import { useState, useRef, type MouseEvent, type CSSProperties, type ReactNode } from 'react';
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !viewportRef.current) return;

    viewportRef.current.focus();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    viewportRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (viewportRef.current) {
      viewportRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp();
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !viewportRef.current) return;
    e.preventDefault();

    const viewportWidth = viewportRef.current.clientWidth;
    const viewportHeight = viewportRef.current.clientHeight;

    let newX = e.clientX - dragStartRef.current.x;
    let newY = e.clientY - dragStartRef.current.y;

    newX = Math.min(newX, 0);
    newX = Math.max(newX, viewportWidth - canvasWidth);
    newY = Math.min(newY, 0);
    newY = Math.max(newY, viewportHeight - canvasHeight);

    setPosition({ x: newX, y: newY });
  };

  const canvasStyle: CSSProperties = {
    width: canvasWidth,
    height: canvasHeight,
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  return (
    <div
      ref={viewportRef}
      tabIndex={0}
      className={`relative overflow-hidden cursor-grab outline-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        style={canvasStyle}
        className={`absolute top-0 left-0 transition-transform duration-100 ease-out ${canvasClassName}`}
      >
        <Particles
          particleColors={['#ff6900']}
          particleCount={700}
          particleSpread={30}
          speed={0.35}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={true}
        />
        {children}
      </div>
    </div>
  );
}