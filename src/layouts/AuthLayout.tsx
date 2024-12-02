import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC<{}> = () => {
  return (
    <>
      <div className="max-w-dvw flex min-h-dvh items-center justify-center bg-hero-auth-pattern bg-cover bg-center bg-no-repeat">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
