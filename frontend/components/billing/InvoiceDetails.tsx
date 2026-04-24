import { Invoice, InvoiceStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface InvoiceDetailsProps {
  invoice: Invoice;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const getStatusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Paid:
        return "success";
      case InvoiceStatus.PartiallyPaid:
        return "warning";
      case InvoiceStatus.Pending:
        return "info";
      case InvoiceStatus.Cancelled:
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Invoice Details</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            {invoice.transaction_ref}
          </p>
        </div>
        <Badge
          variant={getStatusVariant(invoice.status)}
          className="text-sm px-3 py-1"
        >
          {invoice.status.replace("_", " ").toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.description}
                </TableCell>
                <TableCell className="capitalize">{item.category}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.unit_price)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(item.total_price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full max-w-[250px] text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[250px] text-slate-600 dark:text-slate-400">
              <span>Insurance Coverage:</span>
              <span>-{formatCurrency(invoice.insurance_amount)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[250px] text-xl font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
              <span>Total Due:</span>
              <span>{formatCurrency(invoice.patient_amount)}</span>
            </div>
            {invoice.remaining_balance &&
              parseFloat(invoice.remaining_balance) > 0 && (
                <div className="flex justify-between w-full max-w-[250px] text-lg font-semibold text-blue-600 dark:text-blue-400">
                  <span>Remaining:</span>
                  <span>{formatCurrency(invoice.remaining_balance)}</span>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
