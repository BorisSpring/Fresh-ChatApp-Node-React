import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { handleDownloadFile } from '../utils/utils';

const MessageFileBox = ({ fileName, id }) => {
  return (
    <div className='flex gap-3 bg-white p-2'>
      <div className='bg-violet-200 w-8 h-8 rounded-sm flex items-center justify-center'>
        <FaFileAlt className='text-darkPurple ' />
      </div>
      <div className='text-gray-600 '>
        <p className=' font-medium  text-sm '>{fileName}</p>
        <p className='text-xs'>10 Mb</p>
      </div>
      <button
        onClick={() => handleDownloadFile(id, fileName)}
        className='outline-none border-none text-darkPurple text-lg'
      >
        <IoMdDownload />
      </button>
    </div>
  );
};

export default MessageFileBox;
