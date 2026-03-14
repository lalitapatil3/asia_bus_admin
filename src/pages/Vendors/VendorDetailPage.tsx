import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetVendor, useApproveVendor, useRejectVendor } from "../../hooks/useVendors";
import { statusColors } from "./VendorsListPage";

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vendorId = id ? parseInt(id, 10) : null;
  const { data: vendor, isLoading } = useGetVendor(vendorId);
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();

  if (!vendorId || (vendor === undefined && !isLoading)) {
    return <div className="p-4">Vendor not found</div>;
  }

  const handleApprove = () => {
    if (window.confirm(`Approve vendor "${vendor?.fullName}"?`)) {
      approveVendor.mutate(vendorId);
    }
  };

  const handleReject = () => {
    if (window.confirm(`Reject vendor "${vendor?.fullName}"?`)) {
      rejectVendor.mutate(vendorId);
    }
  };

  return (
    <>
      <PageMeta
        title={vendor ? `${vendor.fullName} | Vendors` : "Vendor | Admin"}
        description="Vendor details"
      />
      <PageBreadcrumb pageTitle={vendor ? vendor.fullName : "Vendor"} />
      <div className="space-y-6">
        <ComponentCard title="Vendor details">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : vendor ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge size="sm" color={statusColors[vendor.status]}>
                  {vendor.status}
                </Badge>
                <PermissionGate resource="vendors" action="update">
                  {vendor.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="success"
                        onClick={handleApprove}
                        disabled={approveVendor.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        color="error"
                        onClick={handleReject}
                        disabled={rejectVendor.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </PermissionGate>
              </div>
              <dl className="grid gap-2 text-theme-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                  <dd>{vendor.fullName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd>{vendor.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Mobile</dt>
                  <dd>{vendor.mobileNo}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Company</dt>
                  <dd>{vendor.companyName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">City</dt>
                  <dd>{vendor.city}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Aadhar No</dt>
                  <dd>{vendor.aadharNo}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">PAN No</dt>
                  <dd>{vendor.panNo}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">MSME</dt>
                  <dd>{vendor.isMsme ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Corporate entity</dt>
                  <dd>{vendor.isCorporate ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Allow WhatsApp</dt>
                  <dd>{vendor.allowWhatsapp ? "Yes" : "No"}</dd>
                </div>
              </dl>
              <div className="pt-2">
                <Button size="sm" asChild>
                  <Link to="/vendors">Back to list</Link>
                </Button>
              </div>
            </div>
          ) : null}
        </ComponentCard>
      </div>
    </>
  );
}
