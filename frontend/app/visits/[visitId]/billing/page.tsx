'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useVisit, useInvoice, useCreateInvoice } from '@/hooks/useBilling';
import { PatientInfo } from '@/components/billing/PatientInfo';
import { InvoiceDetails } from '@/components/billing/InvoiceDetails';
import { PaymentForm } from '@/components/billing/PaymentForm';
import { PaymentHistory } from '@/components/billing/PaymentHistory';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InvoiceItemCategory, BillingItem } from '@/lib/types';
import { ReceiptText, Plus, Trash2, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  const { visitId } = useParams() as { visitId: string };
  const { data: visit, isLoading: isLoadingVisit, isError: isErrorVisit } = useVisit(visitId);
  const { data: invoice } = useInvoice(visit?.invoice?.id || '');
  const createInvoice = useCreateInvoice();

  const [items, setItems] = useState<BillingItem[]>([
    { description: '', category: InvoiceItemCategory.Consultation, quantity: 1, unit_price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: '', category: InvoiceItemCategory.Consultation, quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BillingItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleCreateInvoice = async () => {
    try {
      await createInvoice.mutateAsync({ visitId, items });
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoadingVisit) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading visit data...</p>
        </div>
      </div>
    );
  }

  if (isErrorVisit || !visit) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-100 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Visit Not Found</h3>
            <p className="text-slate-600 dark:text-slate-400">The visit you are looking for does not exist or has been removed.</p>
            <Link href="/" passHref>
              <Button variant="outline" className="w-full">Go Back</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:border-slate-800">
               <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Facility Billing</h1>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-sm font-medium text-slate-500">Date: {new Date().toLocaleDateString()}</p>
             <p className="text-xs text-slate-400">Visit ID: {visitId}</p>
          </div>
        </div>

        {/* Patient Info Banner */}
        <PatientInfo patient={visit.patient} visit={visit} />

        {!visit.invoice ? (
          /* Invoice Creation Section */
          <Card className="border-none shadow-xl">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center">
                <ReceiptText className="h-5 w-5 mr-2 text-blue-600" />
                Generate New Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="md:col-span-4">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Description</label>
                      <input 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="e.g. Consultation"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Category</label>
                      <select 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                      >
                        {Object.values(InvoiceItemCategory).map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Qty</label>
                      <input 
                        type="number"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Unit Price (RWF)</label>
                      <input 
                        type="number"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-1 pb-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={addItem} className="group">
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Add Another Item
                </Button>
                <div className="flex items-center space-x-4">
                  <div className="text-right mr-4">
                    <p className="text-xs text-slate-400 font-bold uppercase">Estimated Total</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(items.reduce((acc, curr) => acc + (curr.quantity * curr.unit_price), 0))}
                    </p>
                  </div>
                  <Button size="lg" onClick={handleCreateInvoice} isLoading={createInvoice.isPending} className="px-10">
                    Generate Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Invoice Management Section */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             {/* Left Column: Details & History */}
             <div className="lg:col-span-8 space-y-8">
                {invoice ? (
                  <>
                    <InvoiceDetails invoice={invoice} />
                    <PaymentHistory payments={invoice.payments || []} />
                  </>
                ) : (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                )}
             </div>

             {/* Right Column: Payment Form */}
             <div className="lg:col-span-4 sticky top-8">
                {invoice && !invoice.is_fully_paid ? (
                  <PaymentForm invoiceId={invoice.id} remainingBalance={invoice.remaining_balance || '0'} />
                ) : (
                  <Card className="border-none shadow-lg bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30">
                     <CardContent className="pt-6 text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Fully Paid</h4>
                        <p className="text-sm text-emerald-700/70 dark:text-emerald-400/70">This invoice has been settled in full. No further payments are required.</p>
                        <Button variant="outline" className="w-full border-emerald-200 hover:bg-emerald-100 dark:border-emerald-900 dark:hover:bg-emerald-900/50">Print Receipt</Button>
                     </CardContent>
                  </Card>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
