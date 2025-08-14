import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { TutorialApi } from "@/hooks/useTutorial";
import { Button } from "@/components/ui/button";

type Props = { api: TutorialApi };

// ---- Spotlight (máscara com “buraco”) --------------------------------------
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
    <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <mask id="tour-cutout-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="black" />
        </mask>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="black" opacity={opacity} mask="url(#tour-cutout-mask)" />
    </svg>
  );
}

// util clamp
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function TutorialOverlay({ api }: Props) {
  const { isActive, step, stepIndex, targetEl, next, prev, stop } = api;
  if (!isActive || !step) return null;

  const rect = targetEl?.getBoundingClientRect();
  const pad = 10;
  const rx = 12;

  const viewportW = typeof window !== "undefined" ? window.innerWidth : 800;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 600;

  // limites/margens
  const margin = 8; // margem de segurança da viewport
  const gap = 8;    // distância do alvo

  // Fallbacks aproximados antes da medição real
  const approxW = Math.min(420, viewportW * 0.92);
  const approxH = Math.min(320, viewportH * 0.5);

  // Medição do tamanho real do tooltip
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tipSize, setTipSize] = useState({ w: approxW, h: approxH });

  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const measuredW = r.width || approxW;
    const measuredH = Math.min(r.height || approxH, viewportH * 0.7); // respeita 70vh
    setTipSize({ w: measuredW, h: measuredH });
  }, [stepIndex, step?.content, viewportW, viewportH, rect?.left, rect?.top]);

  // Virar automaticamente se faltar espaço
  const resolvedPlacement = useMemo(() => {
    const preferred = step.placement ?? "bottom";
    if (!rect || !step.selector) return preferred;
    switch (preferred) {
      case "bottom": return rect.bottom + gap + approxH > viewportH ? "top" : "bottom";
      case "top":    return rect.top    - gap - approxH < 0         ? "bottom" : "top";
      case "right":  return rect.right  + gap + approxW > viewportW ? "left"   : "right";
      case "left":   return rect.left   - gap - approxW < 0         ? "right"  : "left";
      default:       return preferred;
    }
  }, [rect, step?.placement, step?.selector, viewportH, viewportW, approxH, approxW]);

  // Posição final com clamp (sem transform!)
  const tooltipPos = useMemo(() => {
    if (!rect || step.placement === "center" || !step.selector) {
      // centralizado com clamp
      const left = clamp(viewportW / 2 - tipSize.w / 2, margin, viewportW - margin - tipSize.w);
      const top  = clamp(viewportH / 2 - tipSize.h / 2, margin, viewportH - margin - tipSize.h);
      return { left, top };
    }

    let left = 0, top = 0;
    switch (resolvedPlacement) {
      case "top":
        top  = rect.top - gap - tipSize.h;
        left = rect.left + rect.width / 2 - tipSize.w / 2;
        break;
      case "bottom":
        top  = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tipSize.w / 2;
        break;
      case "left":
        top  = rect.top + rect.height / 2 - tipSize.h / 2;
        left = rect.left - gap - tipSize.w;
        break;
      case "right":
      default:
        top  = rect.top + rect.height / 2 - tipSize.h / 2;
        left = rect.right + gap;
        break;
    }

    left = clamp(left, margin, viewportW - margin - tipSize.w);
    top  = clamp(top,  margin, viewportH - margin - tipSize.h);
    return { left, top };
  }, [rect, step?.placement, step?.selector, resolvedPlacement, tipSize.w, tipSize.h, viewportW, viewportH]);

  // Máscara CSS alternativa (mantida do seu código)
  const maskStyle = useMemo(() => {
    if (!rect || step.placement === "center" || !step.selector) return {};
    const x = rect.left - pad, y = rect.top - pad, w = rect.width + pad * 2, h = rect.height + pad * 2;
    const path = `path("M0,0 H100vw V100vh H0 Z
                   M${x},${y} h${w} a${rx},${rx} 0 0 1 ${rx},${rx} v${h - 2 * rx}
                   a${rx},${rx} 0 0 1 -${rx},${rx} h-${w - 2 * rx}
                   a${rx},${rx} 0 0 1 -${rx},-${rx} v-${h - 2 * rx}
                   a${rx},${rx} 0 0 1 ${rx},-${rx} Z")`;
    return {
      WebkitMaskImage: path as any,
      maskImage: path as any,
      WebkitMaskComposite: "xor" as any,
      maskComposite: "exclude" as any,
    } as React.CSSProperties;
  }, [rect, step?.placement, step?.selector]);

  // Garantir visibilidade do alvo
  useEffect(() => {
    if (targetEl) targetEl.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }, [targetEl]);

  // Borda de destaque ao redor do alvo
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
  }, [rect, step?.placement, step?.selector]);

  // imagem sobreposta opcional (ex.: defina badgeSrc no step)
  const badgeSrc: string | undefined = (step as any)?.badgeSrc;

  return createPortal(
    <div className="fixed inset-0 z-[1000] pointer-events-auto">
      {/* backdrop com “buraco” */}
      <div className="absolute inset-0 bg-black/40" style={maskStyle} aria-hidden />

      {/* spotlight SVG (suave) */}
      {rect && step.selector && step.placement !== "center" ? (
        <Spotlight rect={rect} pad={pad} rx={rx} opacity={0.35} />
      ) : (
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      )}

      {/* highlight box */}
      {highlightBoxStyle && <div style={highlightBoxStyle} aria-hidden />}

      {/* WRAPPER posicionado e “clampado” */}
      <div className="absolute" style={tooltipPos}>
        <div className="relative">
          {/* imagem acima do card (opcional) */}
          {badgeSrc && (
            <img
              src={badgeSrc}
              alt=""
              aria-hidden
              className="absolute -top-18 left-80 -translate-x-1/2 z-10 w-24 h-24 rounded-full
                         ring-2 ring-neutral-700 shadow-xl pointer-events-none"
            />
          )}

          {/* CARD */}
          <div
            ref={tooltipRef}
            className="rounded-2xl border border-neutral-700 bg-neutral-900/95 p-8 shadow-2xl
                       text-neutral-100 overflow-auto text-sm mt-6"
            style={{
              maxWidth: "min(92vw, 420px)",
              maxHeight: "70vh",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
            role="dialog"
            aria-live="polite"
          >
            <div className="text-sm">
              {typeof step.content === "string" ? (
                <div className="whitespace-pre-line text-justify">{step.content}</div>
              ) : (
                <div className="flex flex-col gap-2 text-justify">{step.content}</div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="text-xs text-neutral-400">Passo {stepIndex + 1}</div>
              <div className="flex gap-2 mt-1">
                <Button onClick={stop} variant="ghost">Pular</Button>
                <Button onClick={prev} variant="outline">Voltar</Button>
                <Button onClick={next}>Próximo</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
