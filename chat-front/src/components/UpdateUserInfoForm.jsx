import React, { useState } from 'react';
import FormGroupElement from './FormGroupElement';
import { MdEmail } from 'react-icons/md';
import { useForm } from 'react-hook-form';

// custom hooks
import { useUpdateSettings } from '../hooks/users/useUpdateSettings';

const UpdateUserInfoForm = ({ loggedUser, onHandleToggleSettingsState }) => {
  // server validation messages
  const [serverValidation, setServerValidation] = useState();
  const { email, lastName, name, statusText } = loggedUser.user;

  // from state
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      email,
      lastName,
      name,
      statusText,
    },
  });

  // update settings hook
  const { updateSettings, isUpdateing } = useUpdateSettings(
    onHandleToggleSettingsState,
    setServerValidation
  );

  // function for submiting the form
  const onHandleSubmit = (data) => {
    updateSettings(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onHandleSubmit)}
      className='w-full mt-16 mx-auto'
    >
      {/* email adress */}
      <FormGroupElement
        label='Email Address'
        type='email'
        placeholder='borisdimitrijevicit@gmail.com'
        register={{
          ...register('email', { required: 'Email is required!' }),
        }}
        icon={<MdEmail />}
        errorMsg={errors?.email?.message || serverValidation?.message?.email}
      />

      {/* name */}
      <FormGroupElement
        label='Name'
        type='text'
        placeholder='Boris'
        register={{
          ...register('name', { required: 'Name is required!' }),
        }}
        icon={<MdEmail />}
        errorMsg={errors?.name?.message || serverValidation?.message?.name}
      />

      {/* last name */}
      <FormGroupElement
        label='Last Name'
        type='text'
        placeholder='Boris'
        register={{
          ...register('lastName', {
            required: 'Name is required!',
            validate: (value) =>
              value?.trim()?.length > 1 ||
              value?.trim()?.length < 20 ||
              'last name must be between 2 and 20 chars!',
          }),
        }}
        icon={<MdEmail />}
        errorMsg={
          errors?.lastName?.message || serverValidation?.message?.lastName
        }
      />

      {/* status text for profile */}
      <FormGroupElement
        label='Profile status text'
        type='text'
        isTextArea={true}
        placeholder='Write something about u'
        register={{
          ...register('statusText'),
        }}
        showIcon={false}
        errorMsg={errors?.statusText?.message}
      />

      {/* submit button */}
      <button disabled={isUpdateing} type='submit' className='main-btn'>
        Update Info
      </button>
    </form>
  );
};

export default UpdateUserInfoForm;
