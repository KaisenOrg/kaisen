import { Button } from '@/components/ui/button'
import { useModalStore } from '@/stores/useModalStore'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import type { Content } from '@/types'

import { Plate, usePlateEditor } from 'platejs/react'
import { Editor, EditorContainer } from '@/components/editor/ui/editor'
import { EditorKit } from '@/lib/editor-kit'

export function CreateSummary({  }: { content?: Content }) {
  const { close } = useModalStore()
  const editor = usePlateEditor({
    plugins: EditorKit,
  })

  const handleConfirm = () => {
    close()
  }

  return (
    <DialogContent className='w-3/4 min-w-[300px]' style={{ maxWidth: '1000px' }}>
      <DialogHeader>
        <DialogTitle className='text-2xl'>Create summary</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className='bg-zinc-900 border-zinc-800 border-2 rounded-xl mt-2'>
        <Plate editor={editor}>
          <EditorContainer>
            <Editor className='max-h-[400px]' />
          </EditorContainer>
        </Plate>
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
