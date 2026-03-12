import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Checkbox from "../../components/form/input/Checkbox";

const mockRoles = ["Superadmin", "Manager", "Staff"];
const mockPermissions = [
  "Create Bus", "Read Bus", "Update Bus", "Delete Bus",
  "Create Route", "Read Route", "Update Route", "Delete Route",
  "Manage Users"
];

// Mock basic matrix { "Superadmin": ["Create Bus", ...], "Manager": ["Read Bus", "Read Route"] }
const initialMatrix: Record<string, string[]> = {
  "Superadmin": mockPermissions, // superadmin has all
  "Manager": ["Read Bus", "Read Route", "Update Bus", "Update Route"],
  "Staff": ["Read Bus", "Read Route"]
};

export default function PermissionsMatrix() {
  const [matrix, setMatrix] = useState(initialMatrix);

  const togglePermission = (role: string, permission: string) => {
    setMatrix(prev => {
      const rolePerms = prev[role] || [];
      const newPerms = rolePerms.includes(permission)
        ? rolePerms.filter(p => p !== permission)
        : [...rolePerms, permission];
      return { ...prev, [role]: newPerms };
    });
  };

  return (
    <ComponentCard title="Permissions Matrix">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-800 text-start text-theme-xs dark:text-gray-200">
                  Permissions
                </TableCell>
                {mockRoles.map(role => (
                  <TableCell key={role} isHeader className="px-5 py-3 font-semibold text-gray-800 text-center text-theme-xs dark:text-gray-200">
                    {role}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {mockPermissions.map((permission) => (
                <TableRow key={permission}>
                  <TableCell className="px-5 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300 font-medium">
                    {permission}
                  </TableCell>
                  {mockRoles.map(role => (
                    <TableCell key={`${role}-${permission}`} className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={(matrix[role] || []).includes(permission)}
                          onChange={() => togglePermission(role, permission)}
                          id={`${role}-${permission}`}
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ComponentCard>
  );
}
