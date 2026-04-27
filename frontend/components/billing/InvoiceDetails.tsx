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
import { formatCurrency, cn } from "@/lib/utils";

interface InvoiceDetailsProps {
  invoice: Invoice;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  return (
    <Card className="overflow-hidden border-none rounded-[10px] bg-white">
      <CardHeader className="bg-slate-100 p-8 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-normal text-slate-900">
            Invoice Summary
          </CardTitle>
          <p className="text-[10px] font-normal text-slate-600 uppercase tracking-[0.2em] mt-1">
            REF: {invoice.transaction_ref}
          </p>
        </div>
        <Badge
          className={cn(
            "text-xs font-normal px-4 py-1.5 rounded-[10px] uppercase tracking-widest",
            invoice.status === InvoiceStatus.Paid
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700",
          )}
        >
          {invoice.status.replace("_", " ")}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="font-normal text-[10px] uppercase tracking-widest text-slate-600 h-14 pl-8">
                Service Description
              </TableHead>
              <TableHead className="font-normal text-[10px] uppercase tracking-widest text-slate-600 h-14">
                Category
              </TableHead>
              <TableHead className="text-right font-normal text-[10px] uppercase tracking-widest text-slate-600 h-14">
                Qty
              </TableHead>
              <TableHead className="text-right font-normal text-[10px] uppercase tracking-widest text-slate-600 h-14">
                Unit Price
              </TableHead>
              <TableHead className="text-right font-normal text-[10px] uppercase tracking-widest text-slate-600 h-14 pr-8">
                Subtotal
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items?.map((item) => (
              <TableRow
                key={item.id}
                className="border-slate-100 hover:bg-slate-50/30 transition-colors"
              >
                <TableCell className="font-normal text-slate-700 pl-8 py-5">
                  {item.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal uppercase tracking-tighter border-slate-200 text-slate-500"
                  >
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-normal text-slate-600">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right font-normal text-slate-600">
                  {formatCurrency(item.unit_price)}
                </TableCell>
                <TableCell className="text-right font-normal text-slate-900 pr-8">
                  {formatCurrency(item.total_price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-10 bg-slate-50/30 border-t border-slate-100">
          <div className="flex flex-col items-end space-y-4">
            <div className="flex justify-between w-full max-w-[320px] text-slate-500 font-normal text-sm">
              <span className="uppercase tracking-widest text-[10px]">
                Total Billed:
              </span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[320px] text-blue-600 font-normal text-sm">
              <span className="uppercase tracking-widest text-[10px]">
                Insurance Coverage:
              </span>
              <span>-{formatCurrency(invoice.insurance_amount)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[320px] pt-6 border-t border-slate-200">
              <span className="text-xs font-normal uppercase tracking-[0.2em] text-slate-600">
                Total Patient Due
              </span>
              <span className="text-3xl font-normal text-slate-900">
                {formatCurrency(invoice.patient_amount)}
              </span>
            </div>
            {invoice.remaining_balance &&
              parseFloat(invoice.remaining_balance) > 0 && (
                <div className="flex justify-between w-full max-w-[320px] p-4 bg-blue-50 rounded-[10px] border border-blue-100 mt-4">
                  <span className="text-[10px] font-normal uppercase tracking-widest text-blue-600">
                    Remaining Balance
                  </span>
                  <span className="text-lg font-normal text-blue-700">
                    {formatCurrency(invoice.remaining_balance)}
                  </span>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
