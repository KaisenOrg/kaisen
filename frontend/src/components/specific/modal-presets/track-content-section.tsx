import { type Page } from '@/types'
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
  onComplete?: (() => void) | null
  isCompleted?: boolean
}

export function ContentSectionPreset({ title, pageData, onComplete, isCompleted }: Props) {
  return (
    <DialogContent showCloseButton={false} className="sm:max-w-4xl h-[80vh] overflow-y-auto p-8" style={{ borderColor: 'var(--border)' }}>
      <DialogHeader>
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <DialogDescription>{pageData.title}</DialogDescription>
      </DialogHeader>

      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{pageData.content}</ReactMarkdown>
      </div>

      <DialogFooter className="">
        {onComplete && (
          <Button
            variant={isCompleted ? 'secondary' : 'default'}
            className='mt-2 cursor-pointer'
            onClick={onComplete}
            disabled={isCompleted}
          >
            {isCompleted ? 'Concluída' : 'Mark as Done'}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  )
}