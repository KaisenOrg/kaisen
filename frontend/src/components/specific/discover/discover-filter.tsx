import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const categories = [
  "All categories",
  "Frontend",
  "Backend",
  "AI",
  "Blockchain",
];
const durations = ["Any duration", "Up to 1 hour", "1–3 hours", "3+ hours"];

function CustomSelect({
  options,
  selected,
  setSelected,
  width = "w-full sm:w-56",
}: {
  options: string[];
  selected: string;
  setSelected: (value: string) => void;
  width?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${width}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-lg px-4 py-2 text-sm flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {selected}
        <ChevronDownIcon className="w-4 h-4 ml-2 text-zinc-400" />
      </button>

      {open && (
        <ul className="absolute z-30 mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm text-zinc-300 hover:bg-orange-500 hover:text-white cursor-pointer ${
                selected === option ? "bg-orange-500 text-white" : ""
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DiscoverFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [duration, setDuration] = useState("Up to 1 hour");

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 mb-6 mt-5" id="discover-filter">
      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Search anything to learn"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-lg px-4 py-2 placeholder:text-zinc-400 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
      />

      {/* Dropdowns customizados */}
      <CustomSelect
        options={categories}
        selected={category}
        setSelected={setCategory}
      />
      <CustomSelect
        options={durations}
        selected={duration}
        setSelected={setDuration}
        width="w-full sm:w-44"
      />
    </div>
  );
}
