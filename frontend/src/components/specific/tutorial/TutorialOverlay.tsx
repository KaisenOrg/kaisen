import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";
import type { TutorialApi } from "@/hooks/useTutorial";
import type React from "react";

type Props = { api: TutorialApi };

function Spotlight({
  rect,
  pad,
  rx,
  opacity = 0.10,
}: {
  rect: DOMRect;
  pad: number;
  rx: number;
  opacity?: number;
}) {
  const x = rect.left - pad;
  const y = rect.top - pad;
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      <defs>
        <mask
          id="tour-cutout-mask"
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"   
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="black" />
        </mask>
      </defs>

      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="black"
        opacity={opacity}              
        mask="url(#tour-cutout-mask)"
      />
    </svg>
  );
}



export default function TutorialOverlay({ api }: Props) {
  const { isActive, step, stepIndex, targetEl, next, prev, stop } = api;
  if (!isActive || !step) return null;

  const rect = targetEl?.getBoundingClientRect();
  const pad = 10;   
  const rx  = 12;   

const viewportW = typeof window !== 'undefined' ? window.innerWidth : 800;
const viewportH = typeof window !== 'undefined' ? window.innerHeight : 600;
const approxW = Math.min(420, viewportW * 0.92); // mesmo do maxWidth
const approxH = Math.min(320, viewportH * 0.50); // altura estimada
const gap = 8;

const resolvedPlacement = useMemo(() => {
  const preferred = step.placement ?? 'bottom';
  if (!rect || !step.selector) return preferred;

  // tenta virar se faltar espaço no preferred
  switch (preferred) {
    case 'bottom':
      return rect.bottom + gap + approxH > viewportH ? 'top' : 'bottom';
    case 'top':
      return rect.top - gap - approxH < 0 ? 'bottom' : 'top';
    case 'right':
      return rect.right + gap + approxW > viewportW ? 'left' : 'right';
    case 'left':
      return rect.left - gap - approxW < 0 ? 'right' : 'left';
    default:
      return preferred;
  }
}, [rect, step?.placement, step?.selector, viewportH, viewportW, approxH, approxW]);


  // Posição do tooltip
  const tooltipStyle = useMemo(() => {
    if (!rect || step.placement === "center" || !step.selector) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
   switch (resolvedPlacement) {
      case "top":    return { top: rect.top - 8, left: rect.left + rect.width/2, transform: "translate(-50%,-100%)" };
      case "left":   return { top: rect.top + rect.height/2, left: rect.left - 8,   transform: "translate(-100%,-50%)" };
      case "right":  return { top: rect.top + rect.height/2, left: rect.right + 8,  transform: "translate(0,-50%)" };
      default:       return { top: rect.bottom + 8, left: rect.left + rect.width/2, transform: "translate(-50%,0)" };
    }
  }, [rect, step?.placement, step?.selector]);

  // Máscara com “buraco” (spotlight)
  const maskStyle = useMemo(() => {
    if (!rect || step.placement === "center" || !step.selector) return {};
    const x = rect.left - pad, y = rect.top - pad, w = rect.width + pad*2, h = rect.height + pad*2;
    const path = `path("M0,0 H100vw V100vh H0 Z
                   M${x},${y} h${w} a${rx},${rx} 0 0 1 ${rx},${rx} v${h-2*rx}
                   a${rx},${rx} 0 0 1 -${rx},${rx} h-${w-2*rx}
                   a${rx},${rx} 0 0 1 -${rx},-${rx} v-${h-2*rx}
                   a${rx},${rx} 0 0 1 ${rx},-${rx} Z")`;
    return {
      WebkitMaskImage: path as any,
      maskImage: path as any,
      WebkitMaskComposite: "xor" as any,
      maskComposite: "exclude" as any
    } as React.CSSProperties;
  }, [rect, step?.placement, step?.selector]);

  // garantir visibilidade do alvo
  useEffect(() => {
    if (targetEl) targetEl.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }, [targetEl]);

const highlightBoxStyle = useMemo<React.CSSProperties | null>(() => {
  if (!rect || step.placement === "center" || !step.selector) return null;

  const x = rect.left - pad;
  const y = rect.top - pad;
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;

  return {
    position: "absolute",
    top: y,
    left: x,
    width: w,
    height: h,
    borderRadius: rx,
    boxShadow: "0 0 0 2px rgba(255,255,255,0.95), 0 0 24px rgba(255,255,255,0.45)",
    pointerEvents: "none",
  };
}, [rect, step?.placement, step?.selector, pad, rx]);


  return createPortal(
    <div className="fixed inset-0 z-[1000] pointer-events-auto">
      {/* backdrop com “buraco” */}
      <div className="absolute inset-0 bg-black/40" style={maskStyle} aria-hidden />
      {/* tooltip */}

  {rect && step.selector && step.placement !== "center" ? (
    <Spotlight rect={rect} pad={pad} rx={rx} opacity={0.35} />
  ) : (
   <div className="absolute inset-0 bg-black/35" aria-hidden />
 )}

      {highlightBoxStyle && <div style={highlightBoxStyle} aria-hidden />}


      <div
   className="absolute rounded-2xl border border-neutral-700 bg-neutral-900/95 p-4 shadow-2xl text-neutral-100
              max-h-[50vh] overflow-auto text-sm"
   style={{
     ...tooltipStyle,
     maxWidth: 'min(92vw, 420px)',   // segura horizontal
     // opcional: melhora quebra de linha
     wordBreak: 'break-word',
     whiteSpace: 'normal',
   } as React.CSSProperties}
   role="dialog"
   aria-live="polite">

        <div className="text-sm">{step.content}</div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-xs text-neutral-400">Passo {stepIndex + 1}</div>
          <div className="flex gap-2">
            <button onClick={prev} className="px-2 py-1 rounded-md border border-neutral-700 text-xs">Voltar</button>
            <button onClick={next} className="px-3 py-1 rounded-md bg-white text-neutral-900 text-xs font-semibold">Próximo</button>
            <button onClick={stop} className="px-2 py-1 rounded-md border border-neutral-700 text-xs">Pular</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  
}
