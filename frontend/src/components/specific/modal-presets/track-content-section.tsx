import { type Page, type PageElement } from '@/types'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  title: string
  pageData: Page
  onComplete?: (() => void) | null
  isCompleted?: boolean
}

function ElementRenderer({ element }: { element: PageElement }) {
  if ('Text' in element) {
    return (
      <p className="mb-4 text-secondary-foreground leading-relaxed" >
        {element.Text.value}
      </p>
    )
  }

  if ('Image' in element) {
    return (
      <figure className="my-4">
        <img src={element.Image.url} alt={element.Image.caption || 'Imagem da trilha'} className="rounded-md border mx-auto" />
        {element.Image.caption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            {element.Image.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if ('Video' in element) {
    return (
      <figure className="my-4">
        <div className="relative w-full pb-[56.25%]">
          <video
            src={element.Video.url}
            controls
            className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-muted"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
        {element.Video.caption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            {element.Video.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return null
}

export function ContentSectionPreset({ title, pageData, onComplete, isCompleted }: Props) {

  return (
    <DialogContent showCloseButton={false} className="sm:max-w-4xl h-[80vh] overflow-y-auto p-8" style={{ borderColor: 'var(--border)' }}>
      <DialogHeader>
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <DialogDescription>{pageData.title}</DialogDescription>
      </DialogHeader>

      <div>
        {pageData.elements.map((element, index) => (
          <ElementRenderer key={index} element={element} />
        ))}
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