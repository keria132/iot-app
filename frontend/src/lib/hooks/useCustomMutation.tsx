import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCustomMutationProps<MutationPayload> {
  mutationFn: (payload: MutationPayload) => Promise<void>;
  queryKey: string[];
  successMessage: string;
  toasterId: string;
}

const useCustomMutation = <MutationPayload,>({
  mutationFn,
  queryKey,
  successMessage,
  toasterId,
}: UseCustomMutationProps<MutationPayload>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: () => {
      toast.loading('Adding device...', { id: toasterId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success(successMessage, { id: toasterId });
    },
    onError: error => {
      toast.error('Error: ' + error.message, { id: toasterId });
    },
  });
};

export default useCustomMutation;
