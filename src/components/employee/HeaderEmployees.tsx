import React from 'react';

const HeaderEmployees: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="my-7 flex w-full items-center justify-center rounded-lg py-4  md:mt-12 md:justify-between md:pl-2 md:shadow-headerMenu lg:mt-0 ">
      <div className="flex items-center gap-[45px]">
        <h1 className="m-0 p-0 text-2xl font-bold capitalize text-primary-content lg:p-3 lg:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeaderEmployees;
