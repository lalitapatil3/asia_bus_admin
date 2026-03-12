import React, { useState } from "react";
import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any; // Will be properly typed when API is ready
  onSave: (user: any) => void;
}

const availableRoles = ["Superadmin", "Admin", "Manager", "Staff"];

export default function UserFormModal({ isOpen, onClose, user, onSave }: UserFormModalProps) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user?.roles || []);

  // Update state when user prop changes
  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setIsActive(user.isActive);
      setSelectedRoles(user.roles || []);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setIsActive(true);
      setSelectedRoles([]);
    }
  }, [user]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: user?.id || Date.now(),
      firstName,
      lastName,
      email,
      isActive,
      roles: selectedRoles,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="p-6">
        <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90">
          {user ? "Edit User" : "Add New User"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">First Name</label>
              <InputField
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name</label>
              <InputField
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email Address</label>
            <InputField
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assign Roles
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {availableRoles.map(role => (
                <Checkbox
                  key={role}
                  id={`role-${role}`}
                  label={role}
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Checkbox
              id="isActive"
              label="User is Active"
              checked={isActive}
              onChange={(checked) => setIsActive(checked)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save User
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
