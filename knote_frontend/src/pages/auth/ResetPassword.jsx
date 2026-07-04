import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { authApi } from "@/services/authApi";
import { toFormErrors } from "@/lib/formErrors";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import AuthLink from "@/components/auth/AuthLink";
import PasswordRules from "@/components/auth/PasswordRules";
import { isPasswordValid } from "@/lib/passwordRules";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({ fieldErrors: {}, formError: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({ fieldErrors: {}, formError: "" });

    const clientErrors = {};
    if (!isPasswordValid(form.password)) {
      clientErrors.password = "Password doesn't meet the requirements below";
    }
    if (form.password !== form.confirm) {
      clientErrors.confirm = "Passwords do not match";
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors({ fieldErrors: clientErrors, formError: "" });
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword({ token, password: form.password });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (err) {
      setErrors(toFormErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Password updated
        </h1>
        <p className="mt-2 text-sm text-mauve-500">
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-mauve-500">
          Choose a strong password for your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {errors.formError && (
          <div className="space-y-2">
            <FormError message={errors.formError} />
            <p className="text-center text-sm text-mauve-500">
              Link expired? <AuthLink to="/forgot-password">Request a new one</AuthLink>
            </p>
          </div>
        )}

        <div>
          <PasswordField
            id="password"
            name="password"
            label="New password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            error={errors.fieldErrors.password}
          />
          <PasswordRules value={form.password} />
        </div>

        <PasswordField
          id="confirm"
          name="confirm"
          label="Confirm new password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirm}
          onChange={onChange}
          error={errors.fieldErrors.confirm}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mauve-500">
        <AuthLink to="/login">Back to sign in</AuthLink>
      </p>
    </div>
  );
}
