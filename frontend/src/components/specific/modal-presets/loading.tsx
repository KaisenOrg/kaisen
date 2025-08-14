import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface Props {
  progress?: number
}

export function LoadingPreset({ progress }: Props) {
  return (
    <AlertDialogContent className="outline-none w-16 flex flex-col items-center p-0 border-none bg-transparent">
      <AlertDialogTitle>
        <img
          src="/logo.svg"
          alt="loading"
          width={64}
          height={64}
          className="slow-spin"
        />
      </AlertDialogTitle>
      <AlertDialogDescription>
      </AlertDialogDescription>
    </AlertDialogContent>
  )
}