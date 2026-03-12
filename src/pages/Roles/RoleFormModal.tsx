import React, { useState } from "react";
import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: any;
  onSave: (role: any) => void;
}

export default function RoleFormModal({ isOpen, onClose, role, onSave }: RoleFormModalProps) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [level, setLevel] = useState(role?.level || 0);
  const [isActive, setIsActive] = useState(role?.isActive ?? true);

  React.useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setLevel(role.level);
      setIsActive(role.isActive);
    } else {
      setName("");
      setDescription("");
      setLevel(0);
      setIsActive(true);
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: role?.id || Date.now(),
      name,
      description,
      level,
      isActive,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="p-6">
        <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90">
          {role ? "Edit Role" : "Add New Role"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Role Name</label>
            <InputField
              type="text"
              placeholder="e.g. Superadmin, Editor"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
            <TextArea
              placeholder="Describe the role responsibilities"
              value={description}
              onChange={(val) => setDescription(val)}
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Role Level</label>
            <InputField
              type="number"
              placeholder="e.g. 0 for highest, 1, 2..."
              value={level}
              onChange={(e: any) => setLevel(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Checkbox
              id="roleIsActive"
              label="Role is Active"
              checked={isActive}
              onChange={(checked) => setIsActive(checked)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Role
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
