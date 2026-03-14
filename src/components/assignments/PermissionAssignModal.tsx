import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { useGetPermissions } from "../../hooks/usePermissions";
import { useGrantPermission } from "../../hooks/useAssignments";

interface PermissionAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
}

export default function PermissionAssignModal({ isOpen, onClose, userId, onSuccess }: PermissionAssignModalProps) {
  const [permissionId, setPermissionId] = useState<number | "">("");
  const [type, setType] = useState<"grant" | "revoke">("grant");
  const [conditions, setConditions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const { data: permsData, isLoading } = useGetPermissions({ limit: 200 });
  const grantPermission = useGrantPermission();

  const flat = permsData?.data?.flat ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (permissionId === "") return;
    let cond: object | undefined;
    try {
      cond = conditions.trim() ? JSON.parse(conditions) : undefined;
    } catch {
      return;
    }
    grantPermission.mutate(
      {
        userId,
        permissionId: Number(permissionId),
        type,
        conditions: cond,
        expiresAt: expiresAt || undefined,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
          setPermissionId("");
          setConditions("");
          setExpiresAt("");
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {type === "grant" ? "Grant" : "Revoke"} Permission
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "grant" | "revoke")}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="grant">Grant</option>
              <option value="revoke">Revoke</option>
            </select>
          </div>
          <div>
            <Label>Permission</Label>
            <select
              value={permissionId}
              onChange={(e) => setPermissionId(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
              required
              disabled={isLoading}
            >
              <option value="">Select permission</option>
              {flat.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.resource}:{p.action})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Conditions (JSON, optional)</Label>
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 font-mono text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder='{"key": "value"}'
            />
          </div>
          <div>
            <Label>Expires at (optional)</Label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={grantPermission.isPending || permissionId === ""}>
              {grantPermission.isPending ? "Saving..." : type === "grant" ? "Grant" : "Revoke"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
