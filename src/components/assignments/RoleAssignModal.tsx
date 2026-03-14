import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { useGetRoles } from "../../hooks/useRoles";
import { useAssignRole } from "../../hooks/useAssignments";

interface RoleAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
}

export default function RoleAssignModal({ isOpen, onClose, userId, onSuccess }: RoleAssignModalProps) {
  const [roleId, setRoleId] = useState<number | "">("");
  const [expiresAt, setExpiresAt] = useState("");
  const { data: rolesData, isLoading } = useGetRoles({ limit: 100 });
  const assignRole = useAssignRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleId === "") return;
    assignRole.mutate(
      {
        userId,
        roleId: Number(roleId),
        expiresAt: expiresAt || undefined,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
          setRoleId("");
          setExpiresAt("");
        },
      }
    );
  };

  const roles = rolesData?.data ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Assign Role</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Role</Label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
              required
              disabled={isLoading}
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (level {r.level})
                </option>
              ))}
            </select>
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
            <Button type="submit" disabled={assignRole.isPending || roleId === ""}>
              {assignRole.isPending ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
