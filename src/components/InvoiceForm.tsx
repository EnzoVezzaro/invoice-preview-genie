
import React from 'react';
import { InvoiceFormProps } from '@/types/invoice';
import BasicInvoiceInfo from './invoice/BasicInvoiceInfo';
import AddressSection from './invoice/AddressSection';
import InvoiceItemsSection from './invoice/InvoiceItemsSection';
import AdditionalInfoSection from './invoice/AdditionalInfoSection';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoice(prev => {
        if (parent === 'from' || parent === 'to') {
          return {
            ...prev,
            [parent]: {
              ...prev[parent as keyof typeof prev] as object,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setInvoice(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="w-full space-y-4 animate-slide-in">
      {/* Basic Invoice Info Section */}
      <BasicInvoiceInfo 
        invoice={invoice} 
        handleInputChange={handleInputChange} 
        setInvoice={setInvoice} 
      />

      {/* From & To Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Section */}
        <AddressSection 
          title="From" 
          address={invoice.from} 
          prefix="from" 
          handleInputChange={handleInputChange} 
        />
        
        {/* To Section */}
        <AddressSection 
          title="To" 
          address={invoice.to} 
          prefix="to" 
          handleInputChange={handleInputChange} 
        />
      </div>

      {/* Items Section */}
      <InvoiceItemsSection invoice={invoice} setInvoice={setInvoice} />

      {/* Additional Info */}
      <AdditionalInfoSection 
        notes={invoice.notes} 
        terms={invoice.terms} 
        handleInputChange={handleInputChange} 
      />
    </div>
  );
};

export default InvoiceForm;
