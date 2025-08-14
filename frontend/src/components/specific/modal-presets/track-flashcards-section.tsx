import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModalStore } from '@/stores/useModalStore'
import { FlashcardDeck } from '@/components/specific/tracks/flashcard-deck'
import { Button } from '@/components/ui/button'
import { type Flashcard } from '@/types'

interface Props {
  title: string
  flashcards: Flashcard[]
}

export function FlashcardSectionPreset({ title, flashcards = [] }: Props) {
  const { close } = useModalStore()

  return (
    <DialogContent className="sm:max-w-md bg-transparent border-none p-0 text-white">
      <DialogHeader className="bg-zinc-900 border-zinc-800 border-2 p-6 rounded-2xl">
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

      <DialogFooter className="flex items-end w-full">
        <Button className="cursor-pointer" onClick={close}>
          Mask as done
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}