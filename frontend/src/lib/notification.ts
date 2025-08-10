import { toastKoin } from "@/components/general/koin-toast";
import { toast } from "sonner";

export const notifications = {
  completedTrack: () => {
    toast.success("Track completed successfully", {
      description: "Congratulations on completing this track!",
    });
  },

  publishedTrack: () => {
    toast.success("Track published successfully", {
      description: "Congratulations on publishing this track!",
    });
  },

  saveError: (errorDetails?: string) => {
    toast.error("Failed to save", {
      description:
        errorDetails ||
        "An error occurred while saving your changes. Please try again.",
    });
  },

  koinsEarned: (quantity: Number) => {
    return toastKoin(`Congratulations! You earned ${quantity} Koins!!!`);
  },

  loginSuccess: (userName: string) => {
    toast.success(`Welcome back, ${userName}!`, {
      description: "Login successful.",
    });
  },

};
