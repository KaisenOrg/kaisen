'use client';

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Flashcard } from "@/types";
import { FlashcardDeck } from '@/components/ui/flashcard-deck';
import { usePopoverStore } from '@/stores/usePopoverStore';

interface Props {
  title: string;
  flashcards: Flashcard[];
}

export function FlashcardSectionPreset({ title, flashcards = [] }: Props) {
  const { close } = usePopoverStore();

  return (
    <DialogContent className="sm:max-w-md bg-transparent border-none p-0 text-white">
      <DialogHeader className="bg-zinc-900 border-zinc-800 border-2 p-4 rounded-2xl">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {flashcards.length > 0 ? 'Clique no card para virar.' : 'Nenhum card nesta seção.'}
        </DialogDescription>
      </DialogHeader>

      <div className='mx-auto mt-4 mb-8'>
        <FlashcardDeck
          cardsData={flashcards.map((card, index) => ({
            id: index + 1,
            sentence: card.sentence,
            answer: card.answer
          }))}
        />
      </div>

      <DialogFooter className="flex justify-between sm:justify-around items-center w-full">
        <div className="bg-zinc-900 border-zinc-800 border-2 px-4 py-2 rounded-2xl">
          <span className="text-lg">
            <span className="text-zinc-400 text-sm">Tempo:</span> 00:00
          </span>
        </div>

        <Button className="cursor-pointer" onClick={close}>
          Marcar como concluída
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}