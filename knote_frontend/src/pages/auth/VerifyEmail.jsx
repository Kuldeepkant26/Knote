import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toFormErrors } from "@/lib/formErrors";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import AuthLink from "@/components/auth/AuthLink";

const RESEND_COOLDOWN_SEC = 30;

export default function VerifyEmail() {
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendOtp = useAuthStore((s) => s.resendOtp);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({ fieldErrors: {}, formError: "" });
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef(null);

  // No email in state = someone landed here directly (refresh, back button,
  // bookmark) rather than via the signup flow — send them back to start.
  useEffect(() => {
    if (!email) navigate("/signup", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onChangeOtp = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(digitsOnly);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({ fieldErrors: {}, formError: "" });

    if (otp.length !== 6) {
      setErrors({ fieldErrors: { otp: "Enter the 6-digit code" }, formError: "" });
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp({ email, otp });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrors(toFormErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setErrors({ fieldErrors: {}, formError: "" });
    setResending(true);
    try {
      await resendOtp(email);
      setResent(true);
      setCooldown(RESEND_COOLDOWN_SEC);
      inputRef.current?.focus();
    } catch (err) {
      setErrors(toFormErrors(err));
    } finally {
      setResending(false);
    }
  };

  if (!email) return null; // redirecting via the effect above

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
          <MailCheck size={28} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Check your email
        </h1>
        <p className="mt-1 text-sm text-mauve-500">
          We sent a 6-digit code to <span className="font-medium text-mauve-700">{email}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {errors.formError && <FormError message={errors.formError} />}

        <div>
          <label htmlFor="otp" className="field-label text-center">
            Verification code
          </label>
          <input
            ref={inputRef}
            id="otp"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={onChangeOtp}
            autoFocus
            className={`input text-center text-2xl font-semibold tracking-[0.5em] ${
              errors.fieldErrors.otp ? "input-error" : ""
            }`}
          />
          {errors.fieldErrors.otp && (
            <p className="mt-1.5 text-sm text-danger-600">{errors.fieldErrors.otp}</p>
          )}
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          Verify account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-mauve-500">
        {resent && cooldown > 0 ? (
          <span>Code sent — you can resend again in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={resending || cooldown > 0}
            className="font-medium text-accent-600 transition hover:text-accent-700 hover:underline disabled:opacity-50 disabled:hover:no-underline"
          >
            {resending ? "Sending…" : "Didn't get a code? Resend"}
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-mauve-500">
        Wrong email? <AuthLink to="/signup">Start over</AuthLink>
      </p>
    </div>
  );
}
