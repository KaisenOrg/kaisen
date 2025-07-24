import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"

interface Props {
  progress?: number
}

export function LoadingPreset({ progress = 50 }: Props) {
  return (
    <AlertDialogContent className="outline-none w-16 flex flex-col items-center p-0 border-none bg-transparent">
      <AlertDialogTitle>
        <img
          src="/logo.svg"
          alt="loading"
          width={64}
          height={64}
          className="animate-spin"
        />
      </AlertDialogTitle>
      <AlertDialogDescription>
      </AlertDialogDescription>
      {progress && (
        <Progress className="mt-2 w-sm h-4" color="bg-white" value={progress} />
      )}
    </AlertDialogContent>
  )
}