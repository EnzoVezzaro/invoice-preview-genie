import { useTranslation as useI18nextTranslation } from 'react-i18next';

const useTranslation = () => {
  const { t } = useI18nextTranslation();
  return t;
};

export default useTranslation;
