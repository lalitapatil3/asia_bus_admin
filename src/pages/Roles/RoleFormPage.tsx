import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useGetRole, useCreateRole, useUpdateRole } from "../../hooks/useRoles";
import { useGetRoles } from "../../hooks/useRoles";
import { useGetPermissions } from "../../hooks/usePermissions";

type FormValues = {
  name: string;
  description: string;
  parentRoleId?: number;
  level: number;
  permissionIds: number[];
};

export default function RoleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id != null && id !== "new";
  const roleId = isEdit ? parseInt(id, 10) : null;

  const { data: role } = useGetRole(roleId);
  const { data: rolesRes } = useGetRoles({ limit: 100 });
  const roles = rolesRes?.data ?? [];
  const { data: permissionsRes } = useGetPermissions({ limit: 500 });
  const permissionsData = permissionsRes?.data;
  const grouped = permissionsData?.grouped ?? ({} as Record<string, { id: number; name: string; resource: string; action: string }[]>);

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: { name: "", description: "", level: 0, permissionIds: [] },
  });

  const selectedPermissionIds = watch("permissionIds") ?? [];

  useEffect(() => {
    if (isEdit && role) {
      setValue("name", role.name);
      setValue("description", role.description ?? "");
      setValue("parentRoleId", role.parentRoleId);
      setValue("level", role.level);
      const ids = (role.permissions ?? []).map((p: { id: number }) => p.id);
      setValue("permissionIds", ids);
    }
  }, [isEdit, role, setValue]);

  const togglePermission = (permId: number) => {
    const current = selectedPermissionIds as number[];
    const next = current.includes(permId)
      ? current.filter((id) => id !== permId)
      : [...current, permId];
    setValue("permissionIds", next);
  };

  const toggleResource = (resourcePerms: { id: number }[]) => {
    const ids = resourcePerms.map((p) => p.id);
    const current = selectedPermissionIds as number[];
    const allSelected = ids.every((permId) => current.includes(permId));
    const next = allSelected
      ? current.filter((pid) => !ids.includes(pid))
      : [...new Set([...current, ...ids])];
    setValue("permissionIds", next);
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      parentRoleId: values.parentRoleId,
      level: values.level,
      permissionIds: values.permissionIds ?? [],
    };
    if (isEdit && roleId) {
      updateRole.mutate(
        {
          id: roleId,
          body: {
            name: payload.name,
            description: payload.description,
            permissionIds: payload.permissionIds,
          },
        },
        { onSuccess: () => navigate("/roles") }
      );
    } else {
      createRole.mutate(payload, { onSuccess: () => navigate("/roles") });
    }
  };

  const resourceKeys = Object.keys(grouped).sort();

  return (
    <>
      <PageMeta title={isEdit ? "Edit role" : "New role"} description={isEdit ? "Edit role details and permissions" : "Create a new role and assign permissions"} />
      <PageBreadcrumb pageTitle={isEdit ? "Edit role" : "New role"} />
      <ComponentCard title={isEdit ? "Edit role" : "New role"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-w-md space-y-4">
            <div>
              <Label>Name *</Label>
              <Input {...register("name", { required: true, minLength: 2 })} />
              {errors.name && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div>
              <Label>Description</Label>
              <Input {...register("description")} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white" />
            </div>
            {!isEdit && (
              <>
                <div>
                  <Label>Parent role</Label>
                  <select
                    {...register("parentRoleId", { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <option value="">— None —</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Level</Label>
                  <input
                    type="number"
                    {...register("level", { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <Label>Permissions</Label>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Select which permissions this role has. Permissions are managed separately under Permissions.
            </p>
            <div className="max-h-80 space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-white/10">
              {resourceKeys.length === 0 ? (
                <p className="text-sm text-gray-500">No permissions defined yet. Create them under Permissions first.</p>
              ) : (
                resourceKeys.map((resource) => {
                  const perms = grouped[resource];
                  if (!perms?.length) return null;
                  const permIds = perms.map((p) => p.id);
                  const allSelected = permIds.every((id) => (selectedPermissionIds as number[]).includes(id));
                  return (
                    <div key={resource} className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-2 font-medium">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => toggleResource(perms)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        {resource}
                      </label>
                      <div className="ml-6 flex flex-wrap gap-x-4 gap-y-1">
                        {perms.map((p) => (
                          <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={(selectedPermissionIds as number[]).includes(p.id)}
                              onChange={() => togglePermission(p.id)}
                              className="h-3.5 w-3.5 rounded border-gray-300"
                            />
                            {p.action}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createRole.isPending || updateRole.isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Link to="/roles">
              <Button type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
