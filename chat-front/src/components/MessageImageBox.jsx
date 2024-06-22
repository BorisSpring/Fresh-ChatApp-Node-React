import React, { useState } from 'react';
import { getImageUrl, handleDownloadFile } from '../utils/utils';
import { IoMdDownload } from 'react-icons/io';

const MessageImageBox = ({ imageUrl, id }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const toggleIsImageOpen = () => setIsImageOpen((prev) => !prev);
  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='flex flex-col items-center justify-center gap-2'
      >
        <img
          onClick={(e) => {
            e.stopPropagation();
            toggleIsImageOpen();
          }}
          src={getImageUrl(imageUrl)}
          alt='user sent image'
          className='w-32 h-16 object-contain cursor-pointer resize '
        />
        <button
          onClick={() => handleDownloadFile(id, imageUrl)}
          className='outline-none border-none text-xl '
        >
          <IoMdDownload />
        </button>
      </div>
      {isImageOpen && (
        <div className='fixed top-0  flex-col gap-5 left-0 w-screen h-screen z-20 flex items-center justify-center bg-black/50'>
          <img
            onClick={() => {
              toggleIsImageOpen();
            }}
            src={getImageUrl(imageUrl)}
            alt='user sent image'
            className='w-[90%] md:w-[40%] max-h-[300px] max-w-[550px] object-contain cursor-pointer resize '
          />
          <button
            onClick={() => {
              toggleIsImageOpen();
            }}
            className='outline-none border-none  text-white text-3xl'
          >
            <IoMdDownload />
          </button>
        </div>
      )}
    </>
  );
};

export default MessageImageBox;
