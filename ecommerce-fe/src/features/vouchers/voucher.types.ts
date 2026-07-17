export type VoucherDiscountType = "percentage" | "fixed";

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discountType: VoucherDiscountType;
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SaveVoucherPayload = {
  id?: number;
  code: string;
  name: string;
  description?: string | null;
  discountType: VoucherDiscountType;
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
};
