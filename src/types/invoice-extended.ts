
import { Invoice as BaseInvoice } from './invoice';

// Extending the base invoice type with custom fields
export interface Invoice extends BaseInvoice {
  id: string;
  fromCustomFields?: { key: string; value: string }[];
  toCustomFields?: { key: string; value: string }[];
}

// Initialize an empty invoice with default values
export const emptyInvoice: Invoice = {
  id: '',
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: {
    name: '',
    email: '',
    address: '',
    phone: '',
  },
  to: {
    name: '',
    email: '',
    address: '',
    phone: '',
  },
  items: [],
  notes: '',
  terms: '',
  fromCustomFields: [],
  toCustomFields: [],
};
