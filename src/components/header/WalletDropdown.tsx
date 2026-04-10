import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { WalletService } from "../../services/WalletService";
import { Link } from "react-router";
import { useAuthStore } from "../../store/authStore";

export default function WalletDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isOpen) {
      fetchWalletDetails();
    }
  }, [isOpen]);

  const fetchWalletDetails = async () => {
    try {
      const balanceRes = await WalletService.getBalance();
      setBalance(balanceRes.balance || 0);
    } catch (error) {
      console.error("Error fetching wallet balance", error);
    }
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-gray-100 border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-200 dark:border-gray-800 dark:bg-dark-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <span className="flex items-center justify-center font-bold text-lg text-theme-sm text-green-600 dark:text-green-500">
          ₹
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex w-[320px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:right-0"
      >
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 mb-4">
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-300">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
              A/C NO: {user?.id || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Wallet Balance
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Rs. {balance.toFixed(2)}
            </span>
          </div>

          <div className="px-2">
            <span className="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
              Earnings Last 30 Days:
            </span>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Through Commission:</span>
              <span className="text-xs text-gray-800 dark:text-gray-200">-</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-600 dark:text-gray-400">Through Booking Fee:</span>
              <span className="text-xs text-gray-800 dark:text-gray-200">0</span>
            </div>
          </div>

          <div className="px-2">
            <Link
              to="/profile"
              onClick={closeDropdown}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Seatseller Bank Details
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/vendors/wallet"
            onClick={closeDropdown}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
          >
            MAKE DEPOSIT
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
