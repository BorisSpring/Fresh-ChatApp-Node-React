import React, { useState } from 'react';
import { useUpdateProfilePicture } from '../hooks/users/useUpdateProfilePicture';

// utils
import { getImageUrl } from '../utils/utils';

const UpdateUserPictureForm = ({ loggedUserImageName }) => {
  const [serverValidation, setServerValidation] = useState();

  const { updateProfilePicture, isUpdating } =
    useUpdateProfilePicture(setServerValidation);

  // when picture change it runs update
  const onHandleChangeAndUpdateProfilePicture = (e) => {
    updateProfilePicture(e.target.files[0]);
  };

  return (
    <form
      encType='multipart/form-data'
      onSubmit={onHandleChangeAndUpdateProfilePicture}
      className='w-full flex items-center  justify-center flex-col gap-3 mt-3'
    >
      {typeof serverValidation === 'string' && (
        <p className='p-1 bg-red-100 text-red-700 text-center'>
          {serverValidation}
        </p>
      )}
      <label htmlFor='photo'>
        <img
          src={getImageUrl(loggedUserImageName)}
          alt='Your profile picture'
          className='w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-full border-2 border-white'
        />
      </label>
      <label
        htmlFor='photo'
        className='text-gray-600 cursor-pointer dark:text-[#eff2f7] mx-auto text-center'
      >
        Click Here To Update Picture
      </label>
      <input
        disabled={isUpdating}
        onChange={onHandleChangeAndUpdateProfilePicture}
        type='file'
        id='photo'
        name='photo'
        accept='image/**'
        className='hidden'
      />
    </form>
  );
};

export default UpdateUserPictureForm;
