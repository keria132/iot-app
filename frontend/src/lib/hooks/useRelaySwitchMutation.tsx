import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { setRelayStatus, SetRelayStatusPayload } from '../services/relays';

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
