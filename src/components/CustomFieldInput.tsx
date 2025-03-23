import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Invoice } from '@/types/invoice';

interface CustomFieldInputProps {
  keyName: string;
  addressType: 'from' | 'to';
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const CustomFieldInput: React.FC<CustomFieldInputProps> = ({
  keyName,
  addressType,
  invoice,
  setInvoice,
}) => {
  const [inputValue, setInputValue] = useState(keyName);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (inputValue !== keyName) {
      setInvoice((prev) => {
        const newCustomFields = { ...prev[addressType].customFields };
        delete Object.assign(newCustomFields, { [inputValue]: newCustomFields[keyName] })[keyName];
        return {
          ...prev,
          [addressType]: {
            ...prev[addressType],
            customFields: newCustomFields,
          },
        };
      });
    }
  };

  return (
    <Input
      placeholder="Field Name"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      ref={inputRef}
    />
  );
};

export default CustomFieldInput;
