import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  firebaseId?: string;
}

interface ProductModalProps {
  onClose: () => void;
  products: Product[];
  onProductsChange: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ onClose, products, onProductsChange }) => {
  const [editingProduct, setEditingProduct] = useState({ name: '', price: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = async () => {
    if (!editingProduct.name || !editingProduct.price) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('https://frc-entries-default-rtdb.firebaseio.com/products.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          price: parseFloat(editingProduct.price) || 0
        })
      });

      if (!response.ok) throw new Error('Failed to add product');

      setEditingProduct({ name: '', price: '' });
      onProductsChange();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (firebaseId: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`https://frc-entries-default-rtdb.firebaseio.com/products/${firebaseId}.json`, {
        method: 'DELETE',
      });
      onProductsChange();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] ring-1 ring-slate-900/5">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Manage Products</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={e => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Web Design"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto items-end">
              <div className="flex-1 md:w-32">
              <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={e => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={handleAddProduct}
              disabled={isSubmitting || !editingProduct.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all active:scale-95 shrink-0"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
            </div>
          </div>

          <div className="space-y-2">
            {Array.isArray(products) && products.map((product) => (
              <div key={product.firebaseId} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-blue-200 transition-colors group">
                <div>
                  <div className="font-medium text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">₹{(Number(product.price) || 0).toFixed(2)}</div>
                </div>
                <button
                  onClick={() => product.firebaseId && handleDeleteProduct(product.firebaseId)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No products added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};