import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useGetCity, useCreateCity, useUpdateCity } from "../../hooks/useCities";
import { useGetStates } from "../../hooks/useStates";

type FormValues = {
  name: string;
  stateId: number;
  seatSellerCityId: string;
  latitude: string;
  longitude: string;
};

export default function CityFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id != null && id !== "new";
  const cityId = isEdit ? parseInt(id, 10) : null;

  const { data: cityData } = useGetCity(cityId);
  const { data: states = [] } = useGetStates();
  const createCity = useCreateCity();
  const updateCity = useUpdateCity();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    defaultValues: { name: "", stateId: 0, seatSellerCityId: "", latitude: "", longitude: "" },
  });

  useEffect(() => {
    if (isEdit && cityData) {
      setValue("name", cityData.name);
      setValue("stateId", cityData.stateId);
      setValue("seatSellerCityId", cityData.seatSellerCityId);
      setValue("latitude", cityData.latitude ?? "");
      setValue("longitude", cityData.longitude ?? "");
    }
  }, [isEdit, cityData, setValue]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      stateId: values.stateId,
      seatSellerCityId: values.seatSellerCityId,
      latitude: values.latitude,
      longitude: values.longitude,
    };
    if (isEdit && cityId) {
      updateCity.mutate(
        { id: cityId, payload },
        { onSuccess: () => navigate("/cities") }
      );
    } else {
      createCity.mutate(payload, { onSuccess: () => navigate("/cities") });
    }
  };

  return (
    <>
      <PageMeta title={isEdit ? "Edit City" : "New City"} description={isEdit ? "Edit city details" : "Create a new city"} />
      <PageBreadcrumb pageTitle={isEdit ? "Edit City" : "New City"} />
      <ComponentCard title={isEdit ? "Edit City" : "New City"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-w-md space-y-4">
            <div>
              <Label>City Name *</Label>
              <Input {...register("name", { required: true, minLength: 2 })} />
              {errors.name && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div>
              <Label>State *</Label>
              <select
                {...register("stateId", { required: true, valueAsNumber: true, min: 1 })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value={0}>— Select State —</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.stateId && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div>
              <Label>Seat Seller City ID *</Label>
              <Input {...register("seatSellerCityId", { required: true })} />
              {errors.seatSellerCityId && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div>
              <Label>Latitude</Label>
              <Input {...register("latitude")} />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input {...register("longitude")} />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={createCity.isPending || updateCity.isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Link to="/cities">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
