import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useMyVendorApiKeys, useCreateMyVendorApiKey } from "../../hooks/useVendors";

export default function MyVendorApiKeyPage() {
  const { data: keys, isLoading } = useMyVendorApiKeys();
  const [plainKey, setPlainKey] = useState<string | null>(null);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const createKey = useCreateMyVendorApiKey({
    onSuccess: (data) => {
      setPlainKey(data.apiKey);
      setIsKeyVisible(false);
    },
  });

  const hasActive = keys?.some((k) => k.status === "active") ?? false;
  const latestKey = keys && keys.length > 0 ? keys[keys.length - 1] : null;

  const handleGenerate = () => {
    if (
      hasActive &&
      !window.confirm(
        "You already have an active API key. Regenerating will immediately revoke the old key. Continue?"
      )
    ) {
      return;
    }
    createKey.mutate();
  };

  const handleCopy = async () => {
    if (!plainKey) return;
    try {
      await navigator.clipboard.writeText(plainKey);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <>
      <PageMeta title="My API key | Vendors" description="Manage your vendor API key" />
      <PageBreadcrumb pageTitle="My API key" />
      <div className="space-y-6">
        <ComponentCard title="Vendor API key">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Use this API key to authenticate your server-to-server calls to the 3rd party bus APIs.
            Only one active key is allowed per vendor. Regenerating a key will revoke the previous
            one immediately.
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                Current keys
              </span>
              {isLoading ? (
                <p className="mt-1 text-sm text-gray-500">Loading...</p>
              ) : latestKey ? (
                <div className="mt-2 space-y-1 rounded-lg border border-gray-200 p-3 text-sm dark:border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {latestKey.name ?? "Default key"}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        latestKey.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                      }`}
                    >
                      {latestKey.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Masked key: <span className="font-mono">{latestKey.maskedKey}</span>
                  </div>
                  {latestKey.lastUsedAt && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Last used: {new Date(latestKey.lastUsedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  No API key yet. Generate one to start using the APIs.
                </p>
              )}
            </div>

            {plainKey && (
              <div>
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Your new API key
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <input
                    type={isKeyVisible ? "text" : "password"}
                    readOnly
                    value={plainKey}
                    className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsKeyVisible((v) => !v)}
                  >
                    {isKeyVisible ? "Hide" : "Show"}
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
                    Copy
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Store this key securely. You won&apos;t be able to see the full value again after
                  leaving this page.
                </p>
              </div>
            )}

            <div>
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={createKey.isPending}
              >
                {hasActive ? "Regenerate API key" : "Generate API key"}
              </Button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

