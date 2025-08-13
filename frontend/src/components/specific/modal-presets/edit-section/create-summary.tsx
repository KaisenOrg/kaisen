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
import type { Value } from 'platejs'

export function CreateSummary({ content }: { content?: Content }) {
  const { close } = useModalStore()
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: ((): Value => {
      if (!content) return []
      if ('Page' in content) {
        return content.Page.elements.map((element) => {
          console.log(element)

          if ('Text' in element)
            return {
              children: [{ text: element.Text.value }],
              type: 'p'
            }
          if ('Image' in element)
            return {
              children: [{ text: element.Image.url }],
              type: 'img',
              url: element.Image.url,
            }
          if ('Video' in element)
            return {
              children: [{ text: '' }],
              type: 'video',
              url: 'https://www.youtube.com/watch?v=nTzzAbid1Ig&ab_channel=Kaisen',
            }

          return { children: [{ text: 'Type something...' }], type: 'p' }
        })
      }
      return []
    })(),
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

      <div className="mt-2 w-full max-w-full min-w-0 overflow-hidden rounded-xl border-2 border-zinc-800 bg-zinc-900">
        <div className="w-full max-w-full min-w-0">
          <Plate editor={editor}>
            <EditorContainer className="w-full max-w-full min-w-0 max-h-[400px] overflow-auto">
              <Editor />
            </EditorContainer>
          </Plate>
        </div>
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
