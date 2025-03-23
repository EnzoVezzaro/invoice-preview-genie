
import React from 'react';
import InvoiceForm from './InvoiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/invoice';
import CustomFieldsSection from './CustomFieldsSection';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedInvoiceFormProps {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
}

const EnhancedInvoiceForm: React.FC<EnhancedInvoiceFormProps> = ({ invoice, setInvoice }) => {
  const { t } = useLanguage();

  const handleCustomFieldsChange = (fields: { type: string; value: string }[]) => {
    setInvoice({
      ...invoice,
      customFields: fields
    });
  };

  return (
    <div className="space-y-4">
      <InvoiceForm invoice={invoice} setInvoice={setInvoice} />

      {/* Custom Fields */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t('invoice.customFields')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomFieldsSection
            fields={invoice.customFields || []}
            onChange={handleCustomFieldsChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedInvoiceForm;
