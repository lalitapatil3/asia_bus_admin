import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import RoleFormModal from "./RoleFormModal";

const mockRoles = [
  { id: 1, name: "Superadmin", description: "Full access to everything", level: 0, isActive: true },
  { id: 2, name: "Manager", description: "Can manage buses and routes", level: 1, isActive: true },
  { id: 3, name: "Staff", description: "Limited read-only access", level: 2, isActive: true },
];

export default function RolesList() {
  const [roles, setRoles] = useState(mockRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleOpenModal = (role?: any) => {
    setSelectedRole(role || null);
    setIsModalOpen(true);
  };

  const handleSaveRole = (savedRole: any) => {
    if (selectedRole) {
      setRoles(roles.map(r => (r.id === savedRole.id ? savedRole : r)));
    } else {
      setRoles([...roles, savedRole]);
    }
  };

  return (
    <>
      <ComponentCard title="All Roles">
        <div className="mb-4 flex justify-end px-4">
          <Button size="sm" onClick={() => handleOpenModal()}>
            Add Role
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Level</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {role.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {role.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {role.level}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={role.isActive ? "success" : "error"}>
                        {role.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button className="text-blue-500 hover:text-blue-700 mr-3" onClick={() => handleOpenModal(role)}>Edit</button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => setRoles(roles.filter(r => r.id !== role.id))}>Delete</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>
      
      <RoleFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        role={selectedRole}
        onSave={handleSaveRole}
      />
    </>
  );
}
