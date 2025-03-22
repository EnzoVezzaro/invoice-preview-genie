
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en-US' | 'es-DO';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'en-US': {
    // Invoice form
    'invoice.title': 'Invoice',
    'invoice.number': 'Invoice #',
    'invoice.date': 'Date',
    'invoice.dueDate': 'Due Date',
    'invoice.from': 'From',
    'invoice.to': 'To',
    'invoice.items': 'Items',
    'invoice.description': 'Description',
    'invoice.quantity': 'Quantity',
    'invoice.price': 'Price',
    'invoice.amount': 'Amount',
    'invoice.subtotal': 'Subtotal',
    'invoice.tax': 'Tax',
    'invoice.total': 'Total',
    'invoice.notes': 'Notes',
    'invoice.terms': 'Terms & Conditions',
    'invoice.addItem': 'Add Item',
    'invoice.removeItem': 'Remove',
    'invoice.addField': 'Add Field',
    'invoice.customField': 'Custom Field',
    
    // Buttons
    'button.save': 'Save',
    'button.print': 'Print',
    'button.download': 'Download PDF',
    'button.new': 'New Invoice',
    'button.delete': 'Delete',
    'button.load': 'Load',
  },
  'es-DO': {
    // Invoice form
    'invoice.title': 'Factura',
    'invoice.number': 'Factura #',
    'invoice.date': 'Fecha',
    'invoice.dueDate': 'Fecha de vencimiento',
    'invoice.from': 'De',
    'invoice.to': 'Para',
    'invoice.items': 'Artículos',
    'invoice.description': 'Descripción',
    'invoice.quantity': 'Cantidad',
    'invoice.price': 'Precio',
    'invoice.amount': 'Monto',
    'invoice.subtotal': 'Subtotal',
    'invoice.tax': 'Impuesto',
    'invoice.total': 'Total',
    'invoice.notes': 'Notas',
    'invoice.terms': 'Términos y Condiciones',
    'invoice.addItem': 'Agregar Artículo',
    'invoice.removeItem': 'Eliminar',
    'invoice.addField': 'Agregar Campo',
    'invoice.customField': 'Campo Personalizado',
    
    // Buttons
    'button.save': 'Guardar',
    'button.print': 'Imprimir',
    'button.download': 'Descargar PDF',
    'button.new': 'Nueva Factura',
    'button.delete': 'Eliminar',
    'button.load': 'Cargar',
  },
};

// Flag emojis using Unicode
export const languageFlags = {
  'en-US': '🇺🇸',
  'es-DO': '🇩🇴',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en-US');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
