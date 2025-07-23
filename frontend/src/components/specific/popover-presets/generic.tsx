import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePopoverStore } from "@/stores/usePopoverStore";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  content?: ReactNode;
  onConfirm?: () => void;
}

export function GenericPopupContent({ title, description, content, onConfirm }: Props) {
  const { close } = usePopoverStore();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    close();
  };

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