import { useEffect, useState } from 'react';

export const useDebounce = (searchProject: string, timeDelay: number) => {
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchProject);
    }, timeDelay);

    return () => clearTimeout(delayDebounceFn);
  }, [searchProject]);

  return { searchValue };
};
