import React from 'react';
import { useTranslation } from 'react-i18next';

const TableBill: React.FC<{}> = () => {
  const { t } = useTranslation();

  return (
    // bill table
    <div className="mb-[25px]">
      <div className="mb-[10px] mt-[20px] overflow-x-auto rounded-lg bg-base-100 p-3 shadow-md xl:mt-[40px] ">
        <div className="mb-[10px] text-[1.1rem] font-semibold text-primary">
          {t('adminPage.dashboard.tableBill.latestBill')}
        </div>
        <div className="h-full overflow-x-auto ">
          <table className="table table-zebra">
            {/* head */}
            <thead className="rounded-lg bg-primary text-center text-[.9rem] text-white">
              <tr>
                <th>{t('adminPage.dashboard.tableBill.serialNumber')}</th>
                <th>{t('adminPage.dashboard.tableBill.branch')}</th>
                <th>{t('adminPage.dashboard.tableBill.quantity')}</th>
                <th>{t('adminPage.dashboard.tableBill.totalAmount')}</th>
                <th>{t('adminPage.dashboard.tableBill.date')}</th>
                <th>{t('adminPage.dashboard.tableBill.status')}</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>TP.HCM</td>
                <td>3</td>
                <td>{t('intlCurrencyWithOptions', { val: '1000' })}</td>
                <td>20/3/2024 lúc 14:02</td>
                <td>
                  <button className="w-[120px] rounded-lg bg-green-500 p-2 text-center text-[1rem] text-white">
                    {t('adminPage.dashboard.tableBill.placed')}
                  </button>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>TP.HCM</td>
                <td>3</td>
                <td>{t('intlCurrencyWithOptions', { val: '1000' })}</td>
                <td>20/3/2024 lúc 14:02</td>
                <td>
                  <button className="w-[120px] rounded-lg bg-primary p-2 text-center text-[1rem] text-white">
                    {t('adminPage.dashboard.tableBill.cancelled')}
                  </button>
                </td>
              </tr>
              <tr>
                <th>3</th>
                <td>Hà Nội</td>
                <td>3</td>
                <td>{t('intlCurrencyWithOptions', { val: '1000' })}</td>
                <td>20/3/2024 lúc 14:02</td>
                <td>
                  <button className="w-[120px] rounded-lg  bg-orange-400 p-2 text-center text-[1rem] text-white">
                    {t('adminPage.dashboard.tableBill.placing')}
                  </button>
                </td>
              </tr>
              {/* row 1 */}
              <tr>
                <th>4</th>
                <td>TP.HCM</td>
                <td>3</td>
                <td>{t('intlCurrencyWithOptions', { val: '1000' })}</td>
                <td>20/3/2024 lúc 14:02</td>
                <td>
                  <button className="w-[120px] rounded-lg  bg-green-500 p-2 text-center text-[1rem] text-white">
                    {t('adminPage.dashboard.tableBill.placed')}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between text-center">
        <div className="">Trang 1/23</div>
        <div className="join justify-center rounded-lg">
          <button className="btn join-item bg-primary text-white">1</button>
          <button className="btn join-item">2</button>
          <button className="btn join-item">...</button>
          <button className="btn join-item">12</button>
          <button className="btn join-item">13</button>
        </div>
      </div>
    </div>
  );
};

export default TableBill;
