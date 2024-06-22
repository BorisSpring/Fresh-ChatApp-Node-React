import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfilePictureApi } from '../../api/actions';

export function useUpdateProfilePicture(setServerValidation) {
  const queryClient = useQueryClient();
  const { mutate: updateProfilePicture, isLoading: isUpdating } = useMutation({
    mutationFn: (picture) => updateProfilePictureApi(picture),
    onError: (err) => {
      setServerValidation(() => err?.response?.data?.message);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['loggedUser'], (prevData) => {
        prevData.user.image = res.imageName;
      });
    },
  });

  return { updateProfilePicture, isUpdating };
}
