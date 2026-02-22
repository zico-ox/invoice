import React from 'react';
import { Upload, X, Save } from 'lucide-react';
import { InvoiceData } from '../types';
import { Input } from './ui/Input';

interface Props {
  data: InvoiceData;
  onChange: (field: keyof InvoiceData, value: any) => void;
  onClose: () => void;
  onSaveDefaults: () => void;
}

export const CompanyForm: React.FC<Props> = ({ data, onChange, onClose, onSaveDefaults }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => onChange('logo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Company Logo</label>
            <div className="flex items-center gap-4">
              {data.logo && <img src={data.logo} alt="Logo" className="h-12 w-12 object-contain rounded" />}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-200 font-medium">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Invoice Number" value={data.invoiceNumber} onChange={(e: any) => onChange('invoiceNumber', e.target.value)} />
            <Input label="Company Name" value={data.billerName} onChange={(e: any) => onChange('billerName', e.target.value)} />
            <Input label="Email" type="email" value={data.billerEmail} onChange={(e: any) => onChange('billerEmail', e.target.value)} />
            <Input label="Address" value={data.billerAddress} onChange={(e: any) => onChange('billerAddress', e.target.value)} />
            <Input label="Phone" value={data.billerPhone} onChange={(e: any) => onChange('billerPhone', e.target.value)} />
            <Input label="GST/Tax ID" value={data.billerGst} onChange={(e: any) => onChange('billerGst', e.target.value)} />
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700">
           <button onClick={onSaveDefaults} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
             <Save className="w-4 h-4" /> Save as Default
           </button>
           <button onClick={onClose} className="px-8 py-2.5 bg-gray-900 dark:bg-blue-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-gray-900/20">
             Done
           </button>
        </div>
      </div>
    </div>
  );
};
