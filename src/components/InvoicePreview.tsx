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
    <div ref={ref} className="bg-white p-8 md:p-12 min-h-[297mm] w-[210mm] mx-auto text-gray-800 relative border-t-8 border-blue-600">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {data.logo ? (
            <img src={data.logo} alt="Company Logo" className="h-20 object-contain mb-4" />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.billerName || 'Company Name'}</h1>
          )}
          <div className="text-sm text-gray-600">
            <p>{data.billerAddress}</p>
            <p>{data.billerEmail}</p>
            <p>{data.billerPhone}</p>
            {data.billerGst && <p>GST: {data.billerGst}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold text-blue-600/20 mb-4 tracking-widest">INVOICE</h2>
          <div className="text-sm">
            <p className="font-bold text-gray-800 text-lg mb-1">#{data.invoiceNumber}</p>
            <p>Date: {data.date}</p>
            <p>Due Date: {data.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8 border-b pb-8">
        <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Bill To:</h3>
        <h4 className="text-xl font-bold text-gray-800">{data.clientName}</h4>
        <div className="text-sm text-gray-600 mt-1">
          <p>{data.clientAddress}</p>
          <p>{data.clientEmail}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Item Description</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Qty</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Price</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 last:border-0">
              <td className="py-3">
                <p className="font-bold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </td>
              <td className="text-right py-3 text-gray-600">{item.quantity}</td>
              <td className="text-right py-3 text-gray-600">{data.currency}{item.price.toFixed(2)}</td>
              <td className="text-right py-3 font-medium text-gray-800">
                {data.currency}{(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2 space-y-2">
          <div className="flex justify-between text-gray-600 pt-2">
            <span>Subtotal:</span>
            <span>{data.currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax ({data.taxRate}%):</span>
            <span>{data.currency}{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span className="text-red-500">-{data.currency}{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping:</span>
            <span>{data.currency}{data.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-white bg-gray-800 p-4 rounded-lg mt-4">
            <span>Total</span>
            <span>{data.currency}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="border-t pt-4">
          <h4 className="font-bold text-gray-700 mb-2">Notes:</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';