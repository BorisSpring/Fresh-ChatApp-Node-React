import React from 'react';
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';
import { CircleLoader } from 'react-spinners';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { loggedUser, isLoading } = useGetLoggedUser();

  if (isLoading)
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <CircleLoader color='#7269ef' />
      </div>
    );

  return loggedUser?.user ? <Outlet /> : <Navigate to='/' replace={true} />;
};

export default ProtectedRoute;
