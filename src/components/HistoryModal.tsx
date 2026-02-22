import React from 'react';
import { X, Loader2, Download, Pencil, Trash2 } from 'lucide-react';
import { InvoiceData } from '../types';

interface Props {
  history: InvoiceData[];
  isLoading: boolean;
  onClose: () => void;
  onEdit: (invoice: InvoiceData) => void;
  onDelete: (id: string) => void;
  onDownload: (invoice: InvoiceData) => void;
}

export const HistoryModal: React.FC<Props> = ({ history, isLoading, onClose, onEdit, onDelete, onDownload }) => {
  const calculateTotal = (invoice: InvoiceData) => {
    const items = invoice.items || [];
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);
    const tax = subtotal * ((invoice.taxRate || 0) / 100);
    const discount = invoice.discountType === 'percentage' 
      ? subtotal * ((invoice.discountValue || 0) / 100) 
      : (invoice.discountValue || 0);
    return subtotal + tax + (invoice.shipping || 0) - discount;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice History</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Loading history...</p>
            </div>
          ) : history.length === 0 ? (
             <p className="text-center text-gray-500 py-8">No history found.</p>
          ) : (
            history.map((invoice, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{invoice.clientName || 'Unknown Client'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">#{invoice.invoiceNumber} • {invoice.date}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {invoice.currency || '₹'}{calculateTotal(invoice).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onDownload(invoice)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(invoice)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Edit Invoice"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete((invoice as any).firebaseId)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};