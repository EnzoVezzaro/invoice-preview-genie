
import React from 'react';
import InvoicePreview from './InvoicePreview';
import { Invoice } from '@/types/invoice-extended';

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
    .custom-field-key {
      font-weight: 500;
      margin-right: 4px;
    }
    .custom-field-value {
      color: #666;
    }
  `;

  return (
    <div className="relative">
      <style>{customFieldsStyle}</style>
      <InvoicePreview invoice={invoice} />
      
      {/* Inject custom fields into preview */}
      {(invoice.fromCustomFields?.length > 0 || invoice.toCustomFields?.length > 0) && (
        <div className="absolute" style={{ visibility: 'hidden' }}>
          <div id="fromCustomFields">
            {invoice.fromCustomFields?.map((field, index) => (
              field.key && field.value ? (
                <div key={index} className="custom-field">
                  <span className="custom-field-key">{field.key}:</span>
                  <span className="custom-field-value">{field.value}</span>
                </div>
              ) : null
            ))}
          </div>
          <div id="toCustomFields">
            {invoice.toCustomFields?.map((field, index) => (
              field.key && field.value ? (
                <div key={index} className="custom-field">
                  <span className="custom-field-key">{field.key}:</span>
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
