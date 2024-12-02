import React from 'react';
import { Button } from 'react-daisyui';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { formatCurrency } from '~/helper/formatCurrency';
import { IoMdHeartEmpty } from 'react-icons/io';
import { CartDetails, MenuDetail } from '~/types/menu';
import { useTranslation } from 'react-i18next';

interface FoodItemProps {
  item: MenuDetail;
}

const getCategoryColor = (categoryName: string) => {
  switch (categoryName) {
    case 'món chính':
      return 'bg-primary';
    case 'nước uống':
      return 'bg-secondary';
    case 'tráng miệng':
      return 'bg-success';
    case 'khai vị':
      return 'bg-accent';
    default:
      return 'bg-gray-500';
  }
};

const FoodItem: React.FC<FoodItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const handleAddToCart = () => {
    let cartItems = localStorage.getItem('cartItems');
    if (!cartItems) {
      const newItem: CartDetails = {
        menu_detail_id: item._id || '',
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        quantity: 1,
        note: ''
      };
      cartItems = JSON.stringify([newItem]);
      localStorage.setItem('cartItems', cartItems);
    } else {
      cartItems = JSON.parse(cartItems);
      if (Array.isArray(cartItems)) {
        const existingItemIndex = cartItems.findIndex(
          (cartItem: CartDetails) => cartItem.name === item.name
        );
        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += 1;
        } else {
          const newItem: CartDetails = {
            menu_detail_id: item._id || '',
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
            quantity: 1,
            note: ''
          };
          cartItems.push(newItem);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
    }
    toast.success(t('orderPage.productDetails.add_to_cart_success'));
    const cartItemAddedEvent = new CustomEvent('cartItemAdded', {
      detail: true
    });
    window.dispatchEvent(cartItemAddedEvent);
  };

  return (
    <div className="">
      <ToastContainer />
      <div className="relative mb-[10px] flex h-[full]  w-full rounded-[10px] shadow-md">
        <div className="h-full w-[40%] cursor-pointer overflow-hidden hover:opacity-[0.8]">
          <Link to={`/customer/${item._id}`}>
            <img
              src={item.image as string}
              alt={item.name}
              className="h-[150px]  w-full rounded-l-[10px] object-cover"
            ></img>
          </Link>
        </div>
        <div className="w-[60%]">
          <div className="mx-3 my-1">
            <div className="flex items-center justify-between">
              <h2 className="line-clamp-1  text-[1.1rem] font-semibold capitalize">
                {item.name}
              </h2>
              <div className="flex items-center gap-[3px] md:hidden">
                <IoMdHeartEmpty className="text-[1.2rem] text-primary" />
                <p>{Math.floor(Math.random() * 2 + 1)}</p>
              </div>
            </div>
            <p className="mb-2  line-clamp-2 text-sm font-light">
              {item.description}
            </p>
          </div>
          <div className="m-3 flex items-center justify-between pt-2 text-[1rem] text-primary">
            <p className="font-bold">{formatCurrency(item.price)}</p>
            <Button
              color="primary"
              className="text-white"
              onClick={handleAddToCart}
            >
              <FaPlus className="mx-2" />
            </Button>
          </div>
          {/* tag "hết món" */}
          {/* <div className="mb-2 ml-2 w-fit rounded-full border border-base-content bg-base-content">
          <p className="p-1 text-base-100">Hết món</p>
        </div> */}
        </div>
        {/* check string  */}
        {typeof item.category_id !== 'string' && (
          <div
            className={`absolute left-0 top-[0px] rounded-br-[10px] rounded-tl-[10px] p-1 text-[.8rem] text-white ${getCategoryColor(
              item.category_id.name
            )}`}
          >
            {item.category_id.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
