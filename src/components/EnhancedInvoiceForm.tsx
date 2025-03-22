
import React from 'react';
import InvoiceForm from './InvoiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/invoice-extended';
import CustomFieldsSection from './CustomFieldsSection';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedInvoiceFormProps {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
}

const EnhancedInvoiceForm: React.FC<EnhancedInvoiceFormProps> = ({ invoice, setInvoice }) => {
  const { t } = useLanguage();

  const handleFromCustomFieldsChange = (fields: { key: string; value: string }[]) => {
    setInvoice({
      ...invoice,
      fromCustomFields: fields
    });
  };

  const handleToCustomFieldsChange = (fields: { key: string; value: string }[]) => {
    setInvoice({
      ...invoice,
      toCustomFields: fields
    });
  };

  return (
    <div className="space-y-4">
      <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
      
      {/* From Custom Fields */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t('invoice.from')} - {t('invoice.addField')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomFieldsSection 
            fields={invoice.fromCustomFields || []}
            onChange={handleFromCustomFieldsChange}
          />
        </CardContent>
      </Card>
      
      {/* To Custom Fields */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t('invoice.to')} - {t('invoice.addField')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomFieldsSection 
            fields={invoice.toCustomFields || []}
            onChange={handleToCustomFieldsChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedInvoiceForm;
