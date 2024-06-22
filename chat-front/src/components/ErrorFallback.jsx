import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className='bg-error-image  gap-5 h-screen '>
      <div className=' h-full text-purple bg-black/70 flex-col text-lg md:text-2lg lg:text-3xl font-bold text-center flex items-center justify-center gap-3 md:gap-5'>
        <h1>Ops Something went wrong please contact support!</h1>
        <p>{error?.message}</p>
        <button
          onClick={resetErrorBoundary}
          className=' bg-purple hover:shadow-white transition-all duration-500 hover:shadow-md hover:-translate-y-3 text-white font-bold md:text-lg py-1 md:py-2 rounded-md px-2 md:px-4 '
        >
          Go Back To Home Page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
