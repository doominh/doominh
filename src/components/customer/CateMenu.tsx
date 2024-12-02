import React from 'react';

const menu_list = [
  {
    menu_name: 'Salad'
  },
  {
    menu_name: 'Burger'
  },
  {
    menu_name: 'Pizza'
  },
  {
    menu_name: 'Chnitzel'
  },
  {
    menu_name: 'Curry'
  },
  {
    menu_name: 'ad'
  },
  {
    menu_name: 'fg'
  },
  {
    menu_name: 'ttt'
  },
  {
    menu_name: 'y6'
  }
];

interface CateMenuProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}
const CateMenu: React.FC<CateMenuProps> = ({ category, setCategory }) => {
  return (
    <nav className="flex justify-center">
      <div className="  mt-7 flex h-16 overflow-auto scroll-smooth ">
        {menu_list.map((item, index) => {
          return (
            <button
              onClick={() =>
                setCategory(prev =>
                  prev === item.menu_name ? 'All' : item.menu_name
                )
              }
              key={index}
              className={`btn mx-2 min-w-28 rounded-full border-none shadow-lg ${category === item.menu_name ? 'bg-primary text-white' : ''}`}
            >
              {item.menu_name}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CateMenu;
