import React from 'react';
import { Button, Modal, Textarea } from 'react-daisyui';
import { LuMinus } from 'react-icons/lu';
import { GoPlus } from 'react-icons/go';
import { formatCurrency } from '~/helper/formatCurrency';
import { useTranslation } from 'react-i18next';
import { CartDetails } from '~/types/menu';

const UpdateCartCustomer: React.FC<{
  selectedItem: CartDetails | null;
  handleDecreaseQuantity: () => void;
  handleIncreaseQuantity: () => void;
  handleUpdateItem: () => void;
  handleNoteChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({
  selectedItem,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleUpdateItem,
  handleNoteChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="">
      <Modal.Body>
        <div className="h-full">
          <div className="my-[30px] flex  w-full cursor-pointer items-center gap-[10px] rounded-[10px] px-2 py-1 shadow-md">
            <div className=" w-[100px]">
              <img
                src={selectedItem?.image as string}
                alt={selectedItem?.name}
                className="h-[70px] w-full rounded-[10px]"
              ></img>
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between gap-[10px]">
                <h2 className=" line-clamp-1 text-[1rem] font-semibold capitalize">
                  {selectedItem?.name}
                </h2>
              </div>
              <div className="mt-[10px] flex items-center justify-between text-sm text-primary">
                <p className="font-bold">
                  {selectedItem &&
                    formatCurrency(selectedItem.price * selectedItem.quantity)}
                </p>
                <p className="text-[1rem] font-bold text-primary">
                  x{selectedItem?.quantity}
                </p>
              </div>
            </div>
          </div>
          <div className="my-[20px]">
            <p className="text-[1rem] font-bold">
              {t('orderPage.updateCart.description')}
            </p>
            <p className="line-clamp-6 text-justify text-[1rem]">
              {selectedItem?.description}
            </p>
          </div>
          <div className="">
            <p className="text-[1rem] font-bold">
              {t('orderPage.updateCart.notes')}
            </p>
            <div className="component-preview  w-full items-center gap-2  font-sans">
              <Textarea
                className="w-full text-[.9rem]"
                placeholder={
                  selectedItem && selectedItem?.note !== ''
                    ? selectedItem?.note
                    : t('orderPage.updateCart.example_placeholder')
                }
                value={selectedItem?.note ?? ''}
                onChange={handleNoteChange}
              />
            </div>
          </div>
          <div className="mt-[10px] flex items-center justify-center gap-[10px]">
            <Button
              color="primary"
              className="text-white"
              onClick={handleDecreaseQuantity}
            >
              <LuMinus />
            </Button>
            <p>{selectedItem?.quantity}</p>
            <Button
              color="primary"
              className="text-white"
              onClick={handleIncreaseQuantity}
            >
              <GoPlus />
            </Button>
          </div>
          <div className="">
            <Button
              color="primary"
              className="mt-[20px] w-full text-white"
              onClick={handleUpdateItem}
            >
              {t('orderPage.updateCart.update_cart')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </div>
  );
};

export default UpdateCartCustomer;
