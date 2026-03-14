import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useCreateVendor } from "../../hooks/useVendors";

type FormValues = {
  email: string;
  password: string;
  fullName: string;
  mobileNo: string;
  companyName: string;
  city: string;
  aadharNo: string;
  panNo: string;
  isMsme: boolean;
  isCorporate: boolean;
  termsAccepted: boolean;
  allowWhatsapp: boolean;
};

export default function VendorFormPage() {
  const navigate = useNavigate();
  const createVendor = useCreateVendor();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      mobileNo: "",
      companyName: "",
      city: "",
      aadharNo: "",
      panNo: "",
      isMsme: false,
      isCorporate: false,
      termsAccepted: true,
      allowWhatsapp: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!values.password || values.password.length < 8) {
      toast.error("Password must be at least 8 characters with a digit, uppercase and special character");
      return;
    }
    if (!values.termsAccepted) {
      toast.error("Terms must be accepted");
      return;
    }
    createVendor.mutate(
      {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        mobileNo: values.mobileNo,
        companyName: values.companyName,
        city: values.city,
        aadharNo: values.aadharNo,
        panNo: values.panNo,
        isMsme: values.isMsme,
        isCorporate: values.isCorporate,
        termsAccepted: values.termsAccepted,
        allowWhatsapp: values.allowWhatsapp,
      },
      { onSuccess: () => navigate("/vendors") }
    );
  };

  return (
    <>
      <PageMeta title="Add Vendor | Admin" description="Register a new vendor" />
      <PageBreadcrumb pageTitle="Add Vendor" />
      <ComponentCard title="Add Vendor">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div>
              <Label>Password * (min 8 chars, 1 digit, 1 uppercase, 1 special)</Label>
              <Input type="password" {...register("password", { required: true, minLength: 8 })} />
              {errors.password && (
                <p className="text-sm text-red-500">Required, min 8 characters</p>
              )}
            </div>
            <div>
              <Label>Full name *</Label>
              <Input {...register("fullName", { required: true, minLength: 2 })} />
              {errors.fullName && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div>
              <Label>Mobile No *</Label>
              <Input {...register("mobileNo", { required: true, minLength: 10 })} />
              {errors.mobileNo && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div>
              <Label>Company name *</Label>
              <Input {...register("companyName", { required: true, minLength: 2 })} />
              {errors.companyName && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div>
              <Label>City *</Label>
              <Input {...register("city", { required: true })} />
              {errors.city && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div>
              <Label>Aadhar No *</Label>
              <Input {...register("aadharNo", { required: true })} />
              {errors.aadharNo && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
            <div>
              <Label>PAN No *</Label>
              <Input {...register("panNo", { required: true })} />
              {errors.panNo && (
                <p className="text-sm text-red-500">Required</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" {...register("isMsme")} className="h-4 w-4 rounded" />
              <span>MSME</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" {...register("isCorporate")} className="h-4 w-4 rounded" />
              <span>Corporate entity</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" {...register("termsAccepted")} className="h-4 w-4 rounded" />
              <span>Terms & Conditions accepted</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" {...register("allowWhatsapp")} className="h-4 w-4 rounded" />
              <span>Allow WhatsApp for communication</span>
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createVendor.isPending}>
              Create Vendor
            </Button>
            <Link to="/vendors">
              <Button type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
