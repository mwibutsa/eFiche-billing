export enum InvoiceStatus {
  Pending = 'pending',
  Paid = 'paid',
  PartiallyPaid = 'partially_paid',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  Cash = 'cash',
  MobileMoney = 'mobile_money',
  BankTransfer = 'bank_transfer',
  Insurance = 'insurance',
}

export enum PaymentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Failed = 'failed',
  Refunded = 'refunded',
}

export enum VisitStatus {
  Open = 'open',
  Billed = 'billed',
  Discharged = 'discharged',
}

export enum InvoiceItemCategory {
  Consultation = 'consultation',
  Medication = 'medication',
  LabTest = 'lab_test',
  Procedure = 'procedure',
  Accommodation = 'accommodation',
  Other = 'other',
}

export interface Insurance {
  id: string;
  name: string;
  code: string;
  pivot?: {
    coverage_percentage: number;
    is_active: boolean;
  };
}

export interface Patient {
  id: string;
  name: string;
  national_id: string;
  insurance_id?: string;
  insurance_number?: string;
  insurance?: Insurance;
}

export interface Visit {
  id: string;
  patient_id: string;
  facility_id: string;
  visited_at: string;
  status: VisitStatus;
  patient: Patient;
  invoice?: Invoice;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  category: InvoiceItemCategory;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  cashier_id: number;
  transaction_ref?: string;
  metadata?: any;
  confirmed_at?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  visit_id: string;
  transaction_ref: string;
  total_amount: string;
  insurance_amount: string;
  patient_amount: string;
  status: InvoiceStatus;
  items?: InvoiceItem[];
  payments?: Payment[];
  remaining_balance?: string;
  is_fully_paid?: boolean;
}
