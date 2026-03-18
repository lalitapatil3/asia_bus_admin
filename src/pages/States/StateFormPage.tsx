import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useGetState, useCreateState, useUpdateState } from "../../hooks/useStates";

type FormValues = {
  name: string;
  seatSellerStateId: string;
};

export default function StateFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id != null && id !== "new";
  const stateId = isEdit ? parseInt(id, 10) : null;

  const { data: stateData } = useGetState(stateId);
  const createState = useCreateState();
  const updateState = useUpdateState();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    defaultValues: { name: "", seatSellerStateId: "" },
  });

  useEffect(() => {
    if (isEdit && stateData) {
      setValue("name", stateData.name);
      setValue("seatSellerStateId", stateData.seatSellerStateId);
    }
  }, [isEdit, stateData, setValue]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      seatSellerStateId: values.seatSellerStateId,
    };
    if (isEdit && stateId) {
      updateState.mutate(
        { id: stateId, payload },
        { onSuccess: () => navigate("/states") }
      );
    } else {
      createState.mutate(payload, { onSuccess: () => navigate("/states") });
    }
  };

  return (
    <>
      <PageMeta title={isEdit ? "Edit State" : "New State"} description={isEdit ? "Edit state details" : "Create a new state"} />
      <PageBreadcrumb pageTitle={isEdit ? "Edit State" : "New State"} />
      <ComponentCard title={isEdit ? "Edit State" : "New State"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-w-md space-y-4">
            <div>
              <Label>State Name *</Label>
              <Input {...register("name", { required: true, minLength: 2 })} />
              {errors.name && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div>
              <Label>Seat Seller State ID *</Label>
              <Input {...register("seatSellerStateId", { required: true })} />
              {errors.seatSellerStateId && <p className="text-sm text-red-500">Required</p>}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={createState.isPending || updateState.isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Link to="/states">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
