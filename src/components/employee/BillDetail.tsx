import { MdOutlineEditNote } from 'react-icons/md';
import { IoCheckmark } from 'react-icons/io5';
import { BtnEdit, BtnPrimary } from '~/styles';
export default function BillDetail() {
  return (
    <div className="flex max-h-[100%] min-h-[100%] flex-col justify-between overflow-y-auto scroll-smooth bg-base-100 px-[18px] pb-[40px] pt-[31px]">
      <div>
        {/* bill time */}
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Chi tiết đơn</h2>
            <div className="mt-[6px]">
              <span className="text-base font-light text-[#999692]">
                September 17, 2024
              </span>
            </div>
            <div className="mt-[6px]">
              <span className="text-base font-light text-[#999692]">
                9:41 AM
              </span>
            </div>
          </div>
          <div className="flex h-full items-start pt-[4px]">
            <div
              className={`flex items-center justify-center rounded-lg bg-primary px-2 py-1`}
            >
              <h1 className={`text-center text-[24px] font-bold text-base-100`}>
                A1
              </h1>
            </div>
          </div>
        </div>
        <hr className="mt-[20px] h-[1px] bg-[#D9D9D9] " />
        {/* bill item list */}
        <ul>
          {/*start bill item detail */}
          <li className="mt-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="text-xl font-medium ">Burger Mozzarella</h4>
                <div className="flex items-center gap-2">
                  <div className="h-[30px] w-[30px]">
                    <MdOutlineEditNote className="h-full w-full text-[#999999]" />
                  </div>
                  <span className="text-base font-light text-[#999999]">
                    không có
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <span className="block text-xl font-semibold text-primary">
                  88.000 vnđ
                </span>
                <div className="flex items-center gap-[10px]">
                  <span className="block text-base font-light text-accent">
                    Đã lên món
                  </span>
                  <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-accent">
                    <IoCheckmark className="h-[80%] w-[80%] text-base-100" />
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-[15px] h-[1px] bg-[#D9D9D9]" />
          </li>
          {/*end bill item detail */}

          <li className="mt-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="text-xl font-medium ">Burger Mozzarella</h4>
                <div className="flex items-center gap-2">
                  <div className="h-[30px] w-[30px]">
                    <MdOutlineEditNote className="h-full w-full text-[#999999]" />
                  </div>
                  <span className="text-base font-light text-[#999999]">
                    không có
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <span className="block text-xl font-semibold text-primary">
                  88.000 vnđ
                </span>
                <div className="flex items-center gap-[10px]">
                  <span className="block text-base font-light text-accent">
                    Đã lên món
                  </span>
                  <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-accent">
                    <IoCheckmark className="h-[80%] w-[80%] text-base-100" />
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-[15px] h-[1px] bg-[#D9D9D9]" />
          </li>

          <li className="mt-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="text-xl font-medium ">Burger Mozzarella</h4>
                <div className="flex items-center gap-2">
                  <div className="h-[30px] w-[30px]">
                    <MdOutlineEditNote className="h-full w-full text-[#999999]" />
                  </div>
                  <span className="text-base font-light text-[#999999]">
                    không có
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <span className="block text-xl font-semibold text-primary">
                  88.000 vnđ
                </span>
              </div>
            </div>
            <hr className="mt-[15px] h-[1px] bg-[#D9D9D9]" />
          </li>

          <li className="mt-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="text-xl font-medium ">Burger Mozzarella</h4>
                <div className="flex items-center gap-2">
                  <div className="h-[30px] w-[30px]">
                    <MdOutlineEditNote className="h-full w-full text-[#999999]" />
                  </div>
                  <span className="text-base font-light text-[#999999]">
                    không có
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <span className="block text-xl font-semibold text-primary">
                  88.000 vnđ
                </span>
              </div>
            </div>
            <hr className="mt-[15px] h-[1px] bg-[#D9D9D9]" />
          </li>
        </ul>
        {/* bill total */}
        <div className="mt-[25px] flex min-h-[200px] flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium">Món ăn (4)</h4>
            <span className="block text-xl font-semibold text-primary">
              123.000 vnđ
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium">VAT (5%)</h4>
            <span className="block text-xl font-semibold text-primary">
              13.000 vnđ
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium">Tổng tiền:</h4>
            <span className="block text-xl font-semibold text-primary">
              167.000 vnđ
            </span>
          </div>
        </div>
      </div>
      {/* bill action */}
      <div className="flex items-center justify-between">
        <BtnEdit>Chỉnh sửa</BtnEdit>
        <BtnPrimary>Hoàn tất</BtnPrimary>
      </div>
    </div>
  );
}
