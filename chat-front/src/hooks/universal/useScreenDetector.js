import { useEffect, useState } from 'react';

export const useScreenDetector = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const isMobile = windowSize < 768;
  const isTablet = windowSize >= 768 && windowSize <= 1024;
  const isDesktop = windowSize > 1024;

  const onHandleWindowWidthChange = () => {
    setWindowSize(() => window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', onHandleWindowWidthChange);

    return window.removeEventListener('resize', onHandleWindowWidthChange);
  }, []);

  return { isMobile, isTablet, isDesktop };
};
