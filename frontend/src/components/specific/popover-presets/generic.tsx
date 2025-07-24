import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { usePopoverStore } from "@/stores/usePopoverStore";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  content?: ReactNode;
  onConfirm?: () => void;
  useAlertDialog?: boolean
}

export function GenericPopupContent({ title, description, content, onConfirm, useAlertDialog }: Props) {
  const { close } = usePopoverStore();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    close();
  };

  if (useAlertDialog) {
    return (
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        {content && <div className="py-4">{content}</div>}

        <AlertDialogFooter>
          <Button variant="outline" onClick={close}>
            {onConfirm ? "Cancelar" : "Fechar"}
          </Button>
          {onConfirm && <Button onClick={handleConfirm}>Confirmar</Button>}
        </AlertDialogFooter>
      </AlertDialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      {content && <div className="py-4">{content}</div>}

      <DialogFooter>
        <Button variant="outline" onClick={close}>
          {onConfirm ? "Cancelar" : "Fechar"}
        </Button>
        {onConfirm && <Button onClick={handleConfirm}>Confirmar</Button>}
      </DialogFooter>
    </DialogContent>
  );
}