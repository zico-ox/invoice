import React, { useState } from 'react';
import { Plus, Trash2, User, Layers, Settings, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types';
import { Input } from './ui/Input';
import { Product } from './ProductModal';

interface Props {
  data: InvoiceData;
  onChange: (field: keyof InvoiceData, value: any) => void;
  onItemChange: (id: string, field: keyof InvoiceItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  products: Product[];
}

export const InvoiceForm: React.FC<Props> = ({ data, onChange, onItemChange, onAddItem, onRemoveItem, products }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Default open for better UX
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Client Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800">Client Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Client Name" placeholder="e.g. Acme Corp" value={data.clientName} onChange={(e) => onChange('clientName', e.target.value)} />
          <Input label="Client Email" type="email" placeholder="client@example.com" value={data.clientEmail} onChange={(e) => onChange('clientEmail', e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Client Address" placeholder="123 Business Rd, City, Country" value={data.clientAddress} onChange={(e) => onChange('clientAddress', e.target.value)} />
          </div>
          <Input label="Invoice Date" type="date" value={data.date} onChange={(e) => onChange('date', e.target.value)} />
        </div>
      </div>

      {/* Items Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">Invoice Items</h3>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{data.items.length} Items</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-100">
            <div className="col-span-5">Item Details</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>
          
          <div className="space-y-3">
            {data.items.map((item, index) => (
              <div key={item.id} className="group relative grid grid-cols-12 gap-4 items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                <div className="col-span-12 md:col-span-5 relative">
                  <div className="flex md:hidden justify-between items-center mb-1">
                    <div className="text-xs font-bold text-slate-400 uppercase">Item Name</div>
                    <button 
                      onClick={() => onRemoveItem(item.id)} 
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Input 
                    placeholder="Item Name or Description" 
                    value={item.name} 
                    onChange={(e) => onItemChange(item.id, 'name', e.target.value)} 
                    onFocus={() => setFocusedItemId(item.id)}
                    onBlur={() => setTimeout(() => setFocusedItemId(null), 200)}
                    className="border-transparent bg-transparent focus:bg-white hover:bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  
                  {/* Product Dropdown */}
                  {focusedItemId === item.id && item.name && products && products.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                      {products
                        .filter(p => p.name.toLowerCase().includes(item.name.toLowerCase()) && p.name !== item.name)
                        .map(product => (
                          <button
                            key={product.id}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm flex justify-between items-center transition-colors border-b border-slate-50 last:border-0"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              onItemChange(item.id, 'name', product.name);
                              onItemChange(item.id, 'price', Number(product.price) || 0);
                              setFocusedItemId(null);
                            }}
                          >
                            <span className="font-medium text-slate-700">{product.name}</span>
                            <span className="text-slate-500 font-mono">₹{(Number(product.price) || 0).toFixed(2)}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <div className="col-span-4 md:col-span-2">
                  <div className="md:hidden text-xs font-bold text-slate-400 mb-1 uppercase">Qty</div>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={item.quantity} 
                    onChange={(e) => onItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                    className="text-center"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <div className="md:hidden text-xs font-bold text-slate-400 mb-1 uppercase">Price</div>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={item.price} 
                    onChange={(e) => onItemChange(item.id, 'price', parseFloat(e.target.value))}
                    className="text-right"
                  />
                </div>
                <div className="col-span-4 md:col-span-2 flex flex-col justify-center items-end h-full pt-1 md:pt-0">
                  <div className="md:hidden text-xs font-bold text-slate-400 mb-1 uppercase">Total</div>
                  <span className="font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 min-w-[80px] text-right">
                    {data.currency}{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="hidden md:flex md:col-span-1 justify-center mt-2 md:mt-0">
                  <button 
                    onClick={() => onRemoveItem(item.id)} 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onAddItem} 
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-semibold group"
          >
            <div className="bg-slate-100 group-hover:bg-blue-100 p-1 rounded-full transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            Add New Item
          </button>
        </div>
      </div>

      {/* Settings & Totals Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">Invoice Settings & Totals</h3>
          </div>
          {isSettingsOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        
        {isSettingsOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Currency Symbol</label>
                <div className="relative">
                  <select 
                    value={data.currency} 
                    onChange={(e) => onChange('currency', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all"
                  >
                    <option value="₹">INR (₹)</option>
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                  </select>
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
              <Input 
                label="Notes & Terms" 
                textarea 
                placeholder="Add payment terms, thank you notes, etc."
                value={data.notes} 
                onChange={(e) => onChange('notes', e.target.value)} 
                className="min-h-[120px]"
              />
            </div>
            
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Calculations</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Tax Rate (%)" 
                  type="number" 
                  placeholder="0"
                  value={data.taxRate} 
                  onChange={(e) => onChange('taxRate', parseFloat(e.target.value))} 
                />
                <Input 
                  label="Shipping Cost" 
                  type="number" 
                  placeholder="0.00"
                  value={data.shipping} 
                  onChange={(e) => onChange('shipping', parseFloat(e.target.value))} 
                />
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Discount</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={data.discountValue} 
                      onChange={(e) => onChange('discountValue', parseFloat(e.target.value))} 
                    />
                  </div>
                  <div className="w-1/3">
                    <select 
                      value={data.discountType} 
                      onChange={(e) => onChange('discountType', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">Flat</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};