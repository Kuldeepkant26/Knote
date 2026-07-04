import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toFormErrors } from "@/lib/formErrors";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import AuthLink from "@/components/auth/AuthLink";
import PasswordRules from "@/components/auth/PasswordRules";
import { isPasswordValid } from "@/lib/passwordRules";

export default function Signup() {
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({ fieldErrors: {}, formError: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({ fieldErrors: {}, formError: "" });

    // Client-side checks before hitting the API.
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
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate("/dashboard", { replace: true });
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
          Create your account
        </h1>
        <p className="mt-1 text-sm text-mauve-500">Start organizing your notes</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {errors.formError && <FormError message={errors.formError} />}

        <TextField
          id="name"
          name="name"
          label="Name"
          placeholder="Jane Doe"
          autoComplete="name"
          value={form.name}
          onChange={onChange}
          error={errors.fieldErrors.name}
        />

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
          <PasswordField
            id="password"
            name="password"
            label="Password"
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
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirm}
          onChange={onChange}
          error={errors.fieldErrors.confirm}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mauve-500">
        Already have an account? <AuthLink to="/login">Sign in</AuthLink>
      </p>
    </div>
  );
}
