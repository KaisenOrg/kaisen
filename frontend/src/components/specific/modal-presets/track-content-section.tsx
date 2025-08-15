import { type Page } from '@/types'
import { useModalStore } from '@/stores/useModalStore'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  title: string
  pageData: Page
}

export function ContentSectionPreset({ title, pageData }: Props) {
  const { close } = useModalStore()

  return (
    <DialogContent showCloseButton={false} className="sm:max-w-3xl max-h-[80vh] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
      <DialogHeader>
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <DialogDescription>{pageData.title}</DialogDescription>
      </DialogHeader>

      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{pageData.content}</ReactMarkdown>
      </div>

      <DialogFooter>
        <Button onClick={close}>
          Marcar como lida
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}