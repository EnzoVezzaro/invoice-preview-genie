
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, Language, languageFlags } from '@/contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en-US' ? 'es-DO' : 'en-US');
  };

  return (
    <Button 
      onClick={toggleLanguage} 
      variant="ghost" 
      size="icon" 
      className="text-xl"
      aria-label={`Switch to ${language === 'en-US' ? 'Spanish' : 'English'}`}
    >
      {language === 'en-US' ? languageFlags['es-DO'] : languageFlags['en-US']}
    </Button>
  );
};

export default LanguageSwitcher;
