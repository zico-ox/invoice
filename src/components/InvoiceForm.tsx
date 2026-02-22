import React, { useState } from 'react';
import { Plus, Trash2, User, Layers, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types';
import { Input } from './ui/Input';

interface Props {
  data: InvoiceData;
  onChange: (field: keyof InvoiceData, value: any) => void;
  onItemChange: (id: string, field: keyof InvoiceItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export const InvoiceForm: React.FC<Props> = ({ data, onChange, onItemChange, onAddItem, onRemoveItem }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      {/* Client Details */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Client Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Client Name" value={data.clientName} onChange={(e) => onChange('clientName', e.target.value)} />
          <Input label="Client Email" type="email" value={data.clientEmail} onChange={(e) => onChange('clientEmail', e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Client Address" value={data.clientAddress} onChange={(e) => onChange('clientAddress', e.target.value)} />
          </div>
          <Input label="Date" type="date" value={data.date} onChange={(e) => onChange('date', e.target.value)} />
          <Input label="Due Date" type="date" value={data.dueDate} onChange={(e) => onChange('dueDate', e.target.value)} />
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Items</h3>
        </div>
        
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Item</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1"></div>
          </div>
        {data.items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-3 items-start md:items-center bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-sm">
            <div className="col-span-12 md:col-span-4">
              <Input placeholder="Item Name" value={item.name} onChange={(e) => onItemChange(item.id, 'name', e.target.value)} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <Input placeholder="Description" value={item.description} onChange={(e) => onItemChange(item.id, 'description', e.target.value)} />
            </div>
            <div className="col-span-4 md:col-span-2">
              <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => onItemChange(item.id, 'quantity', parseFloat(e.target.value))} />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Input type="number" placeholder="Price" value={item.price} onChange={(e) => onItemChange(item.id, 'price', parseFloat(e.target.value))} />
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-center pb-2">
              <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <button onClick={onAddItem} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 font-medium">
          <Plus className="w-4 h-4" /> Add Item
        </button>
        </div>
      </div>

      {/* Settings & Totals */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Settings & Totals</h3>
          </div>
          {isSettingsOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {isSettingsOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Currency</label>
            <select 
              value={data.currency} 
              onChange={(e) => onChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="₹">INR (₹)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
            </select>
            <Input label="Notes" textarea value={data.notes} onChange={(e) => onChange('notes', e.target.value)} />
          </div>
          <div className="space-y-3">
            <Input label="Tax Rate (%)" type="number" value={data.taxRate} onChange={(e) => onChange('taxRate', parseFloat(e.target.value))} />
            <Input label="Shipping Cost" type="number" value={data.shipping} onChange={(e) => onChange('shipping', parseFloat(e.target.value))} />
            <div className="flex gap-2">
              <div className="flex-1">
                <Input label="Discount" type="number" value={data.discountValue} onChange={(e) => onChange('discountValue', parseFloat(e.target.value))} />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Type</label>
                <select 
                  value={data.discountType} 
                  onChange={(e) => onChange('discountType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};