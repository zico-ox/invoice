// c:\Users\fayiz\Documents\codex\invoicemaker\src\app.tsx

import React, { useState, useRef, useEffect } from 'react';
import { FileText, Eye, Building2, X, Save, History } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { InvoiceData, InvoiceItem } from './types';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { CompanyForm } from './components/CompanyForm';
import { HistoryModal } from './components/HistoryModal';


const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: 'INV-0001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  billerName: '',
  billerEmail: '',
  billerAddress: '',
  billerPhone: '',
  billerGst: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  currency: '₹',
  items: [{ id: '1', name: '', description: '', quantity: 1, price: 0 }],
  taxRate: 0,
  discountType: 'percentage',
  discountValue: 0,
  shipping: 0,
  notes: 'Thank you for your business!',
  logo: null,
};

const generateInvoiceNumber = () => 'INV-0001';

const incrementInvoiceNumber = (current: string) => {
  const match = current.match(/(\d+)$/);
  if (match) {
    const numStr = match[1];
    const num = parseInt(numStr, 10) + 1;
    return current.replace(numStr, num.toString().padStart(numStr.length, '0'));
  }
  return current + '-1';
};

const InvoiceGenerator = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<InvoiceData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [downloadData, setDownloadData] = useState<InvoiceData | null>(null);
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    return {
      ...DEFAULT_INVOICE,
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    };
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await fetch('https://frc-entries-default-rtdb.firebaseio.com/company.json');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setInvoice(prev => ({ ...prev, ...data }));
          }
        }

        const invoicesResponse = await fetch('https://frc-entries-default-rtdb.firebaseio.com/invoices.json?orderBy=""&limitToLast=1');
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          if (invoicesData && Object.keys(invoicesData).length > 0) {
            const lastInvoice = Object.values(invoicesData)[0] as InvoiceData;
            if (lastInvoice.invoiceNumber) {
              setInvoice(prev => ({ ...prev, invoiceNumber: incrementInvoiceNumber(lastInvoice.invoiceNumber) }));
            }
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  const handleSaveCompanyDefaults = async () => {
    const companyData = {
      billerName: invoice.billerName,
      billerEmail: invoice.billerEmail,
      billerAddress: invoice.billerAddress,
      billerPhone: invoice.billerPhone,
      billerGst: invoice.billerGst,
    };
    
    try {
      await fetch('https://frc-entries-default-rtdb.firebaseio.com/company.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
      alert('Company data updated successfully! Future invoices will use these details.');
    } catch (error) {
      console.error('Error saving company data:', error);
      alert('Failed to save company data.');
    }
  };

  const handleUpdateCompany = () => {
    setIsEditingCompany(true);
  };

  const handleChange = (field: keyof InvoiceData, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), name: '', description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSaveInvoice = async (showSuccessAlert = true) => {
    const firebaseId = (invoice as any).firebaseId;
    const method = firebaseId ? 'PUT' : 'POST';
    const url = firebaseId 
      ? `https://frc-entries-default-rtdb.firebaseio.com/invoices/.json`
      : 'https://frc-entries-default-rtdb.firebaseio.com/invoices.json';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });
      
      if (response.ok) {
        if (showSuccessAlert) alert(firebaseId ? 'Invoice updated successfully!' : 'Invoice saved successfully!');
        if (!firebaseId) {
           // Only increment if it was a new invoice
           const nextNumber = incrementInvoiceNumber(invoice.invoiceNumber);
           setInvoice(prev => ({ ...prev, invoiceNumber: nextNumber }));
        }
        return true;
      } else {
        throw new Error('Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice.');
      return false;
    }
  };

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) return;
    setIsDownloading(true);
    
    // Use downloadData if available, otherwise current invoice
    const currentData = downloadData || invoice;

    try {
      // Wait for images to load if any
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('hidden-preview');
            if (clonedElement) {
                clonedElement.style.visibility = 'visible';
                clonedElement.style.position = 'absolute';
                clonedElement.style.left = '0px';
                clonedElement.style.top = '0px';
            }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${currentData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveAndDownload = async () => {
    setIsDownloading(true);
    try {
      const saved = await handleSaveInvoice(false);
      if (!saved) {
        setIsDownloading(false);
        return;
      }

      await handleDownloadPdf();
      window.location.reload();
    } catch (error) {
      console.error('Error in save and download:', error);
      setIsDownloading(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('https://frc-entries-default-rtdb.firebaseio.com/invoices.json');
      const data = await response.json();
      if (data) {
        const historyArray = Object.entries(data).map(([key, value]) => ({
          ...(value as InvoiceData),
          firebaseId: key
        }));
        setHistory(historyArray.reverse());
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Failed to fetch history.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleHistoryClick = () => {
    fetchHistory();
    setShowHistory(true);
  };

  const handleHistoryEdit = (data: InvoiceData) => {
    setInvoice(data);
    setShowHistory(false);
  };

  const handleHistoryDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await fetch(`https://frc-entries-default-rtdb.firebaseio.com/invoices/.json`, {
          method: 'DELETE',
        });
        setHistory(prev => prev.filter(item => (item as any).firebaseId !== id));
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice.');
      }
    }
  };

  const handleHistoryDownload = (data: InvoiceData) => {
    setDownloadData(data);
  };

  // Effect to trigger download when downloadData is set
  useEffect(() => {
    if (downloadData) {
      const generate = async () => {
        await handleDownloadPdf();
        setDownloadData(null);
      };
      // Small timeout to allow render
      setTimeout(generate, 100);
    }
  }, [downloadData]);


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/20 transform transition-transform hover:scale-105">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Invoice Generator</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Professional Invoicing Tool</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPreview(true)} 
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <div className="h-8 w-px bg-slate-200 hidden lg:block mx-1"></div>

            <button 
              onClick={handleHistoryClick} 
              className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="History"
            >
              <History className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleUpdateCompany} 
              className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Company Settings"
            >
              <Building2 className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleSaveAndDownload} 
              disabled={isDownloading} 
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl shadow-xl shadow-slate-900/10 transition-all hover:translate-y-0.5 active:translate-y-0 font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed ml-2"
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{(invoice as any).firebaseId ? 'Update & Download' : 'Save & Download'}</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 lg:pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
             <InvoiceForm 
              data={invoice} 
              onChange={handleChange} 
              onItemChange={handleItemChange}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          </div>
        </div>

        {/* Hidden Preview for PDF Generation */}
        <div id="hidden-preview" className="fixed top-0 left-0 w-[210mm] -z-50 invisible">
          <InvoicePreview ref={previewRef} data={downloadData || invoice} />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 sm:p-8 transition-all animate-in fade-in duration-200">
            <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Live Preview</h3>
                </div>
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-8 bg-slate-200/50 flex justify-center">
                <div className="shadow-2xl shadow-slate-400/20 rounded-sm overflow-hidden ring-1 ring-black/5 bg-white min-h-[297mm] h-fit origin-top scale-75 sm:scale-90 md:scale-100 transition-transform duration-300">
                  <InvoicePreview data={invoice} />
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditingCompany && (
          <CompanyForm 
            data={invoice} 
            onChange={handleChange} 
            onClose={() => setIsEditingCompany(false)}
            onSaveDefaults={handleSaveCompanyDefaults}
          />
        )}

        {showHistory && (
          <HistoryModal 
            history={history} 
            isLoading={isLoadingHistory}
            onClose={() => setShowHistory(false)} 
            onEdit={handleHistoryEdit}
            onDelete={handleHistoryDelete}
            onDownload={handleHistoryDownload}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerator;
