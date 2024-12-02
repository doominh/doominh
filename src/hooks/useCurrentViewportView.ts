import { useEffect, useState } from 'react';

export const useCurrentViewportView = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });

    return () =>
      window.removeEventListener('resize', () => {
        setWidth(window.innerWidth);
      });
  }, []);

  return { width, isMobile: width < 768 };
};

export const useCurrentTabletView = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { width, isTablet: width >= 768 && width < 1024 };
};
