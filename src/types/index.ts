export type BoothStatus = 'open' | 'booked' | 'reserved' | 'past_due' | 'maintenance';
export type PaymentStatus = 'paid' | 'due_soon' | 'past_due' | 'not_applicable';
export type BoothType = 'standard' | 'corner' | 'front' | 'food' | 'outdoor' | 'small';

export interface Booth {
  id: string;
  number: string;
  section: string;
  vendorId: string | null;
  vendorName: string | null;
  vendorPhone: string | null;
  vendorEmail: string | null;
  businessName: string | null;
  boothSize: string;
  boothType: BoothType;
  monthlyRent: number;
  status: BoothStatus;
  paymentStatus: PaymentStatus;
  moveInDate: string | null;
  leaseEndDate: string | null;
  notes: string;
  row: number;
  col: number;
  span?: number;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  boothId: string | null;
  boothNumber: string | null;
  monthlyRent: number;
  paymentStatus: PaymentStatus;
  productCategory: string;
  products: string;
  notes: string;
  joinDate: string;
}

export interface Payment {
  id: string;
  vendorId: string;
  vendorName: string;
  boothNumber: string;
  businessName: string;
  monthlyRent: number;
  dueDate: string;
  paidDate: string | null;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountOwed: number;
  method: string;
  history: PaymentHistory[];
}

export interface PaymentHistory {
  date: string;
  amount: number;
  method: string;
  status: 'paid' | 'late' | 'missed';
}

export interface Reservation {
  id: string;
  boothId: string;
  boothNumber: string;
  section: string;
  futureVendorName: string;
  futureBusinessName: string;
  futureVendorPhone: string;
  futureVendorEmail: string;
  reservationDate: string;
  moveInDate: string;
  depositAmount: number;
  depositPaid: boolean;
  monthlyRent: number;
  notes: string;
  leaseRenewal: boolean;
  existingVendorId?: string;
}
