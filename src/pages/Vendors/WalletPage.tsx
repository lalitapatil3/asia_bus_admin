import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { WalletService, Transaction } from "../../services/WalletService";
import Button from "../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<boolean>(false);
  const [amountToAdd, setAmountToAdd] = useState<string>("");

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      const balanceRes = await WalletService.getBalance();
      const transactionsRes = await WalletService.getTransactions();
      setBalance(balanceRes.balance || 0);
      setTransactions(transactionsRes || []);
    } catch (error) {
      console.error("Error fetching wallet details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      // 1. Create Razorpay order via backend
      const order = await WalletService.addMoney(amount);

      // 2. Initialize Razorpay popup
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AsiaBus",
        description: "Add Money to Wallet",
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            await WalletService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment Successful!");
            setIsAddMoneyOpen(false);
            setAmountToAdd("");
            fetchWalletDetails(); // Refresh wallet
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
            alert("Payment Verification Failed. Contact Support.");
          }
        },
        theme: {
          color: "#2563EB", // Primary branding color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating add money order", error);
      alert("Something went wrong while initiating the payment.");
    }
  };

  return (
    <>
      <PageMeta
        title="My Wallet"
        description="View your wallet balance, add money, and track transactions."
      />
      <PageBreadcrumb pageTitle="My Wallet" />

      <div className="space-y-6">
        {/* Balance Card */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div>
            <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">
              Available Balance
            </h3>
            <div className="mt-2 text-4xl font-bold text-slate-800 dark:text-white">
              ₹{balance.toFixed(2)}
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              size="md"
              variant="primary"
              onClick={() => setIsAddMoneyOpen(true)}
            >
              Add Money
            </Button>
          </div>
        </div>

        {/* Add Money Modal / Input logic - Simplified inline for now */}
        {isAddMoneyOpen && (
          <div className="p-6 bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl relative">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Add Money to Wallet
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="number"
                placeholder="Enter amount in INR"
                className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddMoney} variant="primary">
                  Proceed to Pay
                </Button>
                <Button
                  onClick={() => setIsAddMoneyOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Transaction History
          </h4>

          {loading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Transaction ID</TableCell>
                    <TableCell isHeader>Date & Time</TableCell>
                    <TableCell isHeader>Type</TableCell>
                    <TableCell isHeader>Amount</TableCell>
                    <TableCell isHeader>Balance After</TableCell>
                    <TableCell isHeader>Status</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                          {txn.razorpayOrderId || txn.transactionType}
                        </TableCell>
                        <TableCell>
                          {new Date(txn.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            color={txn.type === "CREDIT" ? "success" : "error"}
                          >
                            {txn.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{parseFloat(txn.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ₹{parseFloat(txn.balance).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            color={
                              txn.status === "captured"
                                ? "success"
                                : txn.status === "pending"
                                ? "warning"
                                : "error"
                            }
                          >
                            {txn.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WalletPage;
