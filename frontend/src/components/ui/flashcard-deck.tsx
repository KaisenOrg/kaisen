import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CursorArrowRaysIcon as CursorClick } from '@heroicons/react/24/outline';

interface CardData {
  id: number;
  sentence: string;
  answer: string;
}

interface StackProps {
  cardsData: CardData[];
  sensitivity?: number;
}

export function FlashcardDeck({
  cardsData = [],
  sensitivity = 150,
}: StackProps) {
  const [cards, setCards] = useState(cardsData);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  useEffect(() => {
    setCards(cardsData);
  }, [cardsData]);

  const handleFlip = (id: number) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const sendToBack = () => {
    setFlippedCardId(null);
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const topCard = newCards.pop();
      if (topCard) {
        newCards.unshift(topCard);
      }
      return newCards;
    });
  };

  return (
    <div
      className="relative"
      style={{ width: 320, height: 440, perspective: "800px" }}
    >
      {cards.map((card, index) => {
        const isTopCard = index === cards.length - 1;
        const isFlipped = card.id === flippedCardId;

        return (
          <motion.div
            key={card.id}
            className="absolute w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
            drag={isTopCard}
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
                sendToBack();
              }
            }}
            onClick={() => isTopCard && handleFlip(card.id)}
            animate={{
              x: (cards.length - 1 - index) * 20,
              y: (cards.length - 1 - index) * 20,
              scale: 1 - ((cards.length - 1 - index) * 0.05),
              zIndex: index,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="relative w-full h-full"
              style={{
                transformStyle: "preserve-3d",
                width: "100%",
                height: "100%",
              }}
            >
              <motion.div
                className="absolute w-full h-full"
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Frente */}
                <div className={`absolute w-full h-full flex flex-col justify-center items-center p-8 bg-zinc-900 border border-zinc-800 rounded-xl [backface-visibility:hidden] ${isTopCard ? '[box-shadow:0px_0px_50px_2px_rgba(194,65,12,0.11)_inset]' : ''}`}>
                  <p className="text-center text-xl text-zinc-100">{card.sentence}</p>
                  <div className="flex justify-between items-center absolute bottom-4 w-full px-6">
                    <div className='text-zinc-500'>
                      <CursorClick className="h-8 w-8 -rotate-15" />
                    </div>
                    <div>
                      <img src="/kai-sleeping.svg" alt="Kai" width={64} height={64} />
                    </div>
                  </div>
                  <img
                    src="/geometric-bg-2.svg"
                    alt=""
                    width={385}
                    height={225}
                    className="absolute top-0 -right-1/3 select-none pointer-events-none"
                  />
                </div>

                {/* Verso */}
                <div className="absolute w-full h-full flex flex-col justify-center items-center p-8 bg-zinc-800 border border-zinc-700 rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="text-center text-xl font-semibold text-white">{card.answer}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
