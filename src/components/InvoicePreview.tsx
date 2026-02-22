// c:\Users\fayiz\Documents\codex\invoicemaker\src\components\InvoicePreview.tsx

import React, { forwardRef } from 'react';
import { InvoiceData } from '../types';

interface Props {
  data: InvoiceData;
}

export const InvoicePreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * (data.taxRate / 100);
  const discount = data.discountType === 'percentage' 
    ? subtotal * (data.discountValue / 100) 
    : data.discountValue;
  const total = subtotal + tax + data.shipping - discount;

  return (
    <div ref={ref} className="bg-white min-h-[297mm] w-[210mm] mx-auto relative text-slate-800 shadow-2xl font-sans">
      {/* Header Background - Smoother Gradient */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 print:bg-slate-900"></div>
      
      <div className="relative p-12 md:p-16 pb-32 z-10">
        {/* Header Content */}
        <div className="flex justify-between items-start mb-16 text-white">
          <div className="w-1/2">
            {/* Company Name - Larger Typography */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">{data.billerName || 'Company Name'}</h1>
            
            {/* Company Details - Improved Hierarchy */}
            <div className="text-slate-300 text-sm space-y-1.5 font-medium leading-relaxed opacity-90">
              <p>{data.billerAddress}</p>
              <p>{data.billerEmail}</p>
              <p>{data.billerPhone}</p>
              {data.billerGst && <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-blue-200">GST: {data.billerGst}</p>}
            </div>
          </div>

          <div className="text-right w-1/2">
            {/* Invoice Label - Bold & Large */}
            <h2 className="text-5xl md:text-6xl font-black text-white/5 absolute top-6 right-12 tracking-tighter select-none pointer-events-none uppercase">Invoice</h2>
            
            <div className="relative mt-2 flex flex-col items-end">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-blue-200 font-bold mb-1">Invoice Number</p>
                  <p className="text-3xl font-bold text-white tracking-tight">#{data.invoiceNumber}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                    <div>
                        <span className="block text-xs uppercase tracking-widest text-blue-200 font-bold mb-1">Date Issued</span>
                        <span className="font-medium text-white text-sm">{data.date}</span>
                    </div>
                    {data.dueDate && (
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-blue-200 font-bold mb-1">Due Date</span>
                            <span className="font-medium text-white text-sm">{data.dueDate}</span>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Bill To Section - Card Style */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-8 mb-12 flex items-start justify-between backdrop-blur-sm">
          <div className="w-full">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Bill To
            </h3>
            <h4 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{data.clientName}</h4>
            <div className="text-sm text-slate-500 space-y-1.5 font-medium">
              <p>{data.clientAddress}</p>
              <p>{data.clientEmail}</p>
            </div>
          </div>
        </div>

        {/* Items Table - Modern & Clean */}
        <div className="mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 rounded-lg">
                <th className="text-left py-4 px-4 font-bold text-slate-600 uppercase text-xs tracking-wider rounded-l-lg w-1/2">Item Description</th>
                <th className="text-right py-4 px-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Qty</th>
                <th className="text-right py-4 px-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Price</th>
                <th className="text-right py-4 px-4 font-bold text-slate-600 uppercase text-xs tracking-wider rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-5 px-4 align-top">
                    <p className="font-bold text-slate-800 text-base mb-1">{item.name}</p>
                    {item.description && <p className="text-slate-500 text-xs leading-relaxed max-w-md">{item.description}</p>}
                  </td>
                  <td className="text-right py-5 px-4 text-slate-600 font-medium align-top">{item.quantity}</td>
                  <td className="text-right py-5 px-4 text-slate-600 font-medium align-top">{data.currency}{(item.price || 0).toFixed(2)}</td>
                  <td className="text-right py-5 px-4 font-bold text-slate-900 align-top">
                    {data.currency}{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section - Summary Card */}
        <div className="flex justify-end mb-16">
          <div className="w-5/12 bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-500 text-sm">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-slate-700">{data.currency}{subtotal.toFixed(2)}</span>
              </div>
              
              {(data.taxRate || 0) > 0 && (
                <div className="flex justify-between text-slate-500 text-sm">
                  <span className="font-medium">Tax ({data.taxRate}%)</span>
                  <span className="font-semibold text-slate-700">{data.currency}{tax.toFixed(2)}</span>
                </div>
              )}
              
              {discount > 0 && (
                <div className="flex justify-between text-slate-500 text-sm">
                  <span className="font-medium">Discount</span>
                  <span className="font-semibold text-green-600">-{data.currency}{discount.toFixed(2)}</span>
                </div>
              )}
              
              {(data.shipping || 0) > 0 && (
                <div className="flex justify-between text-slate-500 text-sm">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold text-slate-700">{data.currency}{(data.shipping || 0).toFixed(2)}</span>
                </div>
              )}
              
              <div className="my-4 border-t border-slate-200"></div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-slate-900">Total Amount</span>
                <span className="font-black text-3xl text-blue-600">{data.currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Notes */}
        <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-8">
            <div>
                <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Notes & Terms
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{data.notes}</p>
            </div>
            <div className="text-right flex flex-col items-end justify-end">
                 <div className="text-center">
                    <div className="h-16 w-48 border-b-2 border-slate-200 mb-2"></div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Authorized Signature</p>
                 </div>
            </div>
        </div>
        
        {/* Bottom Branding */}
        <div className="absolute bottom-0 left-0 w-full p-8 text-center border-t border-slate-50">
           <p className="text-slate-300 text-xs font-semibold tracking-widest uppercase">Thank you for your business</p>
        </div>
      </div>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
