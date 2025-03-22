
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CustomFieldsSectionProps {
  fields: { key: string; value: string }[];
  onChange: (fields: { key: string; value: string }[]) => void;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({ fields, onChange }) => {
  const { t } = useLanguage();

  const handleAddField = () => {
    onChange([...fields, { key: '', value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    onChange(newFields);
  };

  const handleFieldChange = (index: number, key: string, value: string) => {
    const newFields = [...fields];
    newFields[index] = { key, value };
    onChange(newFields);
  };

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder={t('invoice.customField')}
            value={field.key}
            onChange={(e) => handleFieldChange(index, e.target.value, field.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleRemoveField(index)}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button 
        type="button"
        variant="outline" 
        size="sm" 
        onClick={handleAddField}
        className="w-full mt-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('invoice.addField')}
      </Button>
    </div>
  );
};

export default CustomFieldsSection;
