
import { Invoice as BaseInvoice } from './invoice';

// Extending the base invoice type with custom fields
export interface Invoice extends BaseInvoice {
  id: string;
  fromCustomFields?: { key: string; value: string }[];
  toCustomFields?: { key: string; value: string }[];
  date: string;  // Added for compatibility with the existing code
  dueDate: string;  // Added for compatibility with the existing code
}

// Initialize an empty invoice with default values
export const emptyInvoice: Invoice = {
  id: '',
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dateIssued: new Date().toISOString().split('T')[0],
  dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    phone: '',
  },
  to: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    phone: '',
  },
  items: [],
  notes: '',
  terms: '',
  taxRate: 0,
  taxAmount: 0,
  subtotal: 0,
  total: 0,
  currency: '$',
  fromCustomFields: [],
  toCustomFields: [],
};
