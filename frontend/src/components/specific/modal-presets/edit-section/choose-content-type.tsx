import { Button } from '@/components/ui/button'
import { useModalStore } from '@/stores/useModalStore'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import type { Section } from '@/types'

export function ChooseContentType({ trackId, section }: { trackId: string, section: Section }) {
  const { open, close } = useModalStore()

  const handleConfirm = () => {
    close()
  }

  return (
    <DialogContent className='w-2/4 min-w-[300px]' style={{ maxWidth: 'none' }}>
      <DialogHeader>
        <DialogTitle>What do you want to add?</DialogTitle>
        <DialogDescription>
          Choose the type of content you want to add
        </DialogDescription>
      </DialogHeader>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <ButtonPoggers
          icon={<DocumentTextIcon className='w-10 h-10 text-primary' />}
          title='Summary'
          description='Create a rich text with the keys points of the subject'
          onClick={() => open({ type: 'create-summary', section, trackId })}
        />
        <ButtonPoggers
          icon={<DocumentTextIcon className='w-10 h-10 text-primary' />}
          title='Quiz'
          description='Test knowledge with multiple-choice questions.'
        />
        <ButtonPoggers
          icon={<DocumentTextIcon className='w-10 h-10 text-primary' />}
          title='Questions'
          description='Propose an essay question to encourage reflection.'
        />
        <ButtonPoggers
          icon={<DocumentTextIcon className='w-10 h-10 text-primary' />}
          title='Flashcards'
          description='Ideal for memorizing concepts, terms, and definitions.'
        />
        <ButtonPoggers
          icon={<DocumentTextIcon className='w-10 h-10 text-primary' />}
          title='SOON'
          description='New ways of passing knowledge to Kaisen are coming.'
          disabled
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={close}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Next</Button>
      </DialogFooter>
    </DialogContent>
  )
}

const ButtonPoggers = ({
  icon,
  title,
  description,
  disabled,
  onClick
}: { icon: React.ReactNode, title: string, description: string, disabled?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} disabled={disabled} className='disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-4 p-4 border-2 border-zinc-800 rounded-2xl not-disabled:hover:bg-zinc-800/25 transition-colors'>
    {icon}
    <span className='text-sm text-left'>
      <strong>{title}:</strong> {description}
    </span>
  </button>
)