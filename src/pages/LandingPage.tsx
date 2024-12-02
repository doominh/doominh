import React from 'react';
import { Button, Hero } from 'react-daisyui';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DropDownSwitchLanguage from '~/components/DropDownSwitchLanguage';

const LandingPage: React.FC<object> = () => {
  const { t } = useTranslation();

  return (
    <>
      <Hero
        className="min-h-screen w-screen"
        style={{
          backgroundImage:
            'url(https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x)'
        }}
      >
        <Hero.Overlay />
        <Hero.Content className="text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-white">
              {t('landingPage.welcome')}
            </h1>
            <p className="py-6 text-xl font-semibold text-slate-950">
              {t('landingPage.description')}
            </p>

            <div className="mb-5">
              <DropDownSwitchLanguage />
            </div>

            <Link to="auth/login">
              <Button color="primary" className="text-white">
                {t('landingPage.button')}
              </Button>
            </Link>
          </div>
        </Hero.Content>
      </Hero>
    </>
  );
};

export default LandingPage;
