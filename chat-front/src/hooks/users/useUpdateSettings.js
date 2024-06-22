import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserInfoApi } from '../../api/actions';

export function useUpdateSettings(
  onHandleToggleSettingsState,
  setServerValidation
) {
  const queryClient = useQueryClient();

  const { mutate: updateSettings, isLoading: isUpdateing } = useMutation({
    mutationFn: (accSettings) => updateUserInfoApi(accSettings),
    onSuccess: (res, variables) => {
      queryClient.setQueryData(['loggedUser'], (prevData) => {
        prevData.user.email = variables.email;
        prevData.user.name = variables.name;
        prevData.user.lastName = variables.lastName;
        prevData.user.statusText = variables.statusText;
      });
      onHandleToggleSettingsState('isEdit');
    },
    onError: (err) => {
      setServerValidation(() => err?.response?.data);
    },
  });

  return { updateSettings, isUpdateing };
}
