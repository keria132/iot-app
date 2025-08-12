import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCustomMutationProps<MutationPayload> {
  mutationFn: (payload: MutationPayload) => Promise<void>;
  queryKey: string[]; //TODO: consider typed keys - QueryKeys[]
  successMessage: string;
}

const useCustomMutation = <MutationPayload,>({
  mutationFn,
  queryKey,
  successMessage,
}: UseCustomMutationProps<MutationPayload>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success(successMessage);
    },
    onError: error => {
      toast.error('Error: ' + error.message);
    },
  });
};

export default useCustomMutation;
