import ReactCountryFlag from 'react-country-flag';
import { Dropdown } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { lngs } from '~/constants';

const DropDownSwitchLanguage = () => {
  const { t, i18n } = useTranslation();

  const SwitchLanguge = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle>🌍 {t('LanguageSwitch.title')}</Dropdown.Toggle>
        <Dropdown.Menu className="w-52">
          <Dropdown.Item
            onClick={() => SwitchLanguge(lngs.en.key)}
            tabIndex={0}
            className={i18n.language === lngs.en.key ? 'bg-neutral-200' : ''}
          >
            {' '}
            <ReactCountryFlag countryCode={lngs.en.countryCode} svg />{' '}
            {t('LanguageSwitch.en')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => SwitchLanguge(lngs.vi.key)}
            tabIndex={0}
            className={i18n.language === lngs.vi.key ? 'bg-neutral-200' : ''}
          >
            <ReactCountryFlag countryCode={lngs.vi.countryCode} svg />{' '}
            {t('LanguageSwitch.vi')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default DropDownSwitchLanguage;
