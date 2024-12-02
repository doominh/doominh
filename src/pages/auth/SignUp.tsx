import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DeliveryPapperBag } from '~/assets/images';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FieldErrors } from 'react-hook-form';
import { registerSchema } from '~/libs/validators/auth_validator';
import { IRegisterRequest } from '~/types/auth';
import { useGetBranchesQuery } from '~/services/BaseApi.service';
import { useRegisterMutation } from '~/services/auth/authApi.service';
import { useTranslation } from 'react-i18next';

interface ResponseData {
  statusCode: number;
}

const SignUp: React.FC<object> = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegisterRequest>({
    resolver: zodResolver(registerSchema)
  });

  const [registerUser, { isLoading }] = useRegisterMutation();
  const { data: branches, isLoading: isFetchingBranches } =
    useGetBranchesQuery();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: IRegisterRequest) => {
    try {
      const response = await registerUser(data);

      if (
        'data' in response &&
        typeof response.data === 'object' &&
        response.data !== null &&
        'statusCode' in (response.data as ResponseData) &&
        (response.data as ResponseData).statusCode === 201
      ) {
        toast.success('Đăng ký thành công!');
        setTimeout(() => {
          navigate('/auth/login');
        }, 1000);
      } else {
        console.log(response);
        toast.error('Đăng ký thất bại. Vui lòng thử lại sau!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đăng ký thất bại. Vui lòng thử lại sau!');
    } finally {
      setSubmitted(false);
    }
  };

  const getFirstErrorField = (): string | null => {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        return key;
      }
    }
    return null;
  };

  const getErrorToShow = () => {
    if (submitted) {
      const firstErrorField: string | null = getFirstErrorField();
      if (
        firstErrorField &&
        errors[firstErrorField as keyof FieldErrors<IRegisterRequest>]
      ) {
        return errors[firstErrorField as keyof FieldErrors<IRegisterRequest>]
          ?.message;
      }
    }
    return null;
  };

  return (
    <div className="flex h-full w-full items-center justify-center ">
      <ToastContainer />
      <div className="w-full gap-6 rounded-modal bg-cover bg-center bg-no-repeat sm:h-full md:w-8/12 md:bg-base-100 md:shadow-2xl lg:h-fit lg:w-[954px] lg:bg-hero-auth-modal-pattern lg:pb-5">
        <div className="flex h-full w-full items-center justify-between lg:pl-16">
          <div className="w-full lg:w-1/2">
            <form
              className="flex w-full flex-col items-center justify-center pb-5 md:mt-10"
              onSubmit={handleSubmit(data => {
                if (!data.role || !data.branch) {
                  toast.error('Vui lòng chọn vai trò và chi nhánh!');
                  return;
                }
                setSubmitted(true);
                onSubmit(data);
              })}
            >
              <div className="text-4xl font-bold text-primary">
                {t('signup.title')}
              </div>
              <hr className="mb-3 mt-2 w-[140px] border-b-2 border-solid border-primary" />
              <div className="mt-5 flex w-full flex-col items-center gap-5 px-8 md:m-0 md:mt-8">
                <input
                  {...register('fullname')}
                  type="text"
                  spellCheck="false"
                  className={`focus:shadow-outlin mb-3 block h-12 w-full appearance-none rounded-3xl border px-4 py-5 text-gray-500 shadow-lg focus:outline-none lg:h-16 ${errors.fullname && 'border-red-500'}`}
                  placeholder={t('user.fullname')}
                />
                <input
                  {...register('username')}
                  type="text"
                  className={`block h-12 w-full rounded-3xl border px-4 py-5 shadow-lg focus:outline-none md:h-16 ${errors.username && 'border-red-500'}`}
                  placeholder={t('user.username')}
                />
                <input
                  {...register('password')}
                  type="password"
                  className={`block h-12 w-full rounded-3xl border px-4 py-5 shadow-lg focus:outline-none md:h-16 ${errors.password && 'border-red-500'}`}
                  placeholder={t('user.password')}
                />
                <input
                  {...register('email')}
                  type="email"
                  className={`block h-12 w-full rounded-3xl border px-4 py-5 shadow-lg focus:outline-none md:h-16 ${errors.email && 'border-red-500'}`}
                  placeholder={t('user.email')}
                />
                <input
                  {...register('phone')}
                  type="tel"
                  className={`block h-12 w-full rounded-3xl border px-4 py-5 shadow-lg focus:outline-none md:h-16 ${errors.phone && 'border-red-500'}`}
                  placeholder={t('shared.phone')}
                />
                <div className="grid w-full grid-cols-2 gap-[30px]">
                  <div
                    className={`h-12 cursor-pointer rounded-3xl border bg-base-100 px-2 shadow-lg focus:outline-none md:h-16 ${errors.role && 'border-red-500'}`}
                  >
                    <select
                      {...register('role')}
                      className={`h-12 w-full bg-transparent px-4 md:h-16 ${errors.role && 'border-red-500'}`}
                    >
                      <option value="">{t('signup.chooseRole')}</option>
                      <option value="chef">{t('user.role.chef')}</option>
                      <option value="employee">
                        {t('user.role.employee')}
                      </option>
                    </select>
                  </div>

                  {isFetchingBranches ? (
                    <p>Loading...</p>
                  ) : (
                    <div
                      className={`h-12 cursor-pointer rounded-3xl border bg-base-100 px-2 shadow-lg focus:outline-none md:h-16 ${errors.branch && 'border-red-500'}`}
                    >
                      <select
                        {...register('branch')}
                        className={`h-12 w-full bg-transparent px-4 md:h-16 ${errors.branch && 'border-red-500'}`}
                      >
                        <option value="">{t('signup.chooseBranch')}</option>
                        {branches?.data.map(branch => (
                          <option key={branch._id} value={String(branch._id)}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col-reverse gap-5 lg:flex-row lg:items-end lg:justify-center lg:gap-10">
                  <div className="flex h-14 w-full items-center justify-center rounded-2xl ring-2 ring-primary hover:bg-opacity-75 active:scale-90 lg:h-[50px] lg:w-[169px]">
                    <Link
                      to="/auth/login"
                      className="h-full w-full text-center text-lg leading-[3.2rem] text-base-content"
                    >
                      {t('signup.login')}
                    </Link>
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="mt-8 h-14 w-full rounded-2xl border-none bg-primary text-xl text-white hover:border-4 active:scale-90 lg:h-[50px] lg:w-[169px]"
                  >
                    {t('signup.button')}
                  </button>
                </div>
                {submitted && getErrorToShow() && (
                  <p className="mt-3 text-red-500">{getErrorToShow()}</p>
                )}
              </div>
            </form>
          </div>
          <img
            className="hidden bg-cover lg:block "
            src={DeliveryPapperBag}
            alt="Delivery paper bag"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
