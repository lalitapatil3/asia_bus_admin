import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
// import { authController } from "../../controllers/authController";
import { ApiError } from "../../services/apiClient";
import { authStorage } from "../../utils/auth";

interface FormState {
  email: string;
  password: string;
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(() => authStorage.isRemembered());
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.email || !formState.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Bypass authentication API call since backend is not yet setup
      // const response = await authController.login({
      //   email: formState.email,
      //   password: formState.password,
      //   deviceToken: undefined,
      // });

      // Mock a successful response
      const response = {
        success: true,
        token: "mock-jwt-token-for-testing",
        user: { id: 1, name: "Admin User", email: formState.email },
        message: "Login successful"
      };

      if (!response.success) {
        setError(response.message || "Unable to sign in. Please try again.");
        return;
      }

      authStorage.saveSession(response.token, response.user, {
        remember: isChecked,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Unable to sign in. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    setIsChecked(authStorage.isRemembered());
  }, []);
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange("email")}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={formState.password}
                      onChange={handleChange("password")}
                      disabled={loading}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  {/* <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link> */}
                </div>
                {error && <p className="text-sm text-error-500">{error}</p>}
                <div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
