"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useVisit, useInvoice, useCreateInvoice } from "@/hooks/useBilling";
import { PatientInfo } from "@/components/billing/PatientInfo";
import { InvoiceDetails } from "@/components/billing/InvoiceDetails";
import { PaymentForm } from "@/components/billing/PaymentForm";
import { PaymentHistory } from "@/components/billing/PaymentHistory";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { InvoiceItemCategory, BillingItem } from "@/lib/types";
import {
  ReceiptText,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Badge,
} from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { visitId } = useParams() as { visitId: string };
  const {
    data: visit,
    isLoading: isLoadingVisit,
    isError: isErrorVisit,
  } = useVisit(visitId);
  const { data: invoice } = useInvoice(visit?.invoice?.id || "");
  const createInvoice = useCreateInvoice();

  const [items, setItems] = useState<BillingItem[]>([
    {
      description: "",
      category: InvoiceItemCategory.Consultation,
      quantity: 1,
      unit_price: 0,
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        category: InvoiceItemCategory.Consultation,
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof BillingItem,
    value: string | number,
  ) => {
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
          <p className="text-slate-500 font-normal">Loading visit data...</p>
        </div>
      </div>
    );
  }

  if (isErrorVisit || !visit) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-100 bg-red-50">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-normal text-slate-900">
              Visit Not Found
            </h3>
            <p className="text-slate-600">
              The visit you are looking for does not exist or has been removed.
            </p>
            <Link href="/" passHref>
              <Button variant="outline" className="w-full">
                Go Back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#F8FAFC] p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="h-12 w-12 flex items-center justify-center rounded-[4px] bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-normal tracking-tight text-slate-900">
                Patient Billing
              </h1>
              <p className="text-slate-500 font-normal text-sm">
                Review clinical services and process payments.
              </p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <Badge className="mb-1 bg-white border-slate-200 text-slate-500 font-normal">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Badge>
            <p className="text-[10px] font-normal text-slate-300 uppercase tracking-[0.2em]">
              Ref: {visitId.split("-")[0]}
            </p>
          </div>
        </div>

        {/* Patient Info Banner */}
        <PatientInfo patient={visit.patient} visit={visit} />

        {!visit.invoice ? (
          /* Invoice Creation Section */
          <Card className="border-none rounded-[4px] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl font-normal text-slate-900">
                <ReceiptText className="h-7 w-7 mr-3 text-blue-600" />
                Generate New Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end p-6 rounded-[4px] bg-slate-50/30 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="md:col-span-4">
                      <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-2 block">
                        Service Description
                      </label>
                      <input
                        className="w-full h-12 px-4 rounded-[4px] border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-normal text-slate-700 transition-all"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        placeholder="e.g. General Consultation"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-2 block">
                        Category
                      </label>
                      <select
                        className="w-full h-12 px-4 rounded-[4px] border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-normal text-slate-700 transition-all appearance-none"
                        value={item.category}
                        onChange={(e) =>
                          updateItem(index, "category", e.target.value)
                        }
                      >
                        {Object.values(InvoiceItemCategory).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-2 block">
                        Qty
                      </label>
                      <input
                        type="number"
                        className="w-full h-12 px-4 rounded-[4px] border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-normal text-slate-700 transition-all"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-2 block">
                        Unit Price (RWF)
                      </label>
                      <input
                        type="number"
                        className="w-full h-12 px-4 rounded-[4px] border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-normal text-slate-700 transition-all"
                        value={item.unit_price || ""}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unit_price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
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

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="group h-12 rounded-[4px] px-6 border-slate-200 text-slate-600 font-normal hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  Add Service Item
                </Button>
                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-normal uppercase tracking-[0.2em] mb-1">
                      Grand Total
                    </p>
                    <p className="text-4xl font-normal text-slate-900">
                      {new Intl.NumberFormat("en-RW", {
                        style: "currency",
                        currency: "RWF",
                        minimumFractionDigits: 0,
                      }).format(
                        items.reduce(
                          (acc, curr) => acc + curr.quantity * curr.unit_price,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCreateInvoice}
                    isLoading={createInvoice.isPending}
                    className="h-16 px-12 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white font-normal text-lg "
                  >
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
                <PaymentForm
                  invoiceId={invoice.id}
                  remainingBalance={invoice.remaining_balance || "0"}
                />
              ) : (
                <Card className="border-none bg-emerald-50 border-emerald-100">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="h-12 w-12 rounded-[4px] bg-emerald-100 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-normal text-emerald-900">
                      Fully Paid
                    </h4>
                    <p className="text-sm text-emerald-700/70">
                      This invoice has been settled in full. No further payments
                      are required.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 hover:bg-emerald-100"
                    >
                      Print Receipt
                    </Button>
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
