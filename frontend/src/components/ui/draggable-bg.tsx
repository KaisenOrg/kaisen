import { useState, useRef, type MouseEvent, type CSSProperties, type ReactNode } from 'react';

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

    // Foca no viewport para que ele possa capturar eventos de teclado, se necessário
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

    // Calcula a nova posição do canvas
    let newX = e.clientX - dragStartRef.current.x;
    let newY = e.clientY - dragStartRef.current.y;

    // LÓGICA DOS LIMITES (BOUNDING)
    newX = Math.min(newX, 0);
    newX = Math.max(newX, viewportWidth - canvasWidth);
    newY = Math.min(newY, 0);
    newY = Math.max(newY, viewportHeight - canvasHeight);

    setPosition({ x: newX, y: newY });
  };

  // Objeto de estilo para os valores dinâmicos do canvas
  const canvasStyle: CSSProperties = {
    width: canvasWidth,
    height: canvasHeight,
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  return (
    // 'outline-none' remove o anel de foco que pode aparecer.
    <div
      ref={viewportRef}
      tabIndex={0} // Permite que a div receba foco
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
        {children}
      </div>
    </div>
  );
}