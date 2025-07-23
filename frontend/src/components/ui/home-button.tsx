import { PlusIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";

export default function HomeButton({ onClick }: { onClick?: () => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  let animationFrame: number | null = null;

  // Spotlight state
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const animateTransform = (target: HTMLDivElement, to: { x: number; y: number; scale: number; shadow: number }) => {
    if (!target) return;
    target.style.transition = "transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s cubic-bezier(.22,1,.36,1)";
    target.style.transform = `perspective(1000px) rotateY(${to.x}deg) rotateX(${to.y}deg) scale(${to.scale})`;
    target.style.boxShadow = `0 ${8 + Math.abs(to.y) * 2}px ${24 + Math.abs(to.x) * 2}px 0 rgba(0,0,0,${0.10 + Math.abs(to.x + to.y) * 0.01})`;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!divRef.current) return;
    if (animationFrame) cancelAnimationFrame(animationFrame);

    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left - width / 2) / (width / 2)) * 6; // max 6deg
    const y = ((clientY - top - height / 2) / (height / 2)) * 6; // max 6deg

    // Calculate spotlight position as percentage
    const px = ((clientX - left) / width) * 100;
    const py = ((clientY - top) / height) * 100;
    setSpotlight({ x: px, y: py, opacity: 1 });

    animationFrame = requestAnimationFrame(() => {
      animateTransform(divRef.current!, { x, y: -y, scale: 1.025, shadow: Math.max(Math.abs(x), Math.abs(y)) });
    });
  };

  const onMouseLeave = () => {
    if (!divRef.current) return;
    if (animationFrame) cancelAnimationFrame(animationFrame);

    // Animate back with a springy effect
    divRef.current.style.transition = "transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s cubic-bezier(.22,1,.36,1)";
    divRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
    divRef.current.style.boxShadow = "0 8px 24px 0 rgba(0,0,0,0.10)";
    setSpotlight((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <div
      onClick={onClick}
      ref={divRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="bg-card group border rounded-xl p-8 flex flex-col items-center justify-center text-center text-card-foreground w-full cursor-pointer relative overflow-hidden"
      style={{
        transformStyle: "preserve-3d",
        transform: "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
        transition: "transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s cubic-bezier(.22,1,.36,1)",
        boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10)",
        willChange: "transform, box-shadow",
      }}
    >
      {/* Spotlight overlay */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: spotlight.opacity * 0.4, // reduce max opacity for subtlety
          transition: "opacity 0.3s",
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 80%)`, // lower alpha values
          zIndex: 1,
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-primary/10 rounded-[40%] w-24 h-24 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-orange-400/80 group-hover:to-orange-600/80 transition-colors duration-300 ease-in-out">
          <PlusIcon className="w-12 h-12 text-orange-300 group-hover:text-white transition-colors duration-300"/>
        </div>
        <h2 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-500 ease-out">
          What will you master next?
        </h2>
        <p className="text-base text-muted-foreground max-w-lg">
          Focus on any subject and let Kai guide your learning with tailored
          materials and insights.
        </p>
      </div>
    </div>
  );
}