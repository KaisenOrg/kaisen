import { Button } from "@/components/ui/button";
import ToggleButton from "@/components/ui/toggleButton";
import { useState, useEffect } from "react";

export const TracksCreatedSection = () => {
  const quantityPublished = 4;
  const [publishedCards, setPublishedCards] = useState<number[]>([]);
  const [showAllPublished, setShowAllPublished] = useState(false);

  const quantityUnpublished = 4;
  const [unpublishedCards, setUnpublishedCards] = useState<number[]>([]);
  const [showAllUnpublished, setShowAllUnpublished] = useState(false);

  useEffect(() => {
    setPublishedCards(Array.from({ length: quantityPublished }, (_, i) => i));
    setUnpublishedCards(
      Array.from({ length: quantityUnpublished }, (_, i) => i)
    );
  }, [quantityPublished, quantityUnpublished]);

  return (
    <section
      id="tracksCreated"
      className="w-full bg-[#1A1A1E] border border-[#27272A] rounded-xl p-5 flex flex-col mb-[400px]"
    >
      <div className="flex flex-col mb-5">
        <h2 className="text-2xl font-semibold mb-10">Published tracks</h2>

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
