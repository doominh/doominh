import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import {
  useGetBranchByNameQuery
  // useGetBranchByAddressQuery
} from '~/services/branch/branchApi.service';
import { IBranch } from '~/types/branch';

const SearchDashboard: React.FC<{}> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IBranch | undefined>(
    undefined
  );
  const [searchExecuted, setSearchExecuted] = useState(false);
  const navigate = useNavigate();
  const branchByNameQuery = useGetBranchByNameQuery(searchTerm, {
    skip: !searchExecuted
  });
  // const branchByAddressQuery = useGetBranchByAddressQuery(searchTerm, {
  //   skip: !searchExecuted
  // });

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchExecuted(true);
    setIsSearching(true);
    if (searchTerm) {
      try {
        const branchByName = await branchByNameQuery;
        const result = branchByName?.data as IBranch;

        // const branchByAddress = await branchByAddressQuery;
        // result = branchByAddress?.data as IBranch;

        if (result && result._id) {
          console.log(result);

          setSearchResults(result);
          navigate(`/admin/branch/${result._id}`);
          return;
        }
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSearchExecuted(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="flex cursor-pointer items-center  rounded-md border bg-white p-2">
          <input
            type="text"
            className="w-full bg-transparent  text-[14px] outline-none"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button type="submit">
            <CiSearch className="text-[1.4rem]" />
          </button>
        </div>
        {
          isSearching ? (
            <div>Loading...</div>
          ) : searchResults ? (
            <div>
              <p>{searchResults.name}</p>
              {/* <p>{searchResults.address}</p> */}
            </div>
          ) : null /* Không có kết quả tìm kiếm */
        }
      </form>
    </div>
  );
};

export default SearchDashboard;
