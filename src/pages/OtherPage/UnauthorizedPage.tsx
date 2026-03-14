import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">403 Forbidden</h1>
      <p className="text-gray-500 dark:text-gray-400">You do not have permission to view this page.</p>
      <Link to="/dashboard" className="text-brand-500 hover:underline">Back to dashboard</Link>
    </div>
  );
}
