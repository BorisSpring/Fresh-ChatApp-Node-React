import { useMutation } from '@tanstack/react-query';
import { signInApi, signUpApi } from '../../api/actions';
import { useNavigate } from 'react-router-dom';

export function useSignUpOrLoginUser(isLogin, setServerValidation, reset) {
  const navigate = useNavigate();
  const { mutate: loginOrRegister, isLoading: isLoadingOrRegisterin } =
    useMutation({
      mutationFn: (accDetails) => {
        return isLogin ? signInApi(accDetails) : signUpApi(accDetails);
      },
      onSuccess: (res) => {
        localStorage.setItem('jwt', res.token);
        navigate('/chats');
        setServerValidation(() => ({}));
        reset();
      },
      onError: (err) => {
        setServerValidation(() => err?.response?.data?.message);
        reset();
      },
    });

  return { loginOrRegister, isLoadingOrRegisterin };
}
