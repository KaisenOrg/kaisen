
import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { Card } from "@/components/ui/card";

interface ActivityCardProps {
  message: string;
  username: string;
  coins: number;
}



export const ActivityCard: React.FC<ActivityCardProps> = ({ message, coins }) => {
  return (
    <Card className="p-0 bg-card border-2 border-zinc-800 w-full">
      <div className="flex items-center gap-2 px-6 py-4">
        <AcademicCapIcon className="w-5 h-5 text-orange-500 shrink-0" />
  <span className="text-sm font-medium text-card-foreground flex-1 truncate">{message}</span>
        <span className="flex items-center gap-2 font-semibold">
          +{coins}
          <img src="/koin.svg" alt="coin" className="w-5 h-5" />
        </span>
      </div>
    </Card>
  );
};
