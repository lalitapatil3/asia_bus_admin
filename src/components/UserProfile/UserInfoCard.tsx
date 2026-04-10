import { useAuthStore } from "../../store/authStore";

export default function UserInfoCard() {
  const { user } = useAuthStore();
  const isVendor = user?.roles?.some((r) => r.name === "vendor");
  
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.firstName || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.lastName || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email || "N/A"}
              </p>
            </div>
            
            {!isVendor && (
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.roles?.[0]?.name || "User"}
                </p>
              </div>
            )}
            
            {isVendor && user?.vendor && (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Company Name
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.vendor.companyName}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    City
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.vendor.city}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Aadhaar No
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.vendor.aadharNo}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    PAN No
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.vendor.panNo}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
