import React, { useState, useRef, useEffect } from 'react';
import { FileText, Moon, Sun, Eye, Building2, X, Save, History } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(false);
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

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

        const invoicesResponse = await fetch('https://frc-entries-default-rtdb.firebaseio.com/invoices.json?orderBy="$key"&limitToLast=1');
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
      logo: invoice.logo,
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
      ? `https://frc-entries-default-rtdb.firebaseio.com/invoices/${firebaseId}.json`
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
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
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
        await fetch(`https://frc-entries-default-rtdb.firebaseio.com/invoices/${id}.json`, {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">
            <div className="p-2.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Invoice Generator</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage professional invoices</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm transition-all" title="Toggle Dark Mode">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-all">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleHistoryClick} className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm">
                <History className="w-4 h-4" /> <span className="hidden sm:inline">History</span>
              </button>
              <button onClick={handleUpdateCompany} className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm">
                <Building2 className="w-4 h-4" /> <span className="hidden sm:inline">Company</span>
              </button>
              <button onClick={handleSaveAndDownload} disabled={isDownloading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                <Save className="w-4 h-4" /> {isDownloading ? 'Processing...' : ((invoice as any).firebaseId ? 'Update & Download' : 'Save & Download')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 pt-[180px] lg:pt-32">
        <div className="max-w-3xl mx-auto">
          <InvoiceForm 
            data={invoice} 
            onChange={handleChange} 
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        </div>

        {/* Hidden Preview for PDF Generation */}
        <div className="fixed left-[-9999px] top-0 w-[210mm]">
          <InvoicePreview ref={previewRef} data={downloadData || invoice} />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 transition-all">
            <div className="relative w-full max-w-5xl h-[90vh] bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Preview</h3>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex justify-center min-w-fit">
                  <div className="shadow-lg rounded-xl overflow-hidden ring-1 ring-black/5">
                    <InvoicePreview data={invoice} />
                  </div>
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