import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

// components
import FormGroupElement from '../components/FormGroupElement';

// custom hooks
import { useSignUpOrLoginUser } from '../hooks/users/useSignUpOrLoginUser';

const SignUpLoginPage = () => {
  // location hook so we can see is login or register
  const location = useLocation();
  const isLogin = location.pathname === '/';

  // state for server messages and validations
  const [serverValidation, setServerValidation] = useState();

  // handling form state with use hook form
  const {
    formState: { errors },
    register,
    getValues,
    handleSubmit,
    reset,
  } = useForm();

  // custom hook to peform login or register
  const { loginOrRegister, isLoadingOrRegisterin } = useSignUpOrLoginUser(
    isLogin,
    setServerValidation,
    reset
  );

  // function for handling the submit
  const onHandleSubmit = (data) => {
    loginOrRegister(data);
  };

  return (
    <main className='min-h-screen  dark:bg-[#262e35] bg-gray-100 flex items-center justify-center'>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className='w-[90%] max-w-[400px] text-purple bg-white dark:bg-[#36404a] dark:text-lightestPurple  backdrop-blur-[4px] flex flex-col gap-2 p-3 md:p-5 rounded-md '
      >
        {/* page heading for login or signup */}
        <h1 className=' text-center font-semibold  text-2xl md:text-3xl mb-1'>
          Sign {isLogin ? 'In' : 'Up'}
        </h1>

        {/* message from server about user login or registering */}
        {typeof serverValidation === 'string' && (
          <p className='text-red-700 dark:text-red-300 dark:bg-transparent  text-center p-1 bg-red-100 rounded-md'>
            {serverValidation}
          </p>
        )}

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

        {/* password */}
        <FormGroupElement
          label='Password'
          type='password'
          placeholder='********'
          register={{
            ...register('password', { required: 'Password is required!' }),
          }}
          icon={<FaLock />}
          errorMsg={
            errors?.password?.message || serverValidation?.message?.password
          }
        />

        {/* if is register path */}
        {!isLogin && (
          <>
            {/* password confirmation */}
            <FormGroupElement
              label='Password'
              type='password'
              placeholder='********'
              register={{
                ...register('passwordConfirm', {
                  required: 'Password confirm is required!',
                  validate: (value) =>
                    value === getValues('password') || 'Password must match!',
                }),
              }}
              icon={<FaLock />}
              errorMsg={
                errors?.passwordConfirm?.message ||
                serverValidation?.message?.passwordConfirm
              }
            />

            {/* first name */}
            <FormGroupElement
              label='Name'
              placeholder='Boris'
              type='text'
              register={{
                ...register('name', {
                  required: 'Name  is required!',
                  validate: (value) =>
                    (value?.trim().length > 1 && value?.trim().length < 10) ||
                    'Name must be between 1 and 10 characters long',
                }),
              }}
              icon={<FaUser />}
              errorMsg={
                errors?.name?.message || serverValidation?.message?.name
              }
            />

            {/* last name */}
            <FormGroupElement
              label='Last Name'
              placeholder='Dimitrijevic'
              type='text'
              register={{
                ...register('lastName', {
                  required: 'Last Name  is required!',
                  validate: (value) =>
                    (value?.trim().length > 1 && value?.trim().length < 10) ||
                    'Last Name must be between 1 and 10 characters long',
                }),
              }}
              icon={<FaUser />}
              errorMsg={
                errors?.lastName?.message || serverValidation?.message.name
              }
            />
          </>
        )}

        {/* links for register/login page depeneding on the path */}
        <div className='flex justify-between'>
          <Link to='/forgotPassword' className='main-link'>
            Forgot Password?
          </Link>
          <Link
            onClick={() => reset()}
            to={isLogin ? '/signUp' : '/'}
            className='main-link'
          >
            {isLogin ? ' New? Sign Up!' : 'Alerdy have an account?'}
          </Link>
        </div>

        {/* submit button */}
        <button disabled={isLoadingOrRegisterin} className='main-btn'>
          Sign {isLogin ? 'In' : 'Up'}
        </button>
      </form>
    </main>
  );
};

export default SignUpLoginPage;
