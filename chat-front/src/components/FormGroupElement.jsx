import React from 'react';

const FormGroupElement = ({
  label,
  required = false,
  type = 'text',
  icon,
  errorMsg,
  register,
  placeholder,
  isTextArea = false,
  rows = 2,
  showIcon = true,
}) => {
  return (
    <div className='flex flex-col gap-1 text-sm  text-gray-700 dark:text-[#eff2f7] '>
      <label htmlFor='email' className='font-semibold dark:text-lightestPurple'>
        {label}
      </label>
      <div className='relative group'>
        {!isTextArea ? (
          <input
            {...register}
            required={required}
            type={type}
            placeholder={placeholder}
            className='outline-none w-full dark:text-[#a29dfa]  dark:bg-gray-700 placeholder:text-sm  text-gray-800 dark:focus:text-lightestPurple lg:py-2  border-purple border-[2px] pr-2 pl-10 py-1  focus:border-[#a29dfa] transition-all duration-300 rounded-md '
          />
        ) : (
          <textarea
            className='outline-none w-full dark:text-[#a29dfa]  dark:bg-gray-700 placeholder:text-sm  text-gray-800 dark:focus:text-lightestPurple lg:py-2  border-purple border-[2px] pr-2 pl-10 py-1  focus:border-[#a29dfa] transition-all duration-300 rounded-md '
            {...register}
            placeholder={placeholder}
            rows={rows}
          />
        )}
        {showIcon && (
          <div className='absolute bottom-0 text-purple left-[2px] dark:text-lightestPurple  rounded-l-full  w-8 h-8 border-r-2 border-purple flex items-center justify-center'>
            {icon}
          </div>
        )}
      </div>
      <p className='text-red-700 dark:text-red-400'>{errorMsg}</p>
    </div>
  );
};

export default FormGroupElement;
