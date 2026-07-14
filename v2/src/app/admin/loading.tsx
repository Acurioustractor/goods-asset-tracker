// Shared loading state for the /admin tree — a quiet skeleton instead of a
// blank screen while server components fetch.
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4 py-8" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-56 rounded bg-gray-200" />
      <div className="h-4 w-80 rounded bg-gray-100" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-28 rounded-lg bg-gray-100" />
        <div className="h-28 rounded-lg bg-gray-100" />
        <div className="h-28 rounded-lg bg-gray-100" />
      </div>
      <div className="h-64 rounded-lg bg-gray-50" />
    </div>
  );
}
