
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomFieldsSectionProps {
  fields: { type: string; value: string }[];
  onChange: (fields: { type: string; value: string }[]) => void;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({ fields, onChange }) => {
  const { t } = useLanguage();

  const handleAddField = () => {
    onChange([...fields, { type: 'From', value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    onChange(newFields);
  };

  const handleFieldChange = (index: number, type: string, value: string) => {
    const newFields = [...fields];
    newFields[index] = { type, value };
    onChange(newFields);
  };

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={index} className="flex gap-2">
          <Select onValueChange={(type) => handleFieldChange(index, type, field.value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" defaultValue={field.type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="From">From</SelectItem>
              <SelectItem value="To">To</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleFieldChange(index, field.type, e.target.value)}
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
