import { Button } from '@/components/ui/button'
import { useModalStore } from '@/stores/useModalStore'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
//import { DocumentTextIcon } from '@heroicons/react/24/outline'

export function ChooseContentType() {
  const { close } = useModalStore()

  const handleConfirm = () => {
    close()
  }

  return (
    <DialogContent className='w-2/4 min-w-[300px]' style={{ maxWidth: 'none' }}>
      <DialogHeader>
        <DialogTitle>Create summary</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div>
        teste
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={close}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Create</Button>
      </DialogFooter>
    </DialogContent>
  )
}
