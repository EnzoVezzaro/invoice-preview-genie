
import React from 'react';
import InvoicePreview from './InvoicePreview';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

interface EnhancedInvoicePreviewProps {
  invoice: Invoice;
}

const EnhancedInvoicePreview: React.FC<EnhancedInvoicePreviewProps> = ({ invoice }) => {
  // Create a modified preview that injects custom fields into the HTML
  const customFieldsStyle = `
    .custom-field {
      margin-top: 4px;
      display: flex;
    }
    .custom-field-type {
      font-weight: 500;
      margin-right: 4px;
    }
    .custom-field-value {
      color: #666;
    }
  `;

  const handleDownload = () => {
    generateInvoicePDF(invoice);
  };

  return (
    <div className="relative">
      <style>{customFieldsStyle}</style>
      <InvoicePreview invoice={invoice} />
      <Button onClick={handleDownload}>Download</Button>

      {/* Inject custom fields into preview */}
      {invoice.customFields?.length > 0 && (
        <div className="absolute" style={{ visibility: 'hidden' }}>
          <div id="customFields">
            {invoice.customFields?.map((field, index) => (
              field.type && field.value ? (
                <div key={index} className="custom-field">
                  <span className="custom-field-type">{field.type}:</span>
                  <span className="custom-field-value">{field.value}</span>
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedInvoicePreview;
