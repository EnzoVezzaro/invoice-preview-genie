
export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  invoiceNumber: string;
  dateIssued: string;
  dateDue: string;
  from: Address;
  to: Address;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  currency: string;
  logo?: string;
}

export interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export interface InvoicePreviewProps {
  invoice: Invoice;
}

export interface InvoiceItemProps {
  item: InvoiceItem;
  onUpdate: (id: string, item: InvoiceItem) => void;
  onRemove: (id: string) => void;
  currency: string;
}
