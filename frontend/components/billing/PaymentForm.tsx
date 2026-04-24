import { useState } from 'react';
import { PaymentMethod } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProcessPayment } from '@/hooks/useBilling';
import { CreditCard, Banknote, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentFormProps {
  invoiceId: string;
  remainingBalance: string;
}

export function PaymentForm({ invoiceId, remainingBalance }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [amount, setAmount] = useState<string>(remainingBalance);
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
      }
    } catch {
      // Error handled by mutation
    }
  };

  const methods = [
    { id: PaymentMethod.Cash, label: 'Cash', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: PaymentMethod.MobileMoney, label: 'Mobile Money', icon: Smartphone, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: PaymentMethod.BankTransfer, label: 'Bank Transfer', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: PaymentMethod.Insurance, label: 'Insurance', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <Card className="border-none shadow-lg h-full">
      <CardHeader>
        <CardTitle>Process Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in zoom-in-95 duration-300">
             <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
             </div>
             <div>
               <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Payment Confirmed</h4>
               <p className="text-slate-500">The transaction has been processed successfully.</p>
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
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all space-y-2",
                      isActive 
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20" 
                        : "border-slate-100 bg-white hover:border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg", m.bg)}>
                      <Icon className={cn("h-6 w-6", m.color)} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <Input
                label="Payment Amount (RWF)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max={remainingBalance}
                required
              />
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Payment Method Summary</p>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-semibold">{methods.find(m => m.id === method)?.label}</span>
                   <span className="text-xs text-slate-400">
                     {method === PaymentMethod.MobileMoney ? 'Will initiate USSD push' : 'Immediate confirmation'}
                   </span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full text-lg h-12" 
                isLoading={processPayment.isPending}
                disabled={parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(remainingBalance)}
              >
                {method === PaymentMethod.MobileMoney ? 'Initiate Payment' : 'Confirm Payment'}
              </Button>
              
              {processPayment.isError && (
                <p className="text-sm text-red-500 text-center mt-2">
                  {(processPayment.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Payment failed. Please try again.'}
                </p>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
