import { Payment, PaymentStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { History, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Confirmed: return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case PaymentStatus.Pending: return <Clock className="h-4 w-4 text-amber-500" />;
      case PaymentStatus.Failed: return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-10 text-slate-400">
          <History className="h-10 w-10 mb-2 opacity-20" />
          <p>No payment history found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20">
        <CardTitle className="text-lg flex items-center">
          <History className="h-5 w-5 mr-2 text-slate-500" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="text-xs whitespace-nowrap">{formatDate(payment.created_at)}</TableCell>
                <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                <TableCell className="text-xs font-mono text-slate-500">{payment.transaction_ref || '-'}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(payment.amount)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {getStatusIcon(payment.status)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
