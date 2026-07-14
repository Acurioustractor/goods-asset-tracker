'use client';

// Route-level error boundary for the whole /admin tree. Before this existed,
// any render error in any of the ~65 admin pages fell through to the root
// error handling and lost the admin context entirely.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-900">Something broke in the admin</h2>
      <p className="mt-2 text-sm text-gray-600">
        The error has been logged to the console. You can retry, or head back to the dashboard.
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-gray-400">digest: {error.digest}</p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Try again
        </button>
        <a
          href="/admin"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Admin home
        </a>
      </div>
    </div>
  );
}
