import { forwardRef } from "react";

const TextField = forwardRef(function TextField(
  { label, id, error, className = "", ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`input ${error ? "input-error" : ""}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
    </div>
  );
});

export default TextField;
