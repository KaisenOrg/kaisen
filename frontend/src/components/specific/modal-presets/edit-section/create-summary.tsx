import { Button } from '@/components/ui/button'
import { useModalStore } from '@/stores/useModalStore'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import type { Section } from '@/types'

import { Plate, usePlateEditor } from 'platejs/react'
import { Editor, EditorContainer } from '@/components/editor/ui/editor'
import { MarkdownPlugin } from '@platejs/markdown'
import { EditorKit } from '@/lib/editor-kit'
import { useTracksActions } from '@/hooks/useTracksActions'
import { useState } from 'react'

export function CreateSummary({ section, trackId }: { section: Section, trackId: string }) {
  const { close } = useModalStore()
  const { updateSection } = useTracksActions()
  const [isLoading, setIsLoading] = useState(false)

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: editor => {
      if (!section.content) return []

      if ('Page' in section.content) {
        return editor.getApi(MarkdownPlugin).markdown.deserialize(section.content.Page.content)
      }

      return []
    },
  })

  const handleConfirm = async () => {
    if (!trackId) return

    if (!('Page' in section.content)) return

    setIsLoading(true)
        
    await updateSection(section.id, String(trackId), {
      ...section,
      content: {
        Page: {
          ...section.content.Page,
          content: editor.getApi(MarkdownPlugin).markdown.serialize(),
        },
      },
    })

    setIsLoading(false)
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
        <Button onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
