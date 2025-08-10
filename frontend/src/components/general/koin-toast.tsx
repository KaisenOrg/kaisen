/* Toast personalizado para os koins */

import { toast } from "sonner";
import type { ExternalToast } from "sonner";

export function toastKoin(message: string, data?: ExternalToast) {
  toast(message, {
    ...data,
    className: "toast-koin",
    icon: <img src="/koin.svg" alt="oi" width={24} height={24} />,
  });
}
