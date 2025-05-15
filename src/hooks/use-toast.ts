
import { useToast as useShadcnToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  const shadcnToast = useShadcnToast();
  
  return shadcnToast;
};

export const toast = sonnerToast;
