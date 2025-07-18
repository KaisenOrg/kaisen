import { ReactNode } from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

interface ChatSuggestionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function ChatSuggestionCard({
  title,
  description,
  icon,
  onClick,
}: ChatSuggestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-start gap-3 p-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <span className="mt-1 text-orange-500">
        {icon || <AcademicCapIcon className="h-6 w-6" />}
      </span>
      <span>
        <div className="font-medium text-white text-sm">{title}</div>
        {description && (
          <div className="text-zinc-400 text-sm">{description}</div>
        )}
      </span>
    </button>
  );
}
