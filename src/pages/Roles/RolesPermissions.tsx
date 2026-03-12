
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RolesList from "./RolesList";
import PermissionsMatrix from "./PermissionsMatrix";

export default function RolesPermissions() {
  return (
    <>
      <PageMeta
        title="Roles & Permissions | Asia Bus Admin Panel"
        description="Manage system roles and assign permissions"
      />
      <PageBreadcrumb pageTitle="Roles & Permissions" />

      <div className="space-y-6">
        <RolesList />
        <PermissionsMatrix />
      </div>
    </>
  );
}
