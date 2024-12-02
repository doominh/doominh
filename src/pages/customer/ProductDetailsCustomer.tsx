import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import CartCustomer from './CartCustomer';
import { useParams } from 'react-router-dom';
import { useGetMenuDetailByIdQuery } from '~/services/menuDetail/menuDetailApi.service';
import LoadingLocal from '~/components/Loading/LoadingLocal';
import { TextLogo } from '~/styles';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Button, Rating, Textarea } from 'react-daisyui';
import { formatCurrency } from '~/helper/formatCurrency';
import { LuMinus } from 'react-icons/lu';
import { GoPlus } from 'react-icons/go';
import { IoMdHeartEmpty } from 'react-icons/io';
import { MdOutlineAccessTime } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';
import { IoFastFoodOutline } from 'react-icons/io5';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { CartDetails } from '~/types/menu';
import { toast, ToastContainer } from 'react-toastify';
// import { RootState } from '~/redux/store';
// import { useAppSelector } from '~/hooks/hooks';

const ProductDetailsCustomer: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dataMenuDetail, isLoading } = useGetMenuDetailByIdQuery(
    id || ''
  );
  const [note, setNote] = useState<string>('');
  // const branch_id = useAppSelector(
  //   (state: RootState) => state.branch.data?._id
  // );

  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(4);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [menuDetailData, setMenuDetailData] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (dataMenuDetail) {
      setMenuDetailData(dataMenuDetail?.data);
    }
  }, [dataMenuDetail]);

  useEffect(() => {
    const storedQuantity = localStorage.getItem('quantity');
    const storedPrice = localStorage.getItem('price');
    if (storedQuantity && storedPrice) {
      setQuantity(parseInt(storedQuantity));
      setPrice(parseFloat(storedPrice));
    }
  }, []);

  useEffect(() => {
    const cartItemsString = localStorage.getItem('cartItems');
    let cartItems: CartDetails[] = [];
    let storedPrice = 0;

    if (cartItemsString) {
      cartItems = JSON.parse(cartItemsString);
      storedPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    setPrice(storedPrice);
  }, []);

  if (isLoading)
    return (
      <div>
        <LoadingLocal />
      </div>
    );

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    const cartItemsString = localStorage.getItem('cartItems');
    let cartItems: CartDetails[] = [];
    let updatedQuantity = quantity;

    if (cartItemsString) {
      cartItems = JSON.parse(cartItemsString);
      const existingItemIndex = cartItems.findIndex(
        (cartItem: CartDetails) => cartItem.name === menuDetailData.name
      );
      if (existingItemIndex !== -1) {
        updatedQuantity += cartItems[existingItemIndex].quantity;
      }
    }

    const newItem: CartDetails = {
      menu_detail_id: menuDetailData._id,
      name: menuDetailData.name,
      price: menuDetailData.price,
      description: menuDetailData.description,
      image: menuDetailData.image,
      quantity: updatedQuantity,
      note: note
    };

    if (!cartItems) {
      cartItems = [newItem];
    } else {
      const existingItemIndex = cartItems.findIndex(
        (cartItem: CartDetails) => cartItem.name === menuDetailData.name
      );
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex] = newItem;
      } else {
        cartItems.push(newItem);
      }
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    const cartItemAddedEvent = new CustomEvent('cartItemAdded', {
      detail: true
    });
    window.dispatchEvent(cartItemAddedEvent);
    toast.success(t('orderPage.productDetails.add_to_cart_success'));
    const updatedPrice = menuDetailData.price * updatedQuantity;
    setPrice(updatedPrice);
  };

  return (
    <div className="container mx-auto overflow-x-hidden md:px-[10px] md:py-[20px] ">
      <ToastContainer />
      <div className="hidden items-center justify-between md:flex">
        <div className="">
          <div className="block cursor-pointer md:hidden">
            <p className="text-[1.7rem] font-bold text-primary">Gloria</p>
          </div>

          <div className="">
            <p className="hidden md:block">
              <TextLogo className="text-primary">Gloria</TextLogo>
            </p>
          </div>
        </div>
        <div className="flex items-center md:gap-[10px]">
          <div className="flex cursor-pointer items-center  rounded-md border bg-white p-2">
            <input
              type="text"
              className="w-full bg-transparent  text-[14px] outline-none"
              placeholder={t('orderPage.customerDashboard.search_placeholder')}
            />
            <button type="submit">
              <CiSearch className="text-[1.4rem]" />
            </button>
          </div>
          <div className=" cursor-pointer ">
            <div className="hidden md:block">
              <CartCustomer />
            </div>
            {/* <div className="fixed bottom-0 left-0 right-0 z-[5] block  bg-white p-[10px] md:hidden">
              <CartCustomer />
            </div> */}
          </div>
        </div>
      </div>
      <div className="mt-[10px] hidden md:block">
        <Breadcrumbs className="text-[1rem] md:text-[1.2rem]">
          <Breadcrumbs.Item href="/">
            <AiOutlineHome className="mr-[5px]" />
            {t('orderPage.productDetails.home')}
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="font-bold capitalize text-primary">
            <IoFastFoodOutline className="mr-[5px]" />
            {menuDetailData?.name}
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
      <div className="mb-[10px] block justify-between gap-[20px] md:mt-[30px] md:flex">
        <div className="block w-full md:w-[40%]">
          <div className="relative">
            <img
              src={menuDetailData?.image}
              alt=""
              className="h-[200px] w-full cursor-pointer rounded-b-[10px] object-cover shadow-md md:h-[350px] md:rounded-[10px]"
            />
            <div className="absolute right-[10px] top-[10px] rounded-[10px] bg-secondary p-2 text-[.8rem] text-white md:rounded-br-[10px] md:rounded-tl-[10px] md:text-[1.1rem]">
              {menuDetailData?.category_id.name}
            </div>
            {/* <Link
              to={`/customer?branch_id=${branch_id}&table_name=A3`}
              className="absolute left-[10px] top-[10px] p-2"
            >
              <p className="cursor-pointer text-white">
                <IoIosArrowBack className="text-[1.2rem]" />
              </p>
            </Link> */}
          </div>
          <div className="mt-[15px] hidden gap-[15px] md:flex">
            <img
              src={menuDetailData?.image}
              alt=""
              className="w-full cursor-pointer rounded-[10px]"
            />
            <img
              src={menuDetailData?.image}
              alt=""
              className="w-full cursor-pointer rounded-[10px]"
            />

            <img
              src={menuDetailData?.image}
              alt=""
              className="w-full cursor-pointer rounded-[10px]"
            />
            <img
              src={menuDetailData?.image}
              alt=""
              className="w-full cursor-pointer rounded-[10px]"
            />
          </div>
        </div>
        <div className="w-full p-[10px]  md:w-[60%] md:p-0">
          <div className="mt-[10px] flex items-center justify-between md:mt-0">
            <div className="flex items-center gap-[15px]">
              <h1 className="text-[1.2rem] font-bold capitalize text-primary md:text-[2rem]">
                {menuDetailData?.name}
              </h1>
              <div className="flex items-center gap-[4px] text-[1rem]">
                <MdOutlineAccessTime />
                15 {t('orderPage.productDetails.minutes')}
              </div>
            </div>
            <div className="flex items-center gap-[3px] md:hidden">
              <IoMdHeartEmpty className="text-[1.2rem] text-primary" />
              <p>{Math.floor(Math.random() * 2 + 1)}</p>
            </div>
          </div>
          <div className="mt-[10px] flex items-center gap-[10px]">
            <div className="">
              <Rating value={rating} onChange={setRating}>
                <Rating.Item
                  name="rating-1"
                  className="mask mask-star-2 bg-orange-400"
                />
              </Rating>
            </div>
            <div className="font-light">
              <p>(4.6 {t('orderPage.productDetails.rating')})</p>
            </div>
          </div>
          <div className="text-1rem] mt-[10px] flex items-center gap-[20px] md:text-[1.4rem]">
            <p className="font-bold">
              {t('orderPage.productDetails.price')}:{' '}
              {formatCurrency(menuDetailData?.price)}
            </p>
            <p className="font-light text-gray-300 line-through">
              {formatCurrency(400000)}
            </p>
          </div>
          <div className="mt-[20px] text-justify text-[1.1rem]">
            <p className="font-bold">
              {' '}
              {t('orderPage.productDetails.description')}
            </p>
            <p className="text-[.9rem] font-light md:text-[1.1rem]">
              {menuDetailData?.description}
            </p>
          </div>
          <div className="mt-[10px]">
            <p className="text-[1rem] font-bold">
              {t('orderPage.updateCart.notes')}
            </p>
            <div className="component-preview  w-full items-center gap-2  font-sans">
              <Textarea
                className="w-full text-[.9rem]"
                placeholder={
                  menuDetailData && menuDetailData?.note !== ''
                    ? menuDetailData?.note
                    : t('orderPage.updateCart.example_placeholder')
                }
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-[60px] mt-[20px]  block  items-center  gap-[30px] md:mb-0 md:flex">
            <div className="flex items-center justify-center  gap-[10px]">
              <Button
                color="primary"
                className="text-white"
                onClick={decreaseQuantity}
              >
                <LuMinus />
              </Button>
              <p>{quantity}</p>
              <Button
                color="primary"
                className="text-white"
                onClick={increaseQuantity}
              >
                <GoPlus />
              </Button>
            </div>
            <div className="fixed bottom-0 left-0 right-0 flex w-full justify-center  bg-white p-[10px] md:static md:mt-0 md:block">
              <Button
                color="primary"
                className="w-full text-[.9rem] text-white  md:w-[300px] md:text-[1rem] "
                onClick={handleAddToCart}
              >
                <AiOutlineShoppingCart />
                {t('orderPage.productDetails.add_to_cart')} -{' '}
                {formatCurrency(price)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCustomer;
