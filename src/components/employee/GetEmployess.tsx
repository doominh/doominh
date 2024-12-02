import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetUsersQuery,
  useDeleteUserMutation
} from '~/services/employee/employeeApi.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Employee } from '~/types/employee';
import Loading from '~/components/Loading/LoadingLocal';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Button, Modal } from 'react-daisyui';
import { useTranslation } from 'react-i18next';

const GetEmployees: React.FC = () => {
  const { t } = useTranslation();
  const { data: employeesResponse, isLoading, refetch } = useGetUsersQuery();
  const [deleteEmployee] = useDeleteUserMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, [selectedEmployee]);

  const handleCloseModal = () => {
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const result = await deleteEmployee(id);

      if ('error' in result) {
        throw new Error('Error deleting employee');
      }
      toast.success(
        t(
          'adminPage.employeesManagerment.mainEmployees.tableEmployees.notify.success'
        )
      );
      handleCloseModal();
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(
        t(
          'adminPage.employeesManagerment.mainEmployees.tableEmployees.notify.error'
        )
      );
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [employeesResponse]);

  if (isLoading) {
    return <Loading />;
  }

  const employees = employeesResponse?.data || [];
  const totalRecords = employees.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const pageNumbers = Array.from(Array(totalPages).keys()).map(
    pageNumber => pageNumber + 1
  );

  return (
    <div>
      <ToastContainer />
      <div className="rounded-lg bg-base-100 p-2">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="table flex items-center">
            <thead className="bg-primary text-center text-white">
              <tr className="text-[.9rem]">
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.stt'
                  )}
                </th>
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.fullname'
                  )}
                </th>
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.role'
                  )}
                </th>
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.email'
                  )}
                </th>
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.phone'
                  )}
                </th>
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.accountStatus'
                  )}
                </th>
                <th>
                  {t(
                    'adminPage.employeesManagerment.mainEmployees.tableEmployees.tableHeader.action'
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {employees
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((employee: Employee, index: number) => (
                  <tr key={index}>
                    <td className="font-semibold">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td>{employee.fullname}</td>
                    <td>
                      <p>{employee.role}</p>
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      {employee.status === 0 ? (
                        <p className="text-secondary">
                          {t(
                            'adminPage.employeesManagerment.mainEmployees.tableEmployees.employeeStatus.inactive'
                          )}
                        </p>
                      ) : (
                        <p className="text-primary">
                          {t(
                            'adminPage.employeesManagerment.mainEmployees.tableEmployees.employeeStatus.active'
                          )}
                        </p>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-[10px]">
                        <div className="">
                          <Link to={`/admin/employees/${employee._id}`}>
                            <Button color="secondary" className="text-white">
                              {t(
                                'adminPage.employeesManagerment.mainEmployees.tableEmployees.actionButtons.view'
                              )}
                            </Button>
                          </Link>
                        </div>
                        <div className="">
                          <Button
                            color="primary"
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-white"
                          >
                            {t(
                              'adminPage.employeesManagerment.mainEmployees.tableEmployees.actionButtons.delete'
                            )}
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEmployee && (
        <Modal ref={modalRef} role="dialog">
          <div className="">
            <h3 className="text-[1rem] font-bold text-primary">
              {t(
                'adminPage.employeesManagerment.mainEmployees.tableEmployees.modal.title'
              )}
              {` ${selectedEmployee.fullname}`}
            </h3>
            <p className="py-4">
              {t(
                'adminPage.employeesManagerment.mainEmployees.tableEmployees.modal.description'
              )}
            </p>
            <div className="modal-action">
              <Button
                onClick={handleCloseModal}
                className="btn border-none bg-secondary text-white hover:bg-secondary hover:opacity-[0.6]"
              >
                {t(
                  'adminPage.employeesManagerment.mainEmployees.tableEmployees.modal.cancelButton'
                )}
              </Button>
              <Button
                onClick={() => handleDeleteEmployee(selectedEmployee._id)}
                className="btn border-none bg-primary text-white hover:bg-primary hover:opacity-[0.6]"
              >
                {t(
                  'adminPage.employeesManagerment.mainEmployees.tableEmployees.modal.confirmButton'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="mt-4 flex justify-center">
        <button
          className=" mr-2 text-black"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>
        {pageNumbers.map((pageNumber, index) => (
          <Button
            key={index}
            color={`${currentPage === pageNumber ? 'primary' : 'neutral'}`}
            className="mx-1 text-white"
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <button
          className=" mr-2  text-black"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default GetEmployees;
