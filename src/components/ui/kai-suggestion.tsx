import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';

// --- The Main Component You Requested ---
// This component uses the Card helper and Heroicons to create the desired UI.
export default function KaiSuggestion() {
  return (
    <Card className="bg-black border-gray-800 hover:bg-gray-900/80 transition-colors cursor-pointer w-full max-w-md">
      <div className="flex items-center p-6">
        {/* Icon */}
        <div className="mr-5">
          <AcademicCapIcon className="h-12 w-12 text-orange-500" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white">
            Create a study plan
          </h3>
          <p className="text-sm text-gray-400">
            Organize your tasks and prepare for exams
          </p>
        </div>
      </div>
    </Card>
  );
};