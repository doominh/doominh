import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DeliveryPapperBag } from '~/assets/images';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '~/libs/validators/auth_validator';
import { ILoginRequest, ILoginResponse } from '../../types/auth';

import { RootState } from '~/redux/store';
import { useLoginMutation } from '../../services/auth/authApi.service';
import { useAppDispatch, useAppSelector } from '~/hooks/hooks';
import { setAuthCurrentUser } from '~/services/auth/authSlice';
import { Toastify } from '~/helper/Toastify';
import { setBranch } from '~/services/branch/branchSlice';
import { useTranslation } from 'react-i18next';

const Login: React.FC<object> = () => {
  const [login, result] = useLoginMutation();
  const auth = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ILoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const handleLogin = async (data: ILoginRequest) => {
    if (!data.username || !data.password) {
      Toastify('vui lòng nhập username và password !', 404);
      return;
    }
    await login(data)
      .unwrap()
      .then((res: ILoginResponse) => {
        if (res) {
          reset();
          Toastify(res?.message, res?.statusCode);
          dispatch(setAuthCurrentUser(res.data));
          if ('branchId' in res.data) {
            dispatch(setBranch(res.data.branchId));
          }
        }
      })
      .catch(error => {
        Toastify(
          error?.data?.message || 'An error occurred',
          error?.data?.statusCode || 400
        );
      });
  };

  useEffect(() => {
    if (auth.currentUser && auth.loggedIn) {
      navigate(`/${auth.currentUser.role}/dashboard`);
    }
    if (result.isSuccess) {
      navigate(`/${auth.currentUser.role}/dashboard`);
    }
  }, [result, navigate, auth.currentUser, auth.loggedIn]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full gap-6 rounded-modal bg-cover bg-center bg-no-repeat sm:h-full md:w-8/12 md:bg-base-100 md:shadow-2xl lg:h-[542px] lg:w-[954px] lg:bg-hero-auth-modal-pattern">
        <div className="flex h-full w-full items-center justify-between lg:pl-16">
          <div className="w-full lg:w-1/2">
            <form
              className="flex w-full flex-col items-center justify-center pb-5 md:mt-10"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div className="text-4xl font-bold text-primary">
                {t('login.title')}
              </div>
              <hr className="mb-3 mt-2 w-[140px] border-b-2 border-solid border-primary" />

              <div className="mt-5 flex w-full flex-col items-center gap-5 px-8 md:m-0 md:mt-8">
                <input
                  type="text"
                  spellCheck="false"
                  className={`focus:shadow-outlin mb-3 block h-12 w-full appearance-none rounded-3xl border px-4 py-5 text-gray-500 shadow-lg focus:outline-none lg:h-16 ${errors.username && 'border-red-500'}`}
                  placeholder={t('user.username')}
                  {...register('username')}
                />
                <input
                  type="password"
                  className={`block h-12 w-full rounded-3xl border px-4 py-5 shadow-lg focus:outline-none md:h-16 ${errors.password && 'border-red-500'}`}
                  placeholder={t('user.password')}
                  {...register('password')}
                />

                <Link
                  to="/"
                  className="mt-2 text-lg text-gray-400 sm:ml-0 sm:mt-4 md:ml-auto md:mt-2 lg:mt-[10px] lg:text-base "
                >
                  {t('login.forgot')}
                </Link>

                <div className="flex w-full flex-col-reverse gap-5 lg:flex-row lg:items-end lg:justify-center lg:gap-10">
                  <div className="flex h-14 w-full items-center justify-center rounded-2xl ring-2 ring-primary hover:bg-opacity-75 active:scale-90 lg:h-[50px] lg:w-[169px]">
                    <Link
                      to="/auth/sign-up"
                      className="h-full w-full text-center text-lg leading-[3.2rem] text-base-content"
                    >
                      {t('login.signup')}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="mt-8 h-14 w-full rounded-2xl border-none bg-primary text-xl text-white hover:border-4 active:scale-90 lg:h-[50px] lg:w-[169px]"
                    disabled={result.isLoading}
                  >
                    {t('login.button')}
                  </button>
                </div>
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

export default Login;
