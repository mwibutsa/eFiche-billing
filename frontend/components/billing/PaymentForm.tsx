import { useState } from "react";
import { PaymentMethod } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useProcessPayment } from "@/hooks/useBilling";
import {
 CreditCard,
 Banknote,
 Smartphone,
 ShieldCheck,
 CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
 invoiceId: string;
 remainingBalance: string;
}

export function PaymentForm({ invoiceId, remainingBalance }: PaymentFormProps) {
 const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
 const [amount, setAmount] = useState<string>(remainingBalance || "0");
 const processPayment = useProcessPayment();
 const [isSuccess, setIsSuccess] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 await processPayment.mutateAsync({
 invoiceId,
 amount: parseFloat(amount),
 method,
 });
      if (method !== PaymentMethod.MobileMoney) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        // For Mobile Money, show success/waiting state
        setIsSuccess(true);
        // We don't reset it automatically, or we show a different message
      }
 } catch {
 // Error handled by mutation
 }
 };

 const methods = [
 {
 id: PaymentMethod.Cash,
 label: "Cash",
 icon: Banknote,
 color: "text-emerald-600",
 bg: "bg-emerald-50",
 },
 {
 id: PaymentMethod.MobileMoney,
 label: "Mobile Pay",
 icon: Smartphone,
 color: "text-blue-600",
 bg: "bg-blue-50",
 },
 {
 id: PaymentMethod.BankTransfer,
 label: "Transfer",
 icon: CreditCard,
 color: "text-indigo-600",
 bg: "bg-indigo-50",
 },
 {
 id: PaymentMethod.Insurance,
 label: "Insurance",
 icon: ShieldCheck,
 color: "text-slate-600",
 bg: "bg-slate-100",
 },
 ];

 return (
 <Card className="border-none rounded-[10px] overflow-hidden bg-white">
 <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
 <CardTitle className="text-xl font-normal text-slate-900">Process Payment</CardTitle>
 </CardHeader>
 <CardContent className="p-8">
 {isSuccess ? (
  <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in zoom-in-95 duration-300">
  <div className={cn("h-16 w-16 rounded-[10px] flex items-center justify-center", method === PaymentMethod.MobileMoney ? "bg-blue-100" : "bg-emerald-100")}>
  {method === PaymentMethod.MobileMoney ? (
  <Smartphone className="h-10 w-10 text-blue-600 animate-pulse" />
  ) : (
  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
  )}
  </div>
  <div>
  <h4 className="text-xl font-normal text-slate-900 ">
  {method === PaymentMethod.MobileMoney ? "Payment Initiated" : "Payment Confirmed"}
  </h4>
  <p className="text-slate-500">
  {method === PaymentMethod.MobileMoney 
  ? "Please complete the payment on your mobile device. We'll update the status automatically."
  : "The transaction has been processed successfully."}
  </p>
  {method === PaymentMethod.MobileMoney && (
  <Button 
  variant="outline" 
  size="sm" 
  className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
  onClick={() => setIsSuccess(false)}
  >
  Try Another Method
  </Button>
  )}
  </div>
  </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-2 gap-3">
 {methods.map((m) => {
 const Icon = m.icon;
 const isActive = method === m.id;
 return (
 <button
 key={m.id}
 type="button"
 onClick={() => setMethod(m.id)}
 className={cn(
 "flex flex-col items-center justify-center p-5 rounded-[10px] border-2 transition-all space-y-3",
 isActive
 ? "border-blue-600 bg-blue-50 "
 : "border-slate-100 bg-white hover:border-slate-200",
 )}
 >
 <div className={cn("p-3 rounded-[10px]", m.bg)}>
 <Icon className={cn("h-7 w-7", m.color)} />
 </div>
 <span className="text-[10px] font-normal text-slate-700 uppercase tracking-widest">
 {m.label}
 </span>
 </button>
 );
 })}
 </div>

 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest block pl-1">
 Payment Amount (RWF)
 </label>
 <input
 type="number"
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 min="1"
 max={remainingBalance}
 required
 className="w-full h-14 px-5 rounded-[4px] border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none text-lg font-normal text-slate-900 transition-all"
 />
 </div>

 <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-100">
 <p className="text-[10px] text-slate-400 mb-2 font-normal uppercase tracking-widest">
 Transaction Mode
 </p>
 <div className="flex items-center justify-between">
 <span className="text-sm font-normal text-slate-700">
 {methods.find((m) => m.id === method)?.label}
 </span>
 <Badge variant="outline" className="text-[10px] font-normal border-slate-200 text-slate-500 bg-white">
 {method === PaymentMethod.MobileMoney
 ? "USSD Push"
 : "Direct"}
 </Badge>
 </div>
 </div>

 <Button
 type="submit"
 className="w-full h-16 rounded-[10px] bg-blue-600 hover:bg-slate-800 text-white font-normal text-lg "
 isLoading={processPayment.isPending}
 disabled={
 parseFloat(amount) <= 0 ||
 parseFloat(amount) > parseFloat(remainingBalance)
 }
 >
 {method === PaymentMethod.MobileMoney
 ? "Initiate Payment"
 : "Confirm Settlement"}
 </Button>

 {processPayment.isError && (
 <p className="text-sm text-red-500 text-center mt-2">
 {(
 processPayment.error as {
 response?: { data?: { message?: string } };
 }
 )?.response?.data?.message ||
 "Payment failed. Please try again."}
 </p>
 )}
 </div>
 </form>
 )}
 </CardContent>
 </Card>
 );
}
