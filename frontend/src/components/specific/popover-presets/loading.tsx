import { DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { DialogTitle } from "@radix-ui/react-dialog"
import Image from "next/image"

interface Props {
  progress?: number
}

export function LoadingPreset({ progress = 50 }: Props) {
  return (
    <DialogContent className="outline-none w-16 flex flex-col items-center p-0 border-none bg-transparent" showCloseButton={false}>
      <DialogTitle>
        <Image
          src="/logo.svg"
          alt="loading"
          width={64}
          height={64}
          className="animate-spin"
        />
      </DialogTitle>
      {progress && (
        <Progress className="mt-2 w-sm h-4" color="bg-white" value={progress} />
      )}
    </DialogContent>
  )
}