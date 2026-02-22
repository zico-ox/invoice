import React from 'react';
import { X, Save } from 'lucide-react';
import { InvoiceData } from '../types';
import { Input } from './ui/Input';

interface Props {
  data: InvoiceData;
  onChange: (field: keyof InvoiceData, value: any) => void;
  onClose: () => void;
  onSaveDefaults: () => void;
}

export const CompanyForm: React.FC<Props> = ({ data, onChange, onClose, onSaveDefaults }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-all">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h3 className="text-2xl font-bold text-gray-900">Company Profile</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Invoice Number" value={data.invoiceNumber} onChange={(e: any) => onChange('invoiceNumber', e.target.value)} />
            <Input label="Company Name" value={data.billerName} onChange={(e: any) => onChange('billerName', e.target.value)} />
            <Input label="Email" type="email" value={data.billerEmail} onChange={(e: any) => onChange('billerEmail', e.target.value)} />
            <Input label="Address" value={data.billerAddress} onChange={(e: any) => onChange('billerAddress', e.target.value)} />
            <Input label="Phone" value={data.billerPhone} onChange={(e: any) => onChange('billerPhone', e.target.value)} />
            <Input label="GST/Tax ID" value={data.billerGst} onChange={(e: any) => onChange('billerGst', e.target.value)} />
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100">
           <button onClick={onSaveDefaults} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
             <Save className="w-4 h-4" /> Save as Default
           </button>
           <button onClick={onClose} className="px-8 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg shadow-gray-900/20">
             Done
           </button>
        </div>
      </div>
    </div>
  );
};
