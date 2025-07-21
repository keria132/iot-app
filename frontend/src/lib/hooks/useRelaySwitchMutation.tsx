import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { setRelayStatus } from '../services/relays';
import { SetRelayStatusPayload } from '../types/global';

const useRelaySwitchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setRelayStatus,
    onMutate: async ({ ip, status }) => {
      await queryClient.cancelQueries({ queryKey: ['Relay', ip] });

      const previous = queryClient.getQueryData(['Relay', ip]);

      queryClient.setQueryData(['Relay', ip], (old: SetRelayStatusPayload) => ({
        ...old,
        relayStatus: status,
      }));

      return { previous };
    },
    onSuccess: () => {
      toast.success('Relay successfully triggered!');
    },
    onError: (error, { ip }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['Relay', ip], context.previous);
      }

      toast.error('Error: ' + error.message);
    },
  });
};

export default useRelaySwitchMutation;
