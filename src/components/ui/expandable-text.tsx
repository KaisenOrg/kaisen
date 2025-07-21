import * as React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

type ExpandableTextProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function ExpandableText({
  title,
  children,
  className,
}: ExpandableTextProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("w-full", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-transparent dark:bg-input/30 px-4 py-3 text-left text-sm font-normal transition hover:bg-accent/30",
          open && "bg-accent"
        )}
      >
        <span>{title}</span>
        <ChevronRightIcon
          className={cn("h-4 w-4 transition-transform", open && "rotate-90")}
        />
      </button>
      {open && (
        <div className="mt-2 rounded-md border border-input bg-muted/10 px-4 py-3 text-sm font-medium text-zinc-400 mb-2">
          {children}
        </div>
      )}
    </div>
  );
}
