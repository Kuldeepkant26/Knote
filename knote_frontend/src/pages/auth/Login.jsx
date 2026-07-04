import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toFormErrors } from "@/lib/formErrors";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import AuthLink from "@/components/auth/AuthLink";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ fieldErrors: {}, formError: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({ fieldErrors: {}, formError: "" });
    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setErrors(toFormErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-mauve-500">Sign in to your account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {errors.formError && <FormError message={errors.formError} />}

        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          error={errors.fieldErrors.email}
        />

        <div>
          <div className="flex items-center justify-between">
            <span className="field-label mb-0">Password</span>
            <AuthLink to="/forgot-password" className="text-sm">
              Forgot password?
            </AuthLink>
          </div>
          <div className="mt-1.5">
            <PasswordField
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={onChange}
              error={errors.fieldErrors.password}
            />
          </div>
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mauve-500">
        Don&apos;t have an account? <AuthLink to="/signup">Create one</AuthLink>
      </p>
    </div>
  );
}
