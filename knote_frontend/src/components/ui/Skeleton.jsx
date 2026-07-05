// Shimmer placeholder block. Size/shape via className (e.g. "h-4 w-32").
export default function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
