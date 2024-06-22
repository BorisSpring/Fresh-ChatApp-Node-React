import toast from 'react-hot-toast';

export const onError = (socket, navigate) => {
  socket.on('error', (error) => {
    if (error?.statusCode === 401) {
      localStorage.removeItem('jwt');
      navigate('/');
    }
    typeof error.message === 'string' && toast.error(error?.message);
  });
};
