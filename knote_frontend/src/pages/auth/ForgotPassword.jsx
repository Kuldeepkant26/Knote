import { useState } from "react";
import { MailCheck } from "lucide-react";
import { authApi } from "@/services/authApi";
import { toFormErrors } from "@/lib/formErrors";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import AuthLink from "@/components/auth/AuthLink";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ fieldErrors: {}, formError: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({ fieldErrors: {}, formError: "" });
    setSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setErrors(toFormErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
          <MailCheck size={28} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-mauve-500">
          If an account exists for <span className="font-medium text-mauve-700">{email}</span>,
          we&apos;ve sent a link to reset your password.
        </p>
        <div className="mt-6">
          <AuthLink to="/login">Back to sign in</AuthLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Forgot password?
        </h1>
        <p className="mt-1 text-sm text-mauve-500">
          Enter your email and we&apos;ll send you a reset link
        </p>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.fieldErrors.email}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mauve-500">
        Remembered it? <AuthLink to="/login">Back to sign in</AuthLink>
      </p>
    </div>
  );
}
