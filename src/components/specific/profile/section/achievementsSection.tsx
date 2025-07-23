"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ToggleButton from "@/components/ui/toggleButton";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

export const AchievementsSection = () => {
  const quantity = 4;
  const cards = Array.from({ length: quantity }, (_, i) => i);

  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? cards : cards.slice(0, 3);

  return (
    <section
      id="achievements"
      className="w-full bg-[#1A1A1E] border border-[#27272A] rounded-xl p-5 flex flex-col"
    >
      <h2 className="text-2xl font-semibold mb-10">Certificates</h2>
      <div className="flex justify-between gap-2 mb-12">
        <Input
          type="search"
          placeholder="Search anything to learn"
          className="w-2/3 p-4 py-5 !text-base !bg-zinc-950 rounded-lg"
        ></Input>

        <Select>
          <SelectTrigger className="w-1/3 p-4 py-5 text-base flex justify-between !bg-zinc-950 border border-[#27272A] rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            <SelectItem value="all">All Categories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {visible.map((index) => (
          <div
            key={index}
            className="relative border border-[#27272A] rounded-xl overflow-hidden w-full"
          >
            <Image
              src="/nft.svg"
              alt="Certificado em NFT"
              width={400}
              height={320}
            />
            <div className="p-3 absolute z-50 top-0 right-0 border border-[#27272A] rounded-tr-xl rounded-bl-xl bg-[#1A1A1E]">
              <ArrowDownTrayIcon className="w-6 h-auto text-zinc-50" />
            </div>
            <div className="my-5 px-6">
              <h3 className="text-base font-semibold">Lorem ipsum dolor sit</h3>
              <span className="text-sm text-zinc-400">Issued at: May 28, 2025</span>
            </div>
          </div>
        ))}
      </div>

      <ToggleButton
        isExpanded={showAll}
        setIsExpanded={setShowAll}
        showCondition={cards.length > 3}
      />
    </section>
  );
};
