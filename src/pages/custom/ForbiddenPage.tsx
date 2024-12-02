import { FaArrowLeft } from 'react-icons/fa';
import { LuLogIn } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth/authSlice';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';

function ForbiddenPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLoginClick = () => {
    dispatch(logout());
    navigate('auth/login');
  };

  return (
    <div className="bg-403 flex min-h-screen items-center justify-center gap-16 bg-cover px-4">
      <div className="bg-403ImgAssets hidden h-[443px] w-[511.56px] bg-cover md:block" />
      <div className="w-[518px]">
        <h1 className="mb-8 text-[82px] font-[900] leading-[82px]">403</h1>
        <div className="mb-8 ">
          <h2 className="text-[24px] font-bold">
            {t('message.forbiddenTitle')}
          </h2>
          <p className="text-[18px] font-medium">
            {t('message.forbiddenContent')}
          </p>
        </div>
        <div className="flex items-center justify-start gap-5">
          <Link
            to="/"
            className="flex w-fit items-center justify-start gap-3 rounded-lg border border-primary bg-[#FFF9F4] px-4 py-3 font-bold text-primary hover:bg-[#EAE2DB]"
          >
            <FaArrowLeft />
            <span>Trở về Trang Chủ</span>
          </Link>
          <Button
            type="button"
            color="primary"
            onClick={handleLoginClick}
            className=" text-white "
          >
            <LuLogIn />
            <span>{t('login.title')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenPage;
