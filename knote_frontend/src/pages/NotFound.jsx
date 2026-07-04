import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="card max-w-md p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
          <Compass size={28} />
        </div>
        <h1 className="font-display text-3xl font-semibold text-mauve-800">404</h1>
        <p className="mt-2 text-mauve-500">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Go home
        </Link>
      </div>
    </div>
  );
}
