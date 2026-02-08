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

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const mutationAsync = (payload: MutationPayload) =>
    toast.promise(mutation.mutateAsync(payload), {
      loading: 'Processing...',
      success: successMessage,
      error: (error: Error) => 'Error: ' + error.message,
    });

  return {
    ...mutation,
    mutate: mutationAsync,
  };
};

export default useCustomMutation;
