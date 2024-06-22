import React from 'react';
import { useForm } from 'react-hook-form';

// components
import FormGroupElement from '../components/FormGroupElement';
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const {
    formState: { errors },
    register,
    getValues,
    handleSubmit,
    reset,
  } = useForm();

  const onHandleSubmit = (data) => {};

  return (
    <div className='bg-gray-50 dark:bg-[#262e35] flex flex-col items-center justify-center min-h-screen gap-5'>
      {/* heading */}
      <h1 className=' text-center font-semibold text-purple  text-2xl md:text-3xl mb-1'>
        Reset Password
      </h1>
      <p className='text-sm text-gray-600 -mt-5 dark:text-[#abb4d2]'>
        Reset Password With Chatvia
      </p>

      {/* form */}
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className='w-[90%] shadow-sm max-w-[400px] dark:bg-[#36404a] text-purple bg-white  backdrop-blur-[4px] flex flex-col gap-2 p-3 md:p-5 rounded-md '
      >
        <p className='text-green-700 dark:text-green-300 dark:border-green-800 dark:bg-green-800 bg-green-200 p-3 border mb-3 border-green-300 rounded-md text-center tracking-wide'>
          Enter your Email and instructions will be sent to you!
        </p>
        <FormGroupElement
          label='Email Address'
          type='email'
          placeholder='borisdimitrijevicit@gmail.com'
          register={{
            ...register('email', { required: 'Email is required!' }),
          }}
          icon={<MdEmail />}
          errorMsg={errors?.email?.message}
        />
        <button className='main-btn' type='submit'>
          Reset
        </button>
      </form>
      <p className='text-base dark:text-lightestPurple'>
        Remember it?{' '}
        <Link to='/' className='main-link'>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
