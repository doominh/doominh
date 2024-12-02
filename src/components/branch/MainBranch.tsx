import React, { useState, useEffect } from 'react';
import TableBranch from './TableBranch';
import { CiCirclePlus } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { useGetBranchesQuery } from '~/services/BaseApi.service';
import Loading from '~/components/Loading/LoadingLocal';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-daisyui';

const MainBranch: React.FC<object> = () => {
  const { data: branches, refetch, isLoading } = useGetBranchesQuery();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const navigate = useNavigate();
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { t } = useTranslation();

  useEffect(() => {
    refetch();
  }, []);

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedBranch(selectedId);
    if (selectedId) {
      navigate(`/admin/branch/${selectedId}`);
    }
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(
    currentPage * PAGE_SIZE,
    branches?.data?.length || 0
  );

  const totalPages = Math.ceil((branches?.data?.length || 0) / PAGE_SIZE);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };
  if (isLoading) {
    return (
      <div>
        <div className="pt-[30px] md:pt-0">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[20px]">
      <div className="flex items-center justify-between">
        <div className="">
          <select
            className="select w-full max-w-xs text-[1rem] outline-none"
            value={selectedBranch || ''}
            onChange={handleBranchChange}
          >
            <option disabled value="">
              {selectedBranch
                ? `${t('adminPage.branchesManagerment.mainBranch.selectBranch')}`
                : `${t('adminPage.branchesManagerment.mainBranch.chooseBranch')} (${branches?.data.length})`}
            </option>
            {branches &&
              branches.data.slice(startIndex, endIndex).map((branch, index) => (
                <option key={branch._id} value={String(branch._id)}>
                  {startIndex + index + 1}. {branch.name}
                </option>
              ))}
          </select>
        </div>
        <Link
          to="/admin/post-branch"
          className="btn mr-0 bg-green-500 font-bold text-white hover:bg-green-600 hover:opacity-[0.6]"
        >
          <CiCirclePlus className="text-[1.4rem]" />
        </Link>
      </div>
      <div className="mt-[20px]">
        <TableBranch
          branches={branches?.data.slice(startIndex, endIndex) || []}
          startIndex={startIndex}
        />
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Button
          color="secondary"
          className="text-white"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          {t('adminPage.branchesManagerment.mainBranch.prevPage')}
        </Button>
        <Button
          color="secondary"
          className="text-white"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          {t('adminPage.branchesManagerment.mainBranch.nextPage')}
        </Button>
      </div>
    </div>
  );
};

export default MainBranch;
