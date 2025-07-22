"use client";

import { Button } from "@/components/ui/button";
import CommunityCard from "@/components/ui/community-card";
import ToggleButton from "@/components/ui/toggleButton";
import { useState, useEffect } from "react";

export const TrailsCreatedSection = () => {
  const quantityPublished = 4;
  const [publishedCards, setPublishedCards] = useState<number[]>([]);
  const [showAllPublished, setShowAllPublished] = useState(false);
  const visiblePublished = showAllPublished
    ? publishedCards
    : publishedCards.slice(0, 3);

  const quantityUnpublished = 4;
  const [unpublishedCards, setUnpublishedCards] = useState<number[]>([]);
  const [showAllUnpublished, setShowAllUnpublished] = useState(false);
  const visibleUnpublished = showAllUnpublished
    ? unpublishedCards
    : unpublishedCards.slice(0, 3);

  // Inicializar os arrays apenas no lado do cliente para evitar problema de hidration
  useEffect(() => {
    setPublishedCards(Array.from({ length: quantityPublished }, (_, i) => i));
    setUnpublishedCards(
      Array.from({ length: quantityUnpublished }, (_, i) => i)
    );
  }, [quantityPublished, quantityUnpublished]);

  return (
    <section
      id="TrailsCreated"
      className="w-full bg-[#1A1A1E] border border-[#27272A] rounded-xl p-5 flex flex-col mb-[400px]"
    >
      <div className="flex flex-col mb-5">
        <h2 className="text-2xl font-semibold mb-10">Published tracks</h2>

        <div className="grid grid-cols-3 gap-5 mb-5">
          {visiblePublished.map((index) => (
            <CommunityCard
              key={index}
              title="Placeholder"
              description="This is a placeholder for a community block."
              creator="placeholder"
              members="0"
              time="--"
              showEdit={true}
            />
          ))}
        </div>

        {publishedCards.length > 3 && (
          <ToggleButton
            isExpanded={showAllPublished}
            setIsExpanded={setShowAllPublished}
            showCondition={publishedCards.length > 3}
          />
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-10">Unpublished tracks</h2>

        <div className="grid grid-cols-3 gap-5 mb-5">
          {visibleUnpublished.map((index) => (
            <CommunityCard
              key={index}
              title="Placeholder"
              description="This is a placeholder for a community block."
              creator="placeholder"
              members="0"
              time="--"
              showDelete={true}
            />
          ))}
        </div>

        {unpublishedCards.length > 3 && (
          <ToggleButton
            isExpanded={showAllUnpublished}
            setIsExpanded={setShowAllUnpublished}
            showCondition={unpublishedCards.length > 3}
          />
        )}
      </div>

      <Button className="self-end px-12">Create new track</Button>
    </section>
  );
};
