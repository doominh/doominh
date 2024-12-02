import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Drawer, Menu, Modal } from 'react-daisyui';
import { IoCartOutline } from 'react-icons/io5';
import { formatCurrency } from '~/helper/formatCurrency';
import { CartDetails } from '~/types/menu';
import UpdateCartCustomer from '~/components/customer/UpdateCartCustomer';
import { useTranslation } from 'react-i18next';
import { useCreateBillMutation } from '~/services/bill/billApi.service';
import { TbShoppingBagSearch } from 'react-icons/tb';
import { GrNotes } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSendOrder } from '~/libs/socketio/useSendOrder';
import { socket } from '~/libs/socketio/socket';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const CartCustomer: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartDetails | null>(null);
  const [cartItems, setCartItems] = useState<CartDetails[]>([]);
  const { t } = useTranslation();
  const toggleVisible = useCallback(() => {
    setVisible(visible => !visible);
  }, []);

  const navigate = useNavigate();

  const [createBillMutation] = useCreateBillMutation();
  const urlParams = new URLSearchParams(window.location.search);
  const branch_id = urlParams.get('branch_id') || '';
  const tableName = urlParams.get('table_name') || '';

  const storedCartItems = localStorage.getItem('cartItems');

  const sendOrder = useSendOrder({
    socket,
    tableName,
    branchId: branch_id,
    order: cartItems.map(item => ({
      _id: item._id || '',
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      sub_total: item.price * item.quantity,
      note: ''
    }))
  });

  const handleSubmitOrder = async () => {
    if (branch_id && tableName && storedCartItems) {
      const cartItems = JSON.parse(storedCartItems);
      const filteredCartItems = cartItems.map((item: CartDetails) => ({
        menu_detail_id: item.menu_detail_id,
        quantity: item.quantity,
        note: item.note
      }));

      const dataToSend = {
        branch_id: branch_id,
        tableName: tableName,
        cartItems: filteredCartItems
      };

      try {
        const response = await createBillMutation(dataToSend);
        if (response && 'data' in response) {
          if (response.data.statusCode === 201) {
            sendOrder();
            toast.success(t('orderPage.cartOders.success_message'));
            navigate(
              `/customer/bill?branch_id=${branch_id}&table_name=${tableName}`
            );
            localStorage.removeItem('cartItems');
          } else {
            toast.error(response.data.message);
          }
        } else if (response && 'error' in response) {
          const errorData = (response.error as FetchBaseQueryError)?.data as {
            message?: string;
          };
          if (errorData?.message) {
            toast.error(errorData.message);
          } else {
            toast.error(t('orderPage.cartOders.error_message'));
          }
        } else {
          toast.error(
            `${t('orderPage.cartOders.table_name')} ${tableName} ${t('orderPage.cartOders.not_open')}`
          );
        }
      } catch (error) {
        toast.error(
          t('orderPage.cartOders.create_bill_error') +
            (error instanceof Error && error.message
              ? `: ${error.message}`
              : '')
        );
      }
    } else {
      toast.error(t('orderPage.cartOders.error_message'));
    }
  };

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, [visible]);

  useEffect(() => {
    const handleCartItemAdded = () => {
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    };

    window.addEventListener('cartItemAdded', handleCartItemAdded);

    return () => {
      window.removeEventListener('cartItemAdded', handleCartItemAdded);
    };
  }, []);

  const totalAmount = cartItems.reduce((total: number, item: CartDetails) => {
    return total + item.price * item.quantity;
  }, 0);

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const handleSelectItem = (item: CartDetails) => {
    setSelectedItem(item);
    handleShow();
  };

  const handleDeleteItem = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.stopPropagation();
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleDecreaseQuantity = () => {
    if (selectedItem && selectedItem.quantity > 1) {
      setSelectedItem(prevItem => ({
        ...prevItem!,
        quantity: (prevItem?.quantity ?? 1) - 1
      }));
    }
  };

  const handleIncreaseQuantity = () => {
    if (selectedItem) {
      setSelectedItem(prevItem => ({
        ...prevItem!,
        quantity: (prevItem?.quantity ?? 0) + 1
      }));
    }
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      const updatedCartItems = cartItems.map(item =>
        item._id === selectedItem._id ? selectedItem : item
      );
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      toast.success(t('orderPage.cartOders.update'));
    }
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedItem) {
      setSelectedItem(prevItem => ({
        ...prevItem!,
        note: event.target.value
      }));
    }
  };

  return (
    <div>
      <div onClick={toggleVisible}>
        <div className="relative hidden md:block" color="primary">
          <IoCartOutline className="text-[2rem]" />
          <div className="absolute right-[-10px] top-[-10px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[.8rem] text-white">
            {cartItems.length}
          </div>
        </div>
        <Button
          className="flex w-full items-center justify-between text-white md:hidden"
          color="primary"
        >
          <p>
            {t('orderPage.cartOders.cart_title')}
            <span className="font-light">
              ({cartItems.length} {t('orderPage.cartOders.cart_item_count')})
            </span>
          </p>
          <p>
            <span>{formatCurrency(totalAmount)}</span>
          </p>
        </Button>
      </div>
      <div>
        <Drawer
          open={visible}
          onClickOverlay={toggleVisible}
          end
          className="z-[10]"
          side={
            <Menu className="block h-dvh w-[80%] overflow-y-hidden bg-white p-4 text-base-content md:w-[350px]">
              <div className="my-[20px]">
                <div className="flex items-center justify-center">
                  <p className="justify-center text-[1.4rem] font-bold text-primary">
                    {t('orderPage.cartOders.cart_title')}
                  </p>
                  <div
                    onClick={toggleVisible}
                    className=" absolute right-[10px] top-[15px]"
                  >
                    <p className="text-[1.4rem] font-bold">X</p>
                  </div>
                </div>
                <div className="mt-[20px] flex flex-wrap items-center justify-between gap-[10px]">
                  <p className="text-[1.1rem] font-bold">
                    {t('orderPage.cartOders.cart_my_dishes')} (
                    {cartItems.length})
                  </p>
                </div>
              </div>
              <Menu.Item className="block h-[65%] overflow-y-auto bg-white">
                {cartItems.length === 0 ? (
                  <div className="mt-[50%] block text-center">
                    <p className="text-[1.1rem] font-bold text-primary">
                      {t('orderPage.customerDashboard.no_menus_available')}
                    </p>
                    <div className="flex justify-center">
                      <TbShoppingBagSearch className="mt-[20px] text-[4rem]" />
                    </div>
                  </div>
                ) : (
                  cartItems.map((item: CartDetails, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleSelectItem(item)}
                      className="mb-[20px] block overflow-y-auto bg-white px-[10px] shadow-md"
                    >
                      <div className=" flex  w-full cursor-pointer items-center gap-[10px] rounded-[10px]">
                        <div className="relative w-[100px]">
                          <img
                            src={item.image as string}
                            alt={item.name}
                            className="h-[70px] w-full rounded-[10px]"
                          ></img>
                          <div className="absolute bottom-0 right-[0] rounded-br-[10px] rounded-tl-[10px] bg-black p-1 text-white">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="flex items-center justify-between gap-[10px]">
                            <h2 className=" line-clamp-1 text-[1rem] font-semibold capitalize">
                              {item.name}
                            </h2>
                            <Button
                              color="primary"
                              className=" text-white"
                              onClick={event => handleDeleteItem(event, index)}
                            >
                              {t('orderPage.cartOders.delete_cart')}
                            </Button>
                          </div>
                          <div className="mt-[10px] flex items-center justify-between text-sm text-primary">
                            <div className="line-clamp-1 flex items-center gap-[4px]  text-[.9rem] text-black">
                              <GrNotes />
                              {item.note ? (
                                <p className="line-clamp-1">{item.note}</p>
                              ) : (
                                <p className="line-clamp-1 text-gray-300">
                                  {' '}
                                  {t('orderPage.updateCart.notes')}
                                </p>
                              )}
                            </div>
                            <p className="font-bold">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Menu.Item>
              <div className="mt-[10px] flex items-center justify-between">
                <p className="mt-[10px] text-[1rem] text-black">
                  {t('orderPage.cartOders.total_amount')}: {cartItems.length}{' '}
                  {t('orderPage.cartOders.cart_item_count')}
                </p>
                <p className="mt-[10px] text-[1rem] font-bold text-black">
                  <span>{formatCurrency(totalAmount)}</span>
                </p>
              </div>
              <Button
                onClick={handleSubmitOrder}
                color="primary"
                className="mt-[20px] w-full text-white"
              >
                {t('orderPage.cartOders.confirm_button')}
              </Button>
            </Menu>
          }
        ></Drawer>
        <Modal
          ref={ref}
          className="fixed bottom-0 max-h-screen w-full rounded-none md:static md:max-h-[calc(100vh-5em)] md:rounded-[10px]"
        >
          <form method="dialog">
            <Button
              color="ghost"
              shape="circle"
              className="btn absolute right-2 top-2 rounded-[10px] bg-primary text-[1.4rem] text-white"
            >
              x
            </Button>
          </form>
          {/* <ToastContainer /> */}

          <Modal.Header className="font-bold text-primary">
            {`${selectedItem?.name}`}
          </Modal.Header>
          <UpdateCartCustomer
            selectedItem={selectedItem}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleUpdateItem={handleUpdateItem}
            handleNoteChange={handleNoteChange}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CartCustomer;
