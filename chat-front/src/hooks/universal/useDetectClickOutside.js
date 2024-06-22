import { useEffect } from 'react';

const useDetectClickOutside = (ref, callback, ignoreRefs) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        ignoreRefs?.every(
          (ignoreRef) => !ignoreRef?.current?.contains(event.target)
        )
      ) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback, ignoreRefs]);
};

export default useDetectClickOutside;
