import { toast as toastFunction } from "@/components/ui/use-toast";

export function useToast() {
  return {
    toast: ({ title, description }) => {
      toastFunction({
        title,
        description,
      });
    }
  };
}
