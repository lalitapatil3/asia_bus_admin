import { api } from "../api/axios";

export interface Transaction {
  id: number;
  vendorId: number;
  amount: string;
  balance: string;
  type: "CREDIT" | "DEBIT";
  transactionType: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  status: "pending" | "captured" | "failed";
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface WalletBalanceResponse {
  balance: number;
  currency: string;
}

export interface AddMoneyResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const WalletService = {
  /**
   * Fetch current wallet balance
   */
  async getBalance(): Promise<WalletBalanceResponse> {
    const response = await api.get("/wallets/balance");
    return response.data.data;
  },

  /**
   * Fetch wallet transaction history
   */
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get("/wallets/transactions");
    return response.data.data;
  },

  /**
   * Add money to wallet, returning Razorpay order details
   */
  async addMoney(amount: number): Promise<AddMoneyResponse> {
    const response = await api.post("/wallets/add-money", { amount });
    return response.data.data;
  },

  /**
   * Verify Razorpay payment
   */
  async verifyPayment(paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<WalletBalanceResponse> {
    const response = await api.post("/wallets/verify-payment", paymentDetails);
    return response.data.data;
  },
};
