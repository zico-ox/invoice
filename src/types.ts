export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billerName: string;
  billerEmail: string;
  billerAddress: string;
  billerPhone: string;
  billerGst: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  currency: string;
  items: InvoiceItem[];
  taxRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  shipping: number;
  notes: string;
  logo: string | null;
}