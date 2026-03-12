import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import UserFormModal from "./UserFormModal";

// Mock User Data based on the User model
const mockUsers = [
  { id: 1, firstName: "Admin", lastName: "User", email: "admin@asiabus.com", isActive: true, roles: ["Superadmin"] },
  { id: 2, firstName: "Manager", lastName: "One", email: "manager@asiabus.com", isActive: true, roles: ["Manager"] },
  { id: 3, firstName: "Inactive", lastName: "User", email: "inactive@asiabus.com", isActive: false, roles: ["Staff"] },
];

export default function UsersList() {
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleOpenModal = (user?: any) => {
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (savedUser: any) => {
    if (selectedUser) {
      setUsers(users.map(u => (u.id === savedUser.id ? savedUser : u)));
    } else {
      setUsers([...users, savedUser]);
    }
  };

  return (
    <>
      <PageMeta
        title="User Management | Asia Bus Admin Panel"
        description="Manage users and their roles"
      />
      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <ComponentCard title="All Users">
          <div className="mb-4 flex justify-end px-4">
            <Button size="sm" onClick={() => handleOpenModal()}>
              Add User
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Name
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Email
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Roles
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Status
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.firstName} {user.lastName}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex gap-2 flex-wrap max-w-[200px]">
                            {user.roles.map((role: string) => (
                                <Badge key={role} size="sm" color="info">
                                    {role}
                                </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge size="sm" color={user.isActive ? "success" : "error"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button className="text-blue-500 hover:text-blue-700 mr-3" onClick={() => handleOpenModal(user)}>Edit</button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => setUsers(users.filter(u => u.id !== user.id))}>Delete</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>

      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser}
        onSave={handleSaveUser} 
      />
    </>
  );
}
