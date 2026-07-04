import { Link } from "react-router-dom";

export default function AuthLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`font-medium text-accent-600 transition hover:text-accent-700 hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}
