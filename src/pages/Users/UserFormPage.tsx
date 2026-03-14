import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useGetUser, useCreateUser, useUpdateUser } from "../../hooks/useUsers";
import { useGetRoles } from "../../hooks/useRoles";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleIds: number[];
};

export default function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id != null && id !== "new";
  const userId = isEdit ? parseInt(id, 10) : null;

  const { data: user } = useGetUser(userId);
  const { data: rolesRes } = useGetRoles({ limit: 100 });
  const roles = rolesRes?.data ?? [];
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: { firstName: "", lastName: "", email: "", roleIds: [] },
  });

  const selectedRoleIds = watch("roleIds") ?? [];

  useEffect(() => {
    if (isEdit && user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName ?? "");
      setValue("email", user.email);
      const ids = (user.roles ?? []).map((r: { id: number }) => r.id);
      setValue("roleIds", ids);
    }
  }, [isEdit, user, setValue]);

  const toggleRole = (roleId: number) => {
    const current = selectedRoleIds as number[];
    const next = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];
    setValue("roleIds", next);
  };

  const onSubmit = (values: FormValues) => {
    if (isEdit && userId) {
      updateUser.mutate(
        {
          id: userId,
          body: {
            firstName: values.firstName,
            lastName: values.lastName,
            roleIds: values.roleIds ?? [],
          },
        },
        { onSuccess: () => navigate("/users") }
      );
    } else {
      if (!values.password) {
        toast.error("Password is required");
        return;
      }
      createUser.mutate(
        {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName || undefined,
          roleIds: values.roleIds ?? [],
        },
        { onSuccess: () => navigate("/users") }
      );
    }
  };

  return (
    <>
      <PageMeta title={isEdit ? "Edit user" : "New user"} description={isEdit ? "Edit user" : "Create user"} />
      <PageBreadcrumb pageTitle={isEdit ? "Edit user" : "New user"} />
      <ComponentCard title={isEdit ? "Edit user" : "Create user"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-w-md space-y-4">
            <div>
              <Label>First name *</Label>
              <Input {...register("firstName", { required: true, minLength: 2 })} />
              {errors.firstName && <p className="text-sm text-red-500">Required, min 2 characters</p>}
            </div>
            <div>
              <Label>Last name</Label>
              <Input {...register("lastName")} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" {...register("email", { required: true })} disabled={isEdit} />
              {errors.email && <p className="text-sm text-red-500">Required</p>}
            </div>
            {!isEdit && (
              <div>
                <Label>Password *</Label>
                <Input type="password" {...register("password", { minLength: 8 })} />
                {errors.password && <p className="text-sm text-red-500">Min 8 characters</p>}
              </div>
            )}
          </div>

          <div>
            <Label>Roles</Label>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Assign one or more roles to this user. Roles define permissions (manage roles under Roles).
            </p>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-white/10">
              {roles.length === 0 ? (
                <p className="text-sm text-gray-500">No roles defined yet. Create them under Roles first.</p>
              ) : (
                roles.map((r) => (
                  <label key={r.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(selectedRoleIds as number[]).includes(r.id)}
                      onChange={() => toggleRole(r.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    {r.name}
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Link to={isEdit ? `/users/${id}` : "/users"}>
              <Button type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
